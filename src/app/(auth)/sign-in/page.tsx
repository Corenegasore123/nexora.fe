"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { login, ApiError } from "@/lib/api";
import { Icon } from "@/components/icons/Icon";
import { AuthSplit, AuthField, AuthFormSuspense, useAuthRedirect } from "@/components/marketing/AuthLayout";

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
    <AuthSplit
      badge="Workspace access"
      brandTitle="Sign in."
      brandSubtitle="Secure access to your projects, calculations, measurement review, and report exports."
      brandTags={["OCR", "Calculations", "Audit trail"]}
      brandFooter="Deterministic logic · Full traceability · Team workspaces"
      formEyebrow="Sign in"
      formTitle="Welcome back"
      formSubtitle="Use your credentials to continue."
      footer={
        <p className="text-center text-sm text-foreground-muted">
          No account?{" "}
          <Link href="/sign-up" className="inline-link font-bold">
            Create one
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
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
          placeholder="Password"
          autoComplete="current-password"
          password
        />
        {error && <div className="alert-error text-sm font-medium">{error}</div>}
        <button type="submit" disabled={loading} className="btn-auth-submit">
          {loading ? "Signing in…" : "Access workspace"}
          {!loading && <Icon name="arrow-right" size={16} />}
        </button>
      </form>
    </AuthSplit>
  );
}

export default function SignInPage() {
  return (
    <AuthFormSuspense>
      <SignInForm />
    </AuthFormSuspense>
  );
}
