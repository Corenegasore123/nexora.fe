"use client";

import { FormEvent, useState, Suspense } from "react";
import { ApiError, changePassword } from "@/lib/api";
import { validateConfirmPassword, validatePassword } from "@/lib/auth-validation";
import { AuthSplit, AuthField, useAuthRedirect } from "@/components/marketing/AuthLayout";

function ChangePasswordForm() {
  const { redirect, router } = useAuthRedirect();
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const passwordError = validatePassword(newPassword, true);
    const confirmError = validateConfirmPassword(newPassword, confirm);
    if (passwordError || confirmError) {
      setError(passwordError ?? confirmError ?? null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await changePassword(currentPassword, newPassword);
      redirect(res.home);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not change password");
      setLoading(false);
    }
  };

  return (
    <AuthSplit
      badge="Security"
      brandTitle="Welcome to Nexora."
      brandSubtitle="For security, you must change your temporary password before opening a workspace."
      brandTags={["Owner invite", "First login"]}
      brandFooter="Nexora · Restaurant owners"
      formEyebrow="First login"
      formTitle="Change your password"
      formSubtitle="You cannot access the restaurant dashboard until this is done."
      footer={<p className="text-center text-sm text-foreground-muted">This is required for invited owners and staff.</p>}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <AuthField
          id="current"
          label="Current password"
          type="password"
          icon="lock"
          password
          autoComplete="current-password"
          value={currentPassword}
          onChange={setCurrent}
        />
        <AuthField
          id="new"
          label="New password"
          type="password"
          icon="lock"
          password
          autoComplete="new-password"
          showStrength
          value={newPassword}
          onChange={setNew}
        />
        <AuthField
          id="confirm"
          label="Confirm password"
          type="password"
          icon="lock"
          password
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Saving…" : "Continue"}
        </button>
      </form>
    </AuthSplit>
  );
}

export default function ChangePasswordPage() {
  return (
    <Suspense>
      <ChangePasswordForm />
    </Suspense>
  );
}
