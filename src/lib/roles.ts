export function displayRole(role?: string) {
  const map: Record<string, string> = {
    PLATFORM_ADMIN: "Platform admin",
    OWNER: "Owner",
    ADMIN: "Administrator",
    MANAGER: "Manager",
    CASHIER: "Cashier",
    WAITER: "Waiter",
    CHEF: "Chef",
    KITCHEN: "Kitchen",
    INVENTORY_MANAGER: "Inventory",
    ACCOUNTANT: "Accountant",
    CUSTOMER: "Guest",
  };
  return map[role ?? ""] ?? role ?? "Staff";
}
