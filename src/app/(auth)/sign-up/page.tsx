"use client";

import Link from "next/link";
import { FormEvent, useState, Suspense } from "react";
import { register, ApiError } from "@/lib/api";
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
  validateSignUp,
} from "@/lib/auth-validation";
import { Icon } from "@/components/icons/Icon";
import { AuthSplit, AuthField, useAuthRedirect } from "@/components/marketing/AuthLayout";
import { useCookieConsentRequired } from "@/components/CookieConsent";

function SignUpForm() {
  const { redirect, router } = useAuthRedirect();
  const cookieConsented = useCookieConsentRequired();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateField = (field: "name" | "email" | "password" | "confirmPassword") => {
    setErrors((prev) => ({
      ...prev,
      name: field === "name" ? validateName(name) : prev.name,
      email: field === "email" ? validateEmail(email) : prev.email,
      password: field === "password" ? validatePassword(password, true) : prev.password,
      confirmPassword:
        field === "confirmPassword" || field === "password"
          ? validateConfirmPassword(password, confirmPassword)
          : prev.confirmPassword,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validateSignUp(name, email, password, confirmPassword);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);
    setError(null);
    try {
      await register(name.trim(), email.trim(), password, confirmPassword);
      redirect();
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
      setLoading(false);
    }
  };

  return (
    <AuthSplit
      badge="Get started"
      brandTitle="Create account."
      brandSubtitle="Start uploading diagrams, running verified calculations, and exporting audit-ready reports."
      brandTags={["Upload", "Analyze", "Export"]}
      brandFooter="Free to start · No credit card required"
      formEyebrow="Register"
      formTitle="Get started free"
      formSubtitle="Create your workspace in under a minute."
      footer={
        <p className="text-center text-sm text-foreground-muted">
          Already have an account?{" "}
          <Link href="/sign-in" className="inline-link font-bold">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <AuthField
          id="name"
          label="Full name"
          type="text"
          icon="user"
          value={name}
          onChange={(v) => {
            setName(v);
            if (errors.name) validateField("name");
          }}
          onBlur={() => validateField("name")}
          placeholder="Jane Engineer"
          autoComplete="name"
          error={errors.name}
        />
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
            if (errors.confirmPassword && confirmPassword) validateField("confirmPassword");
          }}
          onBlur={() => validateField("password")}
          placeholder="Password"
          autoComplete="new-password"
          password
          showStrength
          error={errors.password}
        />
        <AuthField
          id="confirm"
          label="Confirm password"
          type="password"
          icon="lock"
          value={confirmPassword}
          onChange={(v) => {
            setConfirmPassword(v);
            if (errors.confirmPassword) validateField("confirmPassword");
          }}
          onBlur={() => validateField("confirmPassword")}
          placeholder="Confirm password"
          autoComplete="new-password"
          password
          error={errors.confirmPassword}
        />
        {error && <div className="alert-error text-sm font-medium">{error}</div>}
        {!cookieConsented && (
          <p className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground-secondary">
            Accept essential cookies using the banner below before creating an account.
          </p>
        )}
        <button type="submit" disabled={loading || !cookieConsented} className="btn-auth-submit">
          {loading ? "Creating account…" : "Create account"}
          {!loading && <Icon name="arrow-right" size={16} />}
        </button>
      </form>
    </AuthSplit>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
