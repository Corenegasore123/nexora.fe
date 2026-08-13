"use client";

import { getPasswordStrength } from "@/lib/auth-validation";

export function PasswordStrength({ password }: { password: string }) {
  const { bars, label, color } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="password-strength" aria-live="polite">
      <div className="password-strength-bars" role="presentation">
        {[1, 2, 3, 4].map((level) => (
          <span
            key={level}
            className={`password-strength-bar ${level <= bars ? `password-strength-bar-${color}` : ""}`}
          />
        ))}
      </div>
      <p className={`password-strength-label password-strength-label-${color}`}>{label}</p>
    </div>
  );
}
