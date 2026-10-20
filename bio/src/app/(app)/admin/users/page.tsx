import type { Metadata } from "next";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/auth";
import { PageHeader, Body } from "@/components/dashboard/page-header";
import { ActionButton, Flash, Pager, Pill, fmtDate } from "@/components/admin/ui";
import { resendUserVerification, setUserRole, setUserSuspended } from "@/lib/actions/admin";

export const metadata: Metadata = { title: "Users" };
const PER = 50;

export default async function AdminUsers({ searchParams }: { searchParams: Promise<{ q?: string; p?: string; msg?: string }> }) {
  const me = await requireAdmin();
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.p) || 1);
  const where: Prisma.UserWhereInput = sp.q ? { OR: [{ email: { contains: sp.q, mode: "insensitive" } }, { name: { contains: sp.q, mode: "insensitive" } }] } : {};
  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PER,
      skip: (page - 1) * PER,
      // Explicit select: password hashes never leave the database here.
      select: { id: true, email: true, name: true, role: true, status: true, emailVerifiedAt: true, createdAt: true, lastLoginAt: true, _count: { select: { pages: true } } },
    }),
    db.user.count({ where }),
  ]);
  const backTo = `/admin/users?${new URLSearchParams(Object.entries({ q: sp.q, p: sp.p }).filter(([, v]) => v) as [string, string][])}`;
  return (
    <>
      <PageHeader title="Users" description={`${total.toLocaleString()} account${total === 1 ? "" : "s"}`} />
      <Body>
        <Flash msg={sp.msg} />
        <form method="get" className="card mb-5 flex gap-3 p-4">
          <label className="sr-only" htmlFor="q">
            Search users
          </label>
          <input id="q" name="q" defaultValue={sp.q} placeholder="Search by email or name" className="field min-h-10 flex-1 text-small" />
          <button className="btn h-10 bg-fg px-4 text-small text-white">Search</button>
        </form>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[920px] text-small" aria-label="Users">
            <thead className="border-b border-line text-left text-fg-muted">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Pages</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Last login</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((u) => (
                <tr key={u.id} data-user-row={u.email}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-fg">{u.name || "—"}</p>
                    <p className="text-fg-muted">{u.email}</p>
                    {!u.emailVerifiedAt ? <Pill tone="warn">Unverified</Pill> : null}
                  </td>
                  <td className="px-4 py-3">{u.role === "ADMIN" ? <Pill tone="info">Admin</Pill> : "User"}</td>
                  <td className="px-4 py-3">{u.status === "SUSPENDED" ? <Pill tone="bad">Suspended</Pill> : <Pill tone="ok">Active</Pill>}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{u._count.pages}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-fg-muted">{fmtDate(u.createdAt)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-fg-muted">{fmtDate(u.lastLoginAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {u.id !== me.id ? (
                        <ActionButton action={setUserSuspended} fields={{ userId: u.id, suspend: u.status === "SUSPENDED" ? "0" : "1", back: backTo }} label={u.status === "SUSPENDED" ? "Unsuspend" : "Suspend"} tone={u.status === "SUSPENDED" ? "default" : "danger"} />
                      ) : null}
                      {u.id !== me.id ? <ActionButton action={setUserRole} fields={{ userId: u.id, role: u.role === "ADMIN" ? "USER" : "ADMIN", back: backTo }} label={u.role === "ADMIN" ? "Remove admin" : "Make admin"} /> : <span className="text-[12px] text-fg-muted">You</span>}
                      {!u.emailVerifiedAt ? <ActionButton action={resendUserVerification} fields={{ userId: u.id, back: backTo }} label="Resend verification" /> : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!users.length ? <p className="p-8 text-center text-fg-muted">No users match.</p> : null}
        </div>
        <Pager page={page} per={PER} total={total} base={{ q: sp.q }} />
      </Body>
    </>
  );
}
