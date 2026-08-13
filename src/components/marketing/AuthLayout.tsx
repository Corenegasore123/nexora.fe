"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, ReactNode, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { PasswordStrength } from "@/components/marketing/PasswordStrength";

const TechnicalDrawingVisual = dynamic(
  () => import("@/components/marketing/TechnicalDrawingVisual").then((m) => m.TechnicalDrawingVisual),
  { ssr: false, loading: () => <div className="h-full w-full bg-[#2a3844]" aria-hidden /> }
);

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
        <div className="absolute inset-0 opacity-20">
          <TechnicalDrawingVisual className="h-full w-full scale-110 object-cover" compact />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#354554] via-[#2a3844] to-[#1e2a35]" />
        <div className="relative flex h-full min-h-[280px] flex-col justify-between p-8 md:min-h-0 md:p-10">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/90">
            <Icon name="shield" size={14} className="text-accent" />
            {badge}
          </span>
          <div className="my-auto py-8">
            <h1 className="text-3xl font-bold uppercase leading-tight tracking-tight text-white md:text-4xl">
              {brandTitle}
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">{brandSubtitle}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {brandTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs font-medium text-white/40">{brandFooter}</p>
        </div>
      </div>

      <div className="relative flex flex-col justify-center p-8 md:p-10 lg:p-12">
        <Link href="/" className="auth-close-btn absolute right-4 top-4 md:right-6 md:top-6" aria-label="Back to home">
          <Icon name="x" size={18} />
        </Link>

        <p className="text-xs font-bold uppercase tracking-widest text-foreground-muted">{formEyebrow}</p>
        <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">{formTitle}</h2>
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
  const inputType = password ? (visible ? "text" : "password") : type;

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
          className={`input-field w-full ${password ? "!pr-12" : ""} ${error ? "input-field-error" : ""}`}
        />
        {password && (
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
      {showStrength && password && (
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
  const from = searchParams.get("from") ?? "/app";
  const redirect = () => router.push(from.startsWith("/app") ? from : "/app");
  return { redirect, router };
}
