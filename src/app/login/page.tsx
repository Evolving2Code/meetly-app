import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { AuthShell } from "@/components/auth/AuthShell";
import { EmailAuthForm } from "@/components/auth/EmailAuthForm";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { AuthDivider } from "@/components/auth/AuthDivider";

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const user = await getSessionUser();
  const params = await searchParams;

  if (user) {
    redirect("/dashboard");
  }

  const error = typeof params.error === "string" ? params.error : null;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in with email or Google to manage your schedule."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-lime-dark hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Sign in failed. Please try again.
        </div>
      )}

      <EmailAuthForm mode="login" />
      <AuthDivider />
      <GoogleSignInButton label="Continue with Google" />
    </AuthShell>
  );
}
