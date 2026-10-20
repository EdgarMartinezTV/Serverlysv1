import { redirect } from "next/navigation";

/** Step 2 of onboarding is the real editor, in wizard mode. */
export default async function WizardStep2({ params }: { params: Promise<{ id: string }> }) {
  redirect(`/editor/${(await params).id}?wizard=1`);
}
