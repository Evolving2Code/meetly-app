import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { AuthShell } from "@/components/auth/AuthShell";
import { EmailAuthForm } from "@/components/auth/EmailAuthForm";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { MicrosoftSignInButton } from "@/components/auth/MicrosoftSignInButton";
import { Alert } from "@/components/ui/Alert";

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const user = await getSessionUser();
  const params = await searchParams;

  if (user) {
    redirect("/dashboard");
  }

  const error = typeof params.error === "string" ? params.error : null;
  const message = typeof params.message === "string" ? params.message : null;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in with email, Google, or Microsoft to manage your schedule."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      {message === "password-updated" && (
        <Alert variant="success" className="mb-4">
          Password updated. Sign in with your new password.
        </Alert>
      )}

      {error && (
        <Alert variant="error" className="mb-4">
          Sign in failed. Please try again.
        </Alert>
      )}

      <EmailAuthForm mode="login" />
      <p className="mt-3 text-right text-sm">
        <Link href="/forgot-password" className="font-semibold text-primary hover:underline">
          Forgot password?
        </Link>
      </p>
      <AuthDivider />
      <div className="space-y-3">
        <GoogleSignInButton label="Continue with Google" />
        <MicrosoftSignInButton label="Continue with Microsoft" />
      </div>
    </AuthShell>
  );
}
