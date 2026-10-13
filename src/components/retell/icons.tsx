import { cn } from "@/lib/utils";

/** 24px line icons for the Retell-style service pages (badges, plan cards). */
const ICONS = {
  team: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7-1a2.5 2.5 0 1 0 0-5M3 19c.6-3 3-4.5 6-4.5s5.4 1.5 6 4.5m1.5-4.4c2.3.3 4 1.7 4.5 4.4",
  report: "M4 4v16h16M8 16v-4m4 4V8m4 8v-6",
  scan: "M4 8V5a1 1 0 0 1 1-1h3m8 0h3a1 1 0 0 1 1 1v3m0 8v3a1 1 0 0 1-1 1h-3m-8 0H5a1 1 0 0 1-1-1v-3m3-4h10",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  pin: "M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  growth: "M4 19 10 13l4 4 6-8M15 9h5v5",
  building: "M5 21V9l7-5 7 5v12M9 21v-6h6v6",
  code: "M8 8l-4 4 4 4m8-8 4 4-4 4M14 5l-4 14",
  eye: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  server: "M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4l3 2",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4m8-4v4M8 14h2m4 0h2m-8 3h2",
  layout: "M4 4h16v16H4zM4 9h16M9 9v11",
  pen: "M14.5 4.5l5 5L9 20H4v-5L14.5 4.5ZM12 7l5 5",
  doc: "M7 3h7l4 4v14H7zM10 11h5m-5 4h5",
  phone:
    "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3 15h2",
  rocket:
    "M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2m-.5-6.5L12 7c3-3 6.5-4 9-4 0 2.5-1 6-4 9l-4.5 4.5M7.5 11.5l5 5M15 9.01V9",
  loop: "M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3m13-2v2a3 3 0 0 1-3 3H4",
  shield: "M12 3 5 6v5c0 4.4 3 7.9 7 10 4-2.1 7-5.6 7-10V6l-7-3Zm-3 9 2 2 4-4.5",
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-6 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={ICONS[name]} />
    </svg>
  );
}
