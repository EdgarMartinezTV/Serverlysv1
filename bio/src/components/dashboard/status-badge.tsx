const STYLES: Record<string, string> = {
  PUBLISHED: "bg-success-soft text-success",
  DRAFT: "bg-canvas-inset text-fg-secondary",
  UNPUBLISHED: "bg-warning-soft text-warning",
  SUSPENDED: "bg-error-soft text-error",
};
const LABELS: Record<string, string> = { PUBLISHED: "Live", DRAFT: "Draft", UNPUBLISHED: "Unpublished", SUSPENDED: "Suspended" };

export function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-semibold ${STYLES[status] ?? STYLES.DRAFT}`}>{LABELS[status] ?? status}</span>;
}
