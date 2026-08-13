"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { login, ApiError } from "@/lib/api";
import { Icon } from "@/components/icons/Icon";
import { AuthField, AuthFormSuspense, AuthLayout, useAuthRedirect } from "@/components/marketing/AuthLayout";

function SignInForm() {
  const { redirect, router } = useAuthRedirect();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      redirect();
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      badge="Workspace access"
      title="Sign in."
      subtitle="Secure access to your projects, calculations, measurement review, and report exports."
      footer={
        <p className="text-center text-sm text-foreground-muted">
          No account?{" "}
          <Link href="/sign-up" className="inline-link">
            Create one
          </Link>
        </p>
      }
    >
      <p className="eyebrow">Sign in</p>
      <h2 className="mt-2 text-2xl font-bold text-foreground">Welcome back</h2>
      <p className="mt-1 text-sm text-foreground-secondary">Use your credentials to continue.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <AuthField
          id="email"
          label="Email"
          type="email"
          icon="mail"
          value={email}
          onChange={setEmail}
          placeholder="you@company.com"
          autoComplete="email"
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          icon="lock"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />
        {error && <div className="alert-error text-sm">{error}</div>}
        <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2">
          {loading ? "Signing in…" : "Access workspace"}
          {!loading && <Icon name="arrow-right" size={16} />}
        </button>
      </form>
    </AuthLayout>
  );
}

export default function SignInPage() {
  return (
    <AuthFormSuspense>
      <SignInForm />
    </AuthFormSuspense>
  );
}
