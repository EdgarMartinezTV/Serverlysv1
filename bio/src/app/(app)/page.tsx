import { redirect } from "next/navigation";
import { getUser } from "@/lib/server/auth";

/** bio.serverlys.com/ → the dashboard when signed in, otherwise the product page. */
export default async function AppHome() {
  if (await getUser()) redirect("/dashboard");
  redirect(process.env.MARKETING_URL ?? "https://serverlys.com/bio");
}
