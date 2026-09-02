import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default async function ResetPasswordPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?error=auth");
  }

  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Set a new password for your Meetly account."
      footer={
        <>
          <Link href="/dashboard" className="font-semibold text-primary hover:underline">
            Go to dashboard
          </Link>
        </>
      }
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
