"use client";

import { useEffect, useState } from "react";
import { getCalculationRules } from "@/lib/api";

interface Rule {
  id: string;
  name: string;
  category: string;
  method: string;
  formula: { expression: string; latex: string };
  outputUnit: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  geometry: "Geometry",
  quantity: "Quantity",
  cost: "Costing",
};

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    getCalculationRules().then((data) => setRules(data.rules));
  }, []);

  const grouped = rules.reduce<Record<string, Rule[]>>((acc, rule) => {
    const cat = rule.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(rule);
    return acc;
  }, {});

  return (
    <div className="page-shell">
      <p className="eyebrow">Calculation Engine</p>
      <h1 className="page-title mt-3">Calculation Rules</h1>
      <p className="page-subtitle">
        Registered calculation rules used by the quantity engine (methodology v1.0.0)
      </p>

      <div className="mt-12 space-y-12">
        {Object.entries(grouped).map(([category, categoryRules]) => (
          <section key={category}>
            <h2 className="section-label">{CATEGORY_LABELS[category] ?? category}</h2>
            <div className="mt-4 space-y-3">
              {categoryRules.map((rule) => (
                <div key={rule.id} className="card-raised">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs text-foreground-placeholder">{rule.id}</p>
                      <h3 className="mt-1 font-semibold text-foreground">{rule.name}</h3>
                    </div>
                    <span className="status-badge shrink-0">{rule.method.replace(/_/g, " ")}</span>
                  </div>
                  <p className="mt-3 font-mono text-sm text-foreground-secondary">{rule.formula.expression}</p>
                  <p className="mt-2 text-xs text-foreground-placeholder">Output: {rule.outputUnit}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
