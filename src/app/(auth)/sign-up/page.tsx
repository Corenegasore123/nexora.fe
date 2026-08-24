"use client";

import Link from "next/link";
import { FormEvent, useState, Suspense } from "react";
import { register, ApiError } from "@/lib/api";
import { validateSignUp } from "@/lib/auth-validation";
import { AuthSplit, AuthField, useAuthRedirect } from "@/components/marketing/AuthLayout";

function SignUpForm() {
  const { redirect, router } = useAuthRedirect();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validateSignUp(name, email, password, confirmPassword);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    setLoading(true);
    setError(null);
    try {
      const res = await register(name.trim(), email.trim(), password);
      redirect(res.home);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
      setLoading(false);
    }
  };

  return (
    <AuthSplit
      badge="Join Nexora"
      brandTitle="Save the places you love."
      brandSubtitle="Create a diner account to book tables, keep favorites, and review restaurants you have visited."
      brandTags={["Book a table", "Favorites", "Reviews"]}
      brandFooter="Nexora · Discover where to eat. Book your table."
      formEyebrow="Register"
      formTitle="Create your account"
      formSubtitle="This is a diner account. Restaurant teams are invited by an owner."
      footer={
        <p className="text-center text-sm text-foreground-muted">
          Already registered?{" "}
          <Link href="/sign-in" className="inline-link font-bold">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <AuthField id="name" label="Full name" type="text" icon="user" value={name} onChange={setName} error={errors.name} />
        <AuthField id="email" label="Email" type="email" icon="mail" value={email} onChange={setEmail} error={errors.email} />
        <AuthField
          id="password"
          label="Password"
          type="password"
          icon="lock"
          password
          autoComplete="new-password"
          showStrength
          value={password}
          onChange={setPassword}
          error={errors.password}
        />
        <AuthField
          id="confirm"
          label="Confirm password"
          type="password"
          icon="lock"
          password
          autoComplete="new-password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={errors.confirmPassword}
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Creating…" : "Create account"}
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
