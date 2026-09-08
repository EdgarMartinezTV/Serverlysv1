/**
 * Renders a structured-data block.
 *
 * JSON.stringify output is escaped for `<` so a string in the data cannot
 * close the script tag early. Data here is authored by us, never user input,
 * but the escape is cheap and removes the class of bug entirely.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
