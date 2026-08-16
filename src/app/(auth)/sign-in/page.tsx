"use client";

import Link from "next/link";
import { FormEvent, useState, Suspense } from "react";
import { login, ApiError } from "@/lib/api";
import { validateEmail, validateSignIn } from "@/lib/auth-validation";
import { AuthSplit, AuthField, useAuthRedirect } from "@/components/marketing/AuthLayout";

function SignInForm() {
  const { redirect, router } = useAuthRedirect();
  const [email, setEmail] = useState("student@nexora.campus");
  const [password, setPassword] = useState("Campus#2026");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validateSignIn(email, password);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    setLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
      redirect();
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
      setLoading(false);
    }
  };

  return (
    <AuthSplit
      badge="Campus access"
      brandTitle="Sign in."
      brandSubtitle="Students submit requests. Staff approve them. Administrators configure the workflow."
      brandTags={["Workflows", "SLA", "Audit trail"]}
      brandFooter="Nexora Campus · Configurable operations"
      formEyebrow="Sign in"
      formTitle="Welcome back"
      formSubtitle="Demo password is Campus#2026."
      footer={
        <p className="text-center text-sm text-foreground-muted">
          No account?{" "}
          <Link href="/sign-up" className="inline-link font-bold">
            Create one
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <AuthField
          id="email"
          label="Email"
          type="email"
          icon="mail"
          value={email}
          onChange={(v) => setEmail(v)}
          error={errors.email}
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          icon="lock"
          value={password}
          onChange={(v) => setPassword(v)}
          error={errors.password}
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthSplit>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
