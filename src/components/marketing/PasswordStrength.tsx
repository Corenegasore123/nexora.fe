"use client";

import { getPasswordStrength } from "@/lib/auth-validation";

const STRENGTH_GREEN = "#22c55e";

export function PasswordStrength({ password }: { password: string }) {
  const { bars, label } = getPasswordStrength(password);

  if (!password || bars === 0) return null;

  return (
    <div className="password-strength" aria-live="polite">
      <div className="password-strength-bars" role="presentation" aria-hidden>
        {[1, 2, 3, 4].map((level) => (
          <span
            key={level}
            className="password-strength-bar"
            style={{
              backgroundColor: level <= bars ? STRENGTH_GREEN : "var(--color-border)",
            }}
          />
        ))}
      </div>
      <p className="password-strength-label" style={{ color: STRENGTH_GREEN }}>
        {label}
      </p>
    </div>
  );
}
