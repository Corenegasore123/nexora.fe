"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, ReactNode, useState } from "react";
import { Icon } from "@/components/icons/Icon";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="auth-card animate-fade-in">
      <div className="auth-card-toolbar">
        <Link href="/" className="auth-close-btn" aria-label="Back to home">
          <Icon name="x" size={18} />
        </Link>
      </div>

      <Link href="/" className="auth-logo group">
        <span className="auth-logo-mark">QS</span>
        <span className="auth-logo-text">QuantScope</span>
      </Link>

      <div className="auth-card-header">
        <h1 className="auth-card-title">{title}</h1>
        <p className="auth-card-subtitle">{subtitle}</p>
      </div>

      <div className="auth-card-body">{children}</div>
      <div className="auth-card-footer">{footer}</div>
    </div>
  );
}

export function AuthField({
  id,
  label,
  type,
  icon,
  value,
  onChange,
  placeholder,
  autoComplete,
  password = false,
}: {
  id: string;
  label: string;
  type: string;
  icon: "mail" | "lock" | "user";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  password?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const inputType = password ? (visible ? "text" : "password") : type;

  return (
    <div>
      <label htmlFor={id} className="auth-label">
        {label}
      </label>
      <div className="input-with-icon">
        <span className="input-icon">
          <Icon name={icon} size={18} />
        </span>
        <input
          id={id}
          type={inputType}
          required
          autoComplete={autoComplete}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`input-field w-full ${password ? "pr-11" : ""}`}
        />
        {password && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="input-action"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            <Icon name={visible ? "eye-off" : "eye"} size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

export function AuthFormSuspense({ children }: { children: ReactNode }) {
  return <Suspense>{children}</Suspense>;
}

export function useAuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/app";
  const redirect = () => router.push(from.startsWith("/app") ? from : "/app");
  return { redirect, router };
}
