import "server-only";
import { db } from "./db";
import { parseDoc } from "@/lib/bio/schema";

export async function activeTemplates() {
  const rows = await db.template.findMany({ where: { active: true }, orderBy: [{ featured: "desc" }, { sortOrder: "asc" }] });
  return rows.map((r) => ({ id: r.id, name: r.name, category: r.category, description: r.description, featured: r.featured, doc: parseDoc(r.content) }));
}
