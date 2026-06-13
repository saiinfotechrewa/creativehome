/**
 * Renders a schema.org JSON-LD payload into a <script> tag. Server-only;
 * accepts any plain object produced by the builders in lib/structured-data.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: the data is built from our own
      // typed content, never untrusted user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
