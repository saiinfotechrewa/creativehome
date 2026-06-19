import type { Order } from "@prisma/client";

/**
 * Minimal, dependency-free PDF invoice generator.
 *
 * Rather than pull in a PDF library (and its peer-dep baggage), this writes a
 * valid single-page PDF by hand: a fixed A4 page, the two standard Type1 fonts
 * (Helvetica / Helvetica-Bold), and a content stream of positioned text. It's
 * deliberately plain — enough for a clean, printable GST-style invoice — and
 * can be swapped for a richer renderer later without changing callers.
 */

const PAGE_WIDTH = 595; // A4 @ 72dpi
const PAGE_HEIGHT = 842;
const MARGIN = 50;

interface Line {
  text: string;
  x: number;
  y: number;
  size: number;
  bold: boolean;
}

/** Escape the characters that are syntactically special inside a PDF string. */
function escapePdfText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    // Drop anything outside the printable Latin range; core fonts can't show it.
    .replace(/[^\x20-\x7E]/g, "");
}

function inr(amount: number): string {
  // "Rs." rather than the ₹ glyph — the core PDF fonts have no rupee sign.
  return `Rs. ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function s(value: unknown, fallback = ""): string {
  return typeof value === "string" && value ? value : fallback;
}

function n(value: unknown): number {
  return typeof value === "number" ? value : 0;
}

export interface InvoiceCompany {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: Record<string, unknown>;
  gstNumber?: string | null;
}

/** Build the list of text lines that make up the invoice. */
function layout(order: Order, company: InvoiceCompany): Line[] {
  const lines: Line[] = [];
  const pricing = asRecord(order.pricing);
  const product = asRecord(order.product);
  const info = asRecord(order.customerInfo);
  const invoice = asRecord(order.invoice);
  const addr = asRecord(company.address);

  let y = PAGE_HEIGHT - MARGIN;
  const add = (text: string, opts: Partial<Line> = {}) => {
    lines.push({
      text,
      x: opts.x ?? MARGIN,
      y: opts.y ?? y,
      size: opts.size ?? 10,
      bold: opts.bold ?? false,
    });
  };
  const right = (text: string, opts: Partial<Line> = {}) =>
    add(text, { ...opts, x: PAGE_WIDTH - MARGIN - text.length * (opts.size ?? 10) * 0.5 });

  // Header
  add(company.name, { size: 20, bold: true });
  y -= 18;
  if (s(company.email)) { add(s(company.email), { size: 9 }); y -= 12; }
  if (s(company.phone)) { add(s(company.phone), { size: 9 }); y -= 12; }
  const cityLine = [s(addr.city), s(addr.state), s(addr.pincode)]
    .filter(Boolean)
    .join(", ");
  if (cityLine) { add(cityLine, { size: 9 }); y -= 12; }
  if (s(company.gstNumber)) { add(`GSTIN: ${s(company.gstNumber)}`, { size: 9 }); y -= 12; }

  // Title + meta
  y -= 18;
  add("TAX INVOICE", { size: 16, bold: true });
  right(`Invoice #: ${s(invoice.number, order.orderNumber)}`, { size: 10 });
  y -= 16;
  right(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, { size: 10 });
  y -= 16;
  right(`Status: ${order.status}`, { size: 10 });
  y -= 24;

  // Bill to
  add("Bill To", { size: 11, bold: true });
  y -= 14;
  add(s(info.name, "Customer"), { size: 10 });
  y -= 12;
  if (s(info.email)) { add(s(info.email), { size: 9 }); y -= 12; }
  if (s(info.phone)) { add(s(info.phone), { size: 9 }); y -= 12; }
  if (s(info.gstNumber)) { add(`GSTIN: ${s(info.gstNumber)}`, { size: 9 }); y -= 12; }

  // Line item header
  y -= 18;
  add("Description", { size: 10, bold: true });
  right("Amount", { size: 10, bold: true });
  y -= 6;
  add("________________________________________________________________", { size: 10 });
  y -= 16;

  // Single line item (product)
  const qty = n(product.qty) || 1;
  const desc = `${s(product.name, "Product")}${product.plan ? ` — ${s(product.plan)}` : ""} x ${qty}`;
  add(desc, { size: 10 });
  right(inr(n(pricing.subtotal)), { size: 10 });
  y -= 20;

  // Totals
  add("Subtotal", { size: 10 });
  right(inr(n(pricing.subtotal)), { size: 10 });
  y -= 14;
  if (n(pricing.discount) > 0) {
    add("Discount", { size: 10 });
    right(`- ${inr(n(pricing.discount))}`, { size: 10 });
    y -= 14;
  }
  add("Tax (GST)", { size: 10 });
  right(inr(n(pricing.tax)), { size: 10 });
  y -= 14;
  add("Total", { size: 12, bold: true });
  right(inr(n(pricing.total)), { size: 12, bold: true });
  y -= 30;

  // Footer
  add("Thank you for your business!", { size: 10, bold: true });
  y -= 14;
  add("This is a computer-generated invoice and does not require a signature.", {
    size: 8,
  });

  return lines;
}

/** Render the content stream operators for the laid-out lines. */
function contentStream(lines: Line[]): string {
  const parts: string[] = [];
  for (const line of lines) {
    const font = line.bold ? "/F2" : "/F1";
    parts.push(
      `BT ${font} ${line.size} Tf 1 0 0 1 ${line.x.toFixed(2)} ${line.y.toFixed(
        2,
      )} Tm (${escapePdfText(line.text)}) Tj ET`,
    );
  }
  return parts.join("\n");
}

/** Generate the invoice as PDF bytes (an `ArrayBuffer`, ready for a Response). */
export function generateInvoicePdf(
  order: Order,
  company: InvoiceCompany,
): ArrayBuffer {
  const stream = contentStream(layout(order, company));

  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
      `/Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>`,
    `<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((body, i) => {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    pdf += `${off.toString().padStart(10, "0")} 00000 n \n`;
  }
  pdf +=
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n` +
    `startxref\n${xrefOffset}\n%%EOF`;

  // Copy into a standalone ArrayBuffer (a clean BodyInit for Response).
  const bytes = Buffer.from(pdf, "utf8");
  const out = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(out).set(bytes);
  return out;
}
