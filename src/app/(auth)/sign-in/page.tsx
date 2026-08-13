"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { login, ApiError } from "@/lib/api";
import { Icon } from "@/components/icons/Icon";
import { AuthCard, AuthField, AuthFormSuspense, useAuthRedirect } from "@/components/marketing/AuthLayout";

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
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to access your workspace, projects, and calculations."
      footer={
        <p className="text-center text-sm text-foreground-muted">
          No account?{" "}
          <Link href="/sign-up" className="inline-link font-medium">
            Create one
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthField
          id="email"
          label="Email address"
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
          password
        />
        {error && <div className="alert-error text-sm">{error}</div>}
        <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2 py-3.5">
          {loading ? "Signing in…" : "Sign in"}
          {!loading && <Icon name="arrow-right" size={16} />}
        </button>
      </form>
    </AuthCard>
  );
}

export default function SignInPage() {
  return (
    <AuthFormSuspense>
      <SignInForm />
    </AuthFormSuspense>
  );
}
