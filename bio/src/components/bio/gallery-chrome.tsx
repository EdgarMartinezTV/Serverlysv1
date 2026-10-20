import Link from "next/link";
import { Logo } from "@/components/ui/logo";

/** Floating pill nav for the public template pages (mirrors linktr.ee/s/templates). */
export function GalleryNav({ signedIn }: { signedIn: boolean }) {
  return (
    <div className="px-4 pt-6 sm:px-8">
      <nav aria-label="Serverlys Bio" className="mx-auto flex h-[72px] max-w-[1296px] items-center justify-between rounded-full bg-white pr-3 pl-6 shadow-[0_1px_2px_rgb(0_0_0/0.06)] sm:pl-8">
        <Logo href={process.env.MARKETING_URL ?? "https://serverlys.com/bio"} />
        <div className="flex items-center gap-2">
          <Link href="/templates" className="hidden rounded-full px-4 py-2 text-[16px] text-[#1e2330] hover:bg-[#f3f3f1] sm:inline-block">
            Templates
          </Link>
          {signedIn ? (
            <Link href="/dashboard" className="rounded-full bg-[#1e2330] px-5 py-3 text-[16px] font-medium text-white hover:opacity-90">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-4 py-2 text-[16px] text-[#1e2330] hover:bg-[#f3f3f1]">
                Log in
              </Link>
              <Link href="/signup" className="rounded-full bg-[#1e2330] px-5 py-3 text-[16px] font-medium text-white hover:opacity-90">
                Sign up free
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
