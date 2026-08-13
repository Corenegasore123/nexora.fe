export type FieldErrors = Record<string, string | undefined>;

export function validateEmail(email: string): string | undefined {
  const value = email.trim();
  if (!value) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
  return undefined;
}

export function validateName(name: string): string | undefined {
  const value = name.trim();
  if (!value) return "Full name is required";
  if (value.length < 2) return "Name must be at least 2 characters";
  if (value.length > 100) return "Name must be under 100 characters";
  return undefined;
}

export function validatePassword(password: string, register = false): string | undefined {
  if (!password) return "Password is required";
  if (register) {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password.length > 128) return "Password must be under 128 characters";
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      return "Include both uppercase and lowercase letters";
    }
    if (!/\d/.test(password)) return "Include at least one number";
  }
  return undefined;
}

export function validateConfirmPassword(password: string, confirm: string): string | undefined {
  if (!confirm) return "Please confirm your password";
  if (password !== confirm) return "Passwords do not match";
  return undefined;
}

export type PasswordStrengthResult = {
  bars: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: "error" | "warning" | "fair" | "good" | "strong";
};

export function getPasswordStrength(password: string): PasswordStrengthResult {
  if (!password) return { bars: 0, label: "", color: "error" };

  let points = 0;
  if (password.length >= 8) points++;
  if (password.length >= 12) points++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points++;
  if (/\d/.test(password)) points++;
  if (/[^A-Za-z0-9]/.test(password)) points++;

  if (points <= 1) return { bars: 1, label: "Weak", color: "error" };
  if (points === 2) return { bars: 2, label: "Fair", color: "warning" };
  if (points === 3) return { bars: 3, label: "Good", color: "good" };
  return { bars: 4, label: "Strong", color: "strong" };
}

export function validateSignIn(email: string, password: string): FieldErrors {
  return {
    email: validateEmail(email),
    password: password ? undefined : "Password is required",
  };
}

export function validateSignUp(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): FieldErrors {
  return {
    name: validateName(name),
    email: validateEmail(email),
    password: validatePassword(password, true),
    confirmPassword: validateConfirmPassword(password, confirmPassword),
  };
}
