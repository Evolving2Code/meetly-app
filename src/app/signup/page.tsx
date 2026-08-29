import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { AuthShell } from "@/components/auth/AuthShell";
import { EmailAuthForm } from "@/components/auth/EmailAuthForm";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { AuthDivider } from "@/components/auth/AuthDivider";

export default async function SignupPage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Sign up with email or Google. Connect Google Calendar later in Settings."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-lime-dark hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <EmailAuthForm mode="signup" />
      <AuthDivider />
      <GoogleSignInButton label="Sign up with Google" />
    </AuthShell>
  );
}
