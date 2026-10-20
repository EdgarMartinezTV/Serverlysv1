import Link from "next/link";
import { requireUser } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { logoutAction } from "@/lib/actions/auth";
import { DashboardNav } from "@/components/dashboard/nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/dashboard");
  const latest = await db.bioPage.findFirst({ where: { ownerId: user.id }, orderBy: { updatedAt: "desc" }, select: { id: true } });
  return (
    <div className="min-h-dvh bg-canvas-secondary lg:flex">
      <DashboardNav
        user={{ name: user.name, email: user.email, admin: user.role === "ADMIN" }}
        editorHref={latest ? `/editor/${latest.id}` : null}
        logout={logoutAction}
        items={[
          { href: "/dashboard", label: "Overview", icon: "home", exact: true },
          { href: "/dashboard/pages", label: "My Bio Pages", icon: "pages" },
          { href: "/dashboard/new", label: "Create New", icon: "plus" },
          { href: "/dashboard/templates", label: "Templates", icon: "grid" },
          { href: "/dashboard/analytics", label: "Analytics", icon: "chart" },
          { href: "/dashboard/leads", label: "Leads", icon: "inbox" },
          { href: "/dashboard/domains", label: "Domains", icon: "globe" },
          { href: "/dashboard/settings", label: "Account Settings", icon: "user" },
          { href: "/dashboard/help", label: "Help", icon: "help" },
        ]}
      />
      <main id="main" className="min-w-0 flex-1">
        {!user.emailVerifiedAt ? (
          <div className="border-b border-warning-fill/40 bg-warning-soft px-5 py-3 text-small text-warning">
            Confirm your email ({user.email}) to publish pages.{" "}
            <Link href="/verify-email" className="font-semibold underline">
              Resend the link
            </Link>
          </div>
        ) : null}
        {children}
      </main>
    </div>
  );
}
