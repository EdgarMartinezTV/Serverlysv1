import { Container } from "@/components/ui/container";

/**
 * Shown above every Spanish legal page. Edgar's decision (2026-11-01): legal
 * pages in Spanish are a courtesy translation and the English text governs.
 */
export function CourtesyNotice({ path }: { path: string }) {
  return (
    <div className="border-b border-line bg-canvas-secondary">
      <Container width="reading" className="py-3">
        <p className="text-small text-fg-secondary">
          Traducción de cortesía. Si hay alguna diferencia, la{" "}
          <a href={path} hrefLang="en" lang="en" className="font-medium text-primary underline underline-offset-2">
            versión en inglés
          </a>{" "}
          es la que rige.
        </p>
      </Container>
    </div>
  );
}
