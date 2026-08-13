"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense, ReactNode } from "react";
import { Icon } from "@/components/icons/Icon";

export function AuthLayout({
  title,
  subtitle,
  badge,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  badge: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="px-4 py-8 md:py-12">
      <div className="auth-split">
        <div className="auth-split-brand marketing-hero-grid relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-ink-deep" />
          <div className="relative flex flex-col justify-between">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/80">
              <Icon name="shield" size={14} className="text-primary" />
              {badge}
            </span>
            <div className="my-auto py-10">
              <h1 className="text-3xl font-bold uppercase leading-tight tracking-tight md:text-4xl">
                {title}
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">{subtitle}</p>
            </div>
            <p className="text-xs text-white/40">
              Deterministic calculations · Full audit trail · Team workspaces
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center p-8 md:p-10">
          {children}
          <div className="mt-8">{footer}</div>
        </div>
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
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  icon: "mail" | "lock" | "user";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs uppercase tracking-wider text-foreground-muted">
        {label}
      </label>
      <div className="input-with-icon">
        <span className="input-icon">
          <Icon name={icon} size={18} />
        </span>
        <input
          id={id}
          type={type}
          required
          autoComplete={autoComplete}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="input-field w-full"
        />
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
