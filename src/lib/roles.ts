export function displayRole(role?: string) {
  if (role === "ADMIN") return "Administrator";
  if (role === "STAFF") return "Staff";
  return "Student";
}
