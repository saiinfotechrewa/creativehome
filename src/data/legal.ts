import type { LegalDocument } from "@/lib/types";
import { SITE_CONFIG } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  Legal / policy documents                                           */
/*                                                                     */
/*  Standard SaaS templates written in plain language. These are a     */
/*  reasonable starting point, not legal advice — have counsel review  */
/*  before relying on them in production.                              */
/* ------------------------------------------------------------------ */

const UPDATED = "2026-06-01";

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description: `How ${SITE_CONFIG.name} collects, uses, and protects your personal data across our websites and software products.`,
    updated: UPDATED,
    intro: `This Privacy Policy explains how ${SITE_CONFIG.name} ("we", "us", or "our") collects, uses, shares, and safeguards information when you visit our website, create an account, or use our software products and services. By using our services, you agree to the practices described here.`,
    sections: [
      {
        id: "information-we-collect",
        heading: "1. Information We Collect",
        blocks: [
          {
            type: "paragraph",
            text: "We collect information you provide directly, information generated as you use our services, and information from third parties that help us operate.",
          },
          {
            type: "list",
            items: [
              "Account data — name, business name, email address, phone number, and billing details you provide at sign-up.",
              "Usage data — pages viewed, features used, device and browser type, IP address, and approximate location.",
              "Customer content — data you and your team enter into our products, such as invoices, leads, and attendance records.",
              "Communications — messages you send to our support, sales, and feedback channels.",
            ],
          },
        ],
      },
      {
        id: "how-we-use-information",
        heading: "2. How We Use Your Information",
        blocks: [
          {
            type: "paragraph",
            text: "We use the information we collect to deliver, maintain, and improve our services and to communicate with you.",
          },
          {
            type: "list",
            items: [
              "Provide, operate, and secure the products you subscribe to.",
              "Process payments, send invoices, and manage your subscription.",
              "Respond to support requests and send service-related notices.",
              "Improve product performance and develop new features.",
              "Send product updates and marketing you can opt out of at any time.",
            ],
          },
        ],
      },
      {
        id: "sharing-and-disclosure",
        heading: "3. How We Share Information",
        blocks: [
          {
            type: "paragraph",
            text: "We do not sell your personal data. We share information only in the limited circumstances below.",
          },
          {
            type: "list",
            items: [
              "Service providers — vetted vendors for hosting, payments, analytics, and messaging who process data on our behalf.",
              "Legal compliance — when required by law, regulation, or valid legal process.",
              "Business transfers — in connection with a merger, acquisition, or sale of assets, with notice to you.",
              "With your consent — whenever you direct us to share data with a third party.",
            ],
          },
        ],
      },
      {
        id: "data-security",
        heading: "4. Data Security",
        blocks: [
          {
            type: "paragraph",
            text: "We use encryption in transit, access controls, and regular backups to protect your data. No method of transmission or storage is completely secure, but we work continuously to safeguard your information and to notify you promptly of any breach affecting your data.",
          },
        ],
      },
      {
        id: "data-retention",
        heading: "5. Data Retention",
        blocks: [
          {
            type: "paragraph",
            text: "We retain your information for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce agreements. You may request deletion of your data, subject to records we are legally required to keep.",
          },
        ],
      },
      {
        id: "your-rights",
        heading: "6. Your Rights",
        blocks: [
          {
            type: "paragraph",
            text: "Depending on your location, you may have the right to access, correct, export, or delete your personal data, and to object to or restrict certain processing.",
          },
          {
            type: "list",
            items: [
              "Access and receive a copy of the data we hold about you.",
              "Correct inaccurate or incomplete information.",
              "Request deletion of your personal data.",
              "Opt out of marketing communications at any time.",
            ],
          },
        ],
      },
      {
        id: "cookies",
        heading: "7. Cookies & Tracking",
        blocks: [
          {
            type: "paragraph",
            text: "We use cookies and similar technologies to keep you signed in, remember preferences, and understand how our services are used. You can control cookies through your browser settings, though some features may not work without them.",
          },
        ],
      },
      {
        id: "contact",
        heading: "8. Contact Us",
        blocks: [
          {
            type: "paragraph",
            text: `If you have questions about this Privacy Policy or your data, contact us at ${SITE_CONFIG.email} or write to ${SITE_CONFIG.name}, ${SITE_CONFIG.address}.`,
          },
        ],
      },
    ],
  },
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    description: `The terms governing your use of ${SITE_CONFIG.name} websites, software products, and related services.`,
    updated: UPDATED,
    intro: `These Terms of Service ("Terms") govern your access to and use of the websites, software, and services provided by ${SITE_CONFIG.name} ("we", "us", or "our"). By creating an account or using our services, you agree to these Terms. If you are using the services on behalf of an organization, you accept these Terms for that organization.`,
    sections: [
      {
        id: "acceptance",
        heading: "1. Acceptance of Terms",
        blocks: [
          {
            type: "paragraph",
            text: "By accessing or using our services, you confirm that you can form a binding contract and that you accept these Terms and our Privacy Policy. If you do not agree, you may not use the services.",
          },
        ],
      },
      {
        id: "accounts",
        heading: "2. Accounts & Eligibility",
        blocks: [
          {
            type: "paragraph",
            text: "You are responsible for the accuracy of your account information and for keeping your credentials secure.",
          },
          {
            type: "list",
            items: [
              "You must provide accurate, current, and complete information at sign-up.",
              "You are responsible for all activity that occurs under your account.",
              "Notify us immediately of any unauthorized use of your account.",
              "You must be at least 18 years old or have authority to bind your organization.",
            ],
          },
        ],
      },
      {
        id: "subscriptions",
        heading: "3. Subscriptions & Billing",
        blocks: [
          {
            type: "paragraph",
            text: "Paid plans are billed in advance on a recurring basis. Fees are stated at the time of purchase and are exclusive of applicable taxes unless noted.",
          },
          {
            type: "list",
            items: [
              "Subscriptions renew automatically until cancelled.",
              "You can cancel at any time; access continues until the end of the paid period.",
              "Refunds, where applicable, are governed by our Refund Policy.",
              "We may change pricing with reasonable advance notice.",
            ],
          },
        ],
      },
      {
        id: "acceptable-use",
        heading: "4. Acceptable Use",
        blocks: [
          {
            type: "paragraph",
            text: "You agree to use our services lawfully and responsibly. You may not:",
          },
          {
            type: "list",
            items: [
              "Violate any applicable law or the rights of others.",
              "Upload malware or attempt to disrupt or gain unauthorized access to our systems.",
              "Reverse engineer, resell, or sublicense the services without authorization.",
              "Use the services to send spam or unlawful communications.",
            ],
          },
        ],
      },
      {
        id: "intellectual-property",
        heading: "5. Intellectual Property",
        blocks: [
          {
            type: "paragraph",
            text: `The services, including software, design, and content, are owned by ${SITE_CONFIG.name} and protected by intellectual property laws. You retain ownership of the data you submit ("Customer Content"), and you grant us a limited license to host and process it solely to provide the services.`,
          },
        ],
      },
      {
        id: "termination",
        heading: "6. Termination",
        blocks: [
          {
            type: "paragraph",
            text: "You may stop using the services at any time. We may suspend or terminate access if you breach these Terms or use the services in a way that risks harm to us or others. On termination, your right to use the services ends, and we will make your data available for export for a reasonable period.",
          },
        ],
      },
      {
        id: "disclaimers",
        heading: "7. Disclaimers & Limitation of Liability",
        blocks: [
          {
            type: "paragraph",
            text: "The services are provided “as is” without warranties of any kind to the extent permitted by law. To the maximum extent permitted, our total liability for any claim relating to the services is limited to the amount you paid us in the twelve months before the claim arose.",
          },
        ],
      },
      {
        id: "changes",
        heading: "8. Changes to These Terms",
        blocks: [
          {
            type: "paragraph",
            text: "We may update these Terms from time to time. We will post the updated version with a new effective date and, where changes are material, provide additional notice. Continued use after changes take effect constitutes acceptance.",
          },
        ],
      },
      {
        id: "contact",
        heading: "9. Contact Us",
        blocks: [
          {
            type: "paragraph",
            text: `Questions about these Terms can be sent to ${SITE_CONFIG.email} or ${SITE_CONFIG.name}, ${SITE_CONFIG.address}.`,
          },
        ],
      },
    ],
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    description: `When and how ${SITE_CONFIG.name} issues refunds for subscriptions and one-time purchases.`,
    updated: UPDATED,
    intro: `This Refund Policy explains the circumstances under which ${SITE_CONFIG.name} ("we", "us", or "our") provides refunds for its software subscriptions and services. It should be read together with our Terms of Service.`,
    sections: [
      {
        id: "overview",
        heading: "1. Overview",
        blocks: [
          {
            type: "paragraph",
            text: "We want you to be satisfied with our products. Because our services are delivered digitally, refunds are handled case by case according to the rules below.",
          },
        ],
      },
      {
        id: "free-trials",
        heading: "2. Free Trials & Demos",
        blocks: [
          {
            type: "paragraph",
            text: "Where a free trial or demo is offered, you can evaluate the product before paying. You will not be charged until the trial ends, and you may cancel during the trial at no cost.",
          },
        ],
      },
      {
        id: "subscription-refunds",
        heading: "3. Subscription Refunds",
        blocks: [
          {
            type: "paragraph",
            text: "Subscriptions are billed in advance for the chosen period.",
          },
          {
            type: "list",
            items: [
              "New monthly subscriptions may be refunded if you request within 7 days of the initial charge and have not made substantial use of the service.",
              "Annual subscriptions may be refunded on a pro-rata basis within 30 days of the initial charge.",
              "Renewal charges are generally non-refundable, so cancel before your renewal date to avoid the next term.",
              "Setup, onboarding, and custom-development fees are non-refundable once work has begun.",
            ],
          },
        ],
      },
      {
        id: "non-refundable",
        heading: "4. Non-Refundable Items",
        blocks: [
          {
            type: "list",
            items: [
              "Usage-based charges already consumed, such as WhatsApp or SMS message credits.",
              "Third-party fees passed through at cost.",
              "Custom development and professional-services work already delivered.",
            ],
          },
        ],
      },
      {
        id: "how-to-request",
        heading: "5. How to Request a Refund",
        blocks: [
          {
            type: "paragraph",
            text: `To request a refund, email ${SITE_CONFIG.email} from your account email with your invoice number and the reason for the request. We aim to respond within 3 business days.`,
          },
        ],
      },
      {
        id: "processing",
        heading: "6. Processing Time",
        blocks: [
          {
            type: "paragraph",
            text: "Approved refunds are issued to your original payment method within 7–10 business days. The time for funds to appear depends on your bank or card provider.",
          },
        ],
      },
      {
        id: "contact",
        heading: "7. Contact Us",
        blocks: [
          {
            type: "paragraph",
            text: `For any questions about refunds, reach us at ${SITE_CONFIG.email} or call ${SITE_CONFIG.phone}.`,
          },
        ],
      },
    ],
  },
];

/** All legal document slugs. */
export function getLegalSlugs(): string[] {
  return LEGAL_DOCUMENTS.map((doc) => doc.slug);
}

/** Look up a legal document by slug. */
export function getLegalDocument(slug: string): LegalDocument | undefined {
  return LEGAL_DOCUMENTS.find((doc) => doc.slug === slug);
}
