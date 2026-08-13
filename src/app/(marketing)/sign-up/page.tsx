"use client";

import Link from "next/link";
import { FormEvent, useState, Suspense } from "react";
import { register, ApiError } from "@/lib/api";
import { Icon } from "@/components/icons/Icon";
import { AuthField, AuthLayout, useAuthRedirect } from "@/components/marketing/AuthLayout";

function SignUpForm() {
  const { redirect, router } = useAuthRedirect();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(name, email, password, confirmPassword);
      redirect();
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      badge="Get started"
      title="Create account."
      subtitle="Start uploading diagrams, running verified calculations, and exporting audit-ready reports."
      footer={
        <p className="text-center text-sm text-foreground-muted">
          Already have an account?{" "}
          <Link href="/sign-in" className="inline-link">
            Sign in
          </Link>
        </p>
      }
    >
      <p className="eyebrow">Register</p>
      <h2 className="mt-2 text-2xl font-bold text-foreground">Get started free</h2>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <AuthField id="name" label="Full name" type="text" icon="user" value={name} onChange={setName} autoComplete="name" />
        <AuthField id="email" label="Email" type="email" icon="mail" value={email} onChange={setEmail} autoComplete="email" />
        <AuthField id="password" label="Password" type="password" icon="lock" value={password} onChange={setPassword} autoComplete="new-password" />
        <AuthField id="confirm" label="Confirm password" type="password" icon="lock" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
        {error && <div className="alert-error text-sm">{error}</div>}
        <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2">
          {loading ? "Creating account…" : "Create account"}
          {!loading && <Icon name="arrow-right" size={16} />}
        </button>
      </form>
    </AuthLayout>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
