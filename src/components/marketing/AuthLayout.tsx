"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, ReactNode, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { BrandMark } from "@/components/BrandMark";
import { PasswordStrength } from "@/components/marketing/PasswordStrength";

export function AuthSplit({
  badge,
  brandTitle,
  brandSubtitle,
  brandTags,
  brandFooter,
  formEyebrow,
  formTitle,
  formSubtitle,
  children,
  footer,
}: {
  badge: string;
  brandTitle: string;
  brandSubtitle: string;
  brandTags: string[];
  brandFooter: string;
  formEyebrow: string;
  formTitle: string;
  formSubtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="auth-split animate-fade-in">
      <div className="auth-split-brand">
        <div className="auth-split-photo" />
        <div className="auth-split-scrim" />
        <div className="relative flex h-full min-h-[280px] flex-col justify-between p-8 md:min-h-0 md:p-10">
          <Link href="/" className="inline-flex items-center gap-2.5 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
              <BrandMark size={18} />
            </span>
            <span className="font-display text-xl font-semibold">Nexora</span>
          </Link>
          <div className="my-auto py-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">{badge}</p>
            <h1 className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight text-white md:text-5xl">
              {brandTitle}
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">{brandSubtitle}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {brandTags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] text-white/80">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-white/50">{brandFooter}</p>
        </div>
      </div>

      <div className="relative flex flex-col justify-center bg-surface p-8 md:p-10 lg:p-12">
        <Link href="/" className="auth-close-btn absolute right-4 top-4 md:right-6 md:top-6" aria-label="Back to home">
          <Icon name="x" size={18} />
        </Link>

        <p className="text-xs font-semibold uppercase tracking-widest text-foreground-muted">{formEyebrow}</p>
        <h2 className="mt-2 font-display text-3xl font-medium text-foreground">{formTitle}</h2>
        <p className="mt-2 text-sm text-foreground-secondary">{formSubtitle}</p>

        <div className="mt-8">{children}</div>
        <div className="mt-8 border-t border-border pt-6">{footer}</div>
      </div>
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
  onBlur,
  placeholder,
  autoComplete,
  password = false,
  required = true,
  error,
  showStrength = false,
}: {
  id: string;
  label: string;
  type: string;
  icon: "mail" | "lock" | "user";
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  autoComplete?: string;
  password?: boolean;
  required?: boolean;
  error?: string;
  showStrength?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = password || type === "password";
  const inputType = isPassword ? (visible ? "text" : "password") : type;

  return (
    <div>
      <label htmlFor={id} className="auth-label">
        {label}
        {required && (
          <span className="auth-required" aria-hidden>
            *
          </span>
        )}
      </label>
      <div className="input-with-icon">
        <span className="input-icon">
          <Icon name={icon} size={18} />
        </span>
        <input
          id={id}
          type={inputType}
          required={required}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : showStrength ? `${id}-strength` : undefined}
          autoComplete={autoComplete}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`input-field w-full ${isPassword ? "!pr-12" : ""} ${error ? "input-field-error" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault();
              setVisible((v) => !v);
            }}
            className="input-action z-10"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
          >
            <Icon name={visible ? "eye-off" : "eye"} size={18} />
          </button>
        )}
      </div>
      {showStrength && isPassword && (
        <div id={`${id}-strength`}>
          <PasswordStrength password={value} />
        </div>
      )}
      {error && (
        <p id={`${id}-error`} className="auth-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function AuthFormSuspense({ children }: { children: ReactNode }) {
  return <Suspense>{children}</Suspense>;
}

export function useAuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const redirect = (home?: string) => {
    const target = from?.startsWith("/") ? from : (home ?? "/app");
    router.push(target);
  };
  return { redirect, router };
}
