import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { AuthShell } from "@/components/auth/AuthShell";
import { EmailAuthForm } from "@/components/auth/EmailAuthForm";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { MicrosoftSignInButton } from "@/components/auth/MicrosoftSignInButton";

export default async function SignupPage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Sign up with email, Google, or Microsoft. Connect Google Calendar later in Settings."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <EmailAuthForm mode="signup" />
      <AuthDivider />
      <div className="space-y-3">
        <GoogleSignInButton label="Sign up with Google" />
        <MicrosoftSignInButton label="Sign up with Microsoft" />
      </div>
    </AuthShell>
  );
}
