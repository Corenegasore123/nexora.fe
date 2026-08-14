export type AccountRole = "USER" | "ADMIN";

export function isAdmin(role: AccountRole) {
  return role === "ADMIN";
}

export function isEngineer(role: AccountRole) {
  return role === "USER";
}

/** Display label for the engineer-facing app (USER maps to Engineer). */
export function displayRole(role: AccountRole) {
  return role === "ADMIN" ? "Administrator" : "Engineer";
}
