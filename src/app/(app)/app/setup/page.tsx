"use client";

import { useEffect, useState } from "react";
import { getChecklist, type SetupChecklist } from "@/lib/api";

const LABELS: Record<string, string> = {
  restaurant: "Restaurant profile",
  business: "Business information",
  branches: "Branches",
  tables: "Create tables",
  categories: "Create menu categories",
  menu: "Add menu items",
  recipes: "Add recipes",
  ingredients: "Add ingredients",
  inventory: "Configure inventory",
  staff: "Add staff",
  reservations: "Configure reservations",
  payments: "Configure payment methods",
  notifications: "Configure notifications",
};

export default function SetupPage() {
  const [check, setCheck] = useState<SetupChecklist | null>(null);
  useEffect(() => {
    getChecklist().then(setCheck);
  }, []);
  if (!check) return null;
  return (
    <div className="page-shell max-w-xl">
      <p className="eyebrow">Restaurant setup</p>
      <h1 className="mt-2 text-3xl font-bold">Launch checklist</h1>
      <article className="card mt-6 space-y-3">
        {Object.entries(LABELS).map(([key, label]) => (
          <p key={key} className="text-sm">
            {check[key as keyof SetupChecklist] ? "✓" : "○"} {label}
          </p>
        ))}
      </article>
    </div>
  );
}
