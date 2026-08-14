"use client";

import { useEffect, useMemo, useState } from "react";
import { getCalculationRules } from "@/lib/api";
import { Icon } from "@/components/icons/Icon";
import { useSetAppPageMeta } from "@/components/app/AppPageContext";
import { SkeletonTable } from "@/components/ui/Skeleton";

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

type CategoryFilter = "all" | keyof typeof CATEGORY_LABELS | string;

function methodLabel(method: string) {
  return method.replace(/_/g, " ");
}

function matchesSearch(rule: Rule, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    rule.name.toLowerCase().includes(q) ||
    rule.id.toLowerCase().includes(q) ||
    rule.formula.expression.toLowerCase().includes(q) ||
    rule.category.toLowerCase().includes(q)
  );
}

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CategoryFilter>("all");

  useEffect(() => {
    getCalculationRules()
      .then((data) => setRules(data.rules))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(rules.map((r) => r.category));
    return Array.from(set).sort();
  }, [rules]);

  const stats = useMemo(
    () => ({
      total: rules.length,
      geometry: rules.filter((r) => r.category === "geometry").length,
      quantity: rules.filter((r) => r.category === "quantity").length,
      cost: rules.filter((r) => r.category === "cost").length,
    }),
    [rules]
  );

  const filtered = useMemo(() => {
    const byCategory = filter === "all" ? rules : rules.filter((r) => r.category === filter);
    return byCategory.filter((r) => matchesSearch(r, search));
  }, [rules, filter, search]);

  const pageSubtitle = loading
    ? "Loading calculation rules…"
    : `${stats.total} rule${stats.total === 1 ? "" : "s"} · methodology v1.0.0`;

  useSetAppPageMeta({ title: "Calculation Rules", subtitle: pageSubtitle });

  if (loading) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-metrics">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="dashboard-metric animate-pulse">
              <div className="h-3 w-20 rounded bg-border" />
              <div className="mt-3 h-8 w-12 rounded bg-border" />
            </div>
          ))}
        </div>
        <div className="mt-6">
          <SkeletonTable rows={8} />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <div className="dashboard-metrics">
        <div className="dashboard-metric">
          <span className="dashboard-metric-label">Total rules</span>
          <span className="dashboard-metric-value">{stats.total}</span>
        </div>
        <div className="dashboard-metric">
          <span className="dashboard-metric-label">Geometry</span>
          <span className="dashboard-metric-value">{stats.geometry}</span>
        </div>
        <div className="dashboard-metric">
          <span className="dashboard-metric-label">Quantity</span>
          <span className="dashboard-metric-value">{stats.quantity}</span>
        </div>
        <div className="dashboard-metric">
          <span className="dashboard-metric-label">Costing</span>
          <span className="dashboard-metric-value">{stats.cost}</span>
        </div>
      </div>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <span className="settings-section-icon">
            <Icon name="book-open" size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-foreground">Rule registry</h2>
            <p className="mt-1 text-xs text-foreground-muted">
              Formulas and methods used by the quantity calculation engine.
            </p>
          </div>
        </div>

        <div className="rules-toolbar">
          <label className="rules-search">
            <span className="sr-only">Search rules</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, or formula…"
              className="input-field rules-search-input"
            />
          </label>
        </div>

        <div className="rules-filters" role="tablist" aria-label="Rule categories">
          <button
            type="button"
            role="tab"
            aria-selected={filter === "all"}
            onClick={() => setFilter("all")}
            className={`rules-filter-tab ${filter === "all" ? "rules-filter-tab-active" : ""}`}
          >
            All
            <span className="rules-filter-count">{rules.length}</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={filter === cat}
              onClick={() => setFilter(cat)}
              className={`rules-filter-tab ${filter === cat ? "rules-filter-tab-active" : ""}`}
            >
              {CATEGORY_LABELS[cat] ?? cat}
              <span className="rules-filter-count">
                {rules.filter((r) => r.category === cat).length}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="dashboard-empty">
            <p className="text-sm font-medium text-foreground">No rules found</p>
            <p className="mt-1 text-sm text-foreground-muted">
              {search.trim()
                ? "Try a different search term or clear the filter."
                : "No rules match the selected category."}
            </p>
          </div>
        ) : (
          <div className="dashboard-table-wrap">
            <table className="data-table rules-table">
              <thead>
                <tr>
                  <th>Rule</th>
                  <th className="hidden md:table-cell">Category</th>
                  <th className="hidden lg:table-cell">Method</th>
                  <th>Formula</th>
                  <th className="hidden sm:table-cell">Output</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((rule) => (
                  <tr key={rule.id}>
                    <td>
                      <p className="font-medium text-foreground">{rule.name}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-foreground-muted">{rule.id}</p>
                    </td>
                    <td className="hidden md:table-cell">
                      <span className="status-badge status-pending">
                        {CATEGORY_LABELS[rule.category] ?? rule.category}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell">
                      <span className="status-badge status-processing">{methodLabel(rule.method)}</span>
                    </td>
                    <td>
                      <code className="rules-formula">{rule.formula.expression}</code>
                    </td>
                    <td className="hidden font-mono text-xs text-foreground-secondary sm:table-cell">
                      {rule.outputUnit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
