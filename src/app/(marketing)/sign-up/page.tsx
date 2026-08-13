"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { register, ApiError } from "@/lib/api";

export default function SignUpPage() {
  const router = useRouter();
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
      router.push("/app");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <p className="eyebrow">Get started</p>
        <h1 className="page-title mt-3">Create your account</h1>
        <p className="page-subtitle">Start analyzing diagrams and running verified calculations.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-wider text-foreground-muted">
              Full name
            </label>
            <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="input-field w-full" />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-wider text-foreground-muted">
              Email
            </label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field w-full" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-xs uppercase tracking-wider text-foreground-muted">
              Password
            </label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field w-full" />
          </div>
          <div>
            <label htmlFor="confirm" className="mb-2 block text-xs uppercase tracking-wider text-foreground-muted">
              Confirm password
            </label>
            <input id="confirm" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field w-full" />
          </div>

          {error && <div className="alert-error text-sm">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-foreground-muted">
          Already have an account?{" "}
          <Link href="/sign-in" className="inline-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
