"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { login, ApiError } from "@/lib/api";
import { validateEmail, validateSignIn } from "@/lib/auth-validation";
import { Icon } from "@/components/icons/Icon";
import { AuthSplit, AuthField, AuthFormSuspense, useAuthRedirect } from "@/components/marketing/AuthLayout";
import { useCookieConsentRequired } from "@/components/CookieConsent";

function SignInForm() {
  const { redirect, router } = useAuthRedirect();
  const cookieConsented = useCookieConsentRequired();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateField = (field: "email" | "password") => {
    setErrors((prev) => ({
      ...prev,
      email: field === "email" ? validateEmail(email) : prev.email,
      password: field === "password" ? (password ? undefined : "Password is required") : prev.password,
    }));
  };

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
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <AuthField
          id="email"
          label="Email"
          type="email"
          icon="mail"
          value={email}
          onChange={(v) => {
            setEmail(v);
            if (errors.email) validateField("email");
          }}
          onBlur={() => validateField("email")}
          placeholder="you@company.com"
          autoComplete="email"
          error={errors.email}
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          icon="lock"
          value={password}
          onChange={(v) => {
            setPassword(v);
            if (errors.password) validateField("password");
          }}
          onBlur={() => validateField("password")}
          placeholder="Password"
          autoComplete="current-password"
          password
          error={errors.password}
        />
        {error && <div className="alert-error text-sm font-medium">{error}</div>}
        {!cookieConsented && (
          <p className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground-secondary">
            Accept essential cookies using the banner below before signing in.
          </p>
        )}
        <button type="submit" disabled={loading || !cookieConsented} className="btn-auth-submit">
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
