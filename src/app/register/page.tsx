"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { register, ApiError } from "@/lib/api";

export default function RegisterPage() {
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
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="page-shell flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md">
        <p className="eyebrow">Register</p>
        <h1 className="page-title mt-3">Create your account</h1>
        <p className="page-subtitle">Start analyzing diagrams and running calculations.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-wider text-neutral-500">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field w-full"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-wider text-neutral-500">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-xs uppercase tracking-wider text-neutral-500">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-xs uppercase tracking-wider text-neutral-500">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field w-full"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link href="/login" className="text-white underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
