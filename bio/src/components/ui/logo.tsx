import Image from "next/image";
import Link from "next/link";

/** The real Serverlys lockup (public/brand, copied from the marketing site) + "Bio". */
export function Logo({ href = "/dashboard", tone = "dark" }: { href?: string; tone?: "dark" | "light" }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 rounded-sm" aria-label="Serverlys Bio home">
      <Image src={tone === "light" ? "/brand/logo-on-dark.webp" : "/brand/logo.webp"} alt="Serverlys" width={1653} height={409} className="h-6 w-auto" priority unoptimized />
      <span className={`rounded-full px-2 py-0.5 font-display text-[13px] font-semibold ${tone === "light" ? "bg-white/15 text-white" : "bg-primary-soft text-primary"}`}>Bio</span>
    </Link>
  );
}
