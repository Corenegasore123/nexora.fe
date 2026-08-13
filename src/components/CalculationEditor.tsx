"use client";

import { useState } from "react";
import { correctVariable, createScenario } from "@/lib/api";

interface Variable {
  name: string;
  value: number;
  unit: string;
  confidence: number;
}

interface Revision {
  id: string;
  version: number;
  label: string | null;
  result: number;
  unit: string;
  createdAt: string;
}

interface Scenario {
  id: string;
  scenarioName: string | null;
  version: number;
  result: { result: number; unit: string } | null;
}

interface Props {
  jobId: string;
  version: number;
  variables: Variable[];
  revisions: Revision[];
  scenarios: Scenario[];
  onUpdated: () => void;
}

export function CalculationEditor({
  jobId,
  version,
  variables,
  revisions,
  scenarios,
  onUpdated,
}: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scenarioName, setScenarioName] = useState("");
  const [showScenario, setShowScenario] = useState(false);

  const handleSave = async (name: string) => {
    const value = parseFloat(editValue);
    if (Number.isNaN(value)) {
      setError("Enter a valid number");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await correctVariable(jobId, name, value, "m");
      setEditing(null);
      onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateScenario = async () => {
    if (!scenarioName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const overrides: Record<string, { value: number }> = {};
      for (const v of variables) {
        if (editing === v.name && editValue) {
          overrides[v.name] = { value: parseFloat(editValue) };
        }
      }
      const { jobId: newId } = await createScenario(jobId, scenarioName, overrides);
      window.location.href = `/calculations/${newId}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scenario failed");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-foreground-muted">
          Version {version}
        </p>
        <button
          type="button"
          onClick={() => setShowScenario(!showScenario)}
          className="btn-secondary py-2 text-xs"
        >
          What-if scenario
        </button>
      </div>

      {showScenario && (
        <div className="card space-y-3">
          <p className="text-sm text-foreground-secondary">
            Create a copy with modified inputs to compare results.
          </p>
          <input
            className="input-field w-full"
            placeholder="Scenario name (e.g. Depth increased)"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
          />
          <button
            type="button"
            disabled={loading}
            onClick={handleCreateScenario}
            className="btn-primary"
          >
            Create scenario
          </button>
        </div>
      )}

      {error && (
        <div className="alert-error text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {variables.map((v) => (
          <div key={v.name} className="card-raised">
            <p className="text-xs uppercase tracking-wider text-foreground-muted">
              {v.name.replace(/_/g, " ")}
            </p>
            {editing === v.name ? (
              <div className="mt-2 flex gap-2">
                <input
                  className="input-field flex-1"
                  type="number"
                  step="any"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSave(v.name)}
                  className="btn-primary px-4 py-2 text-xs"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="btn-ghost px-3 py-2 text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <p className="mt-2 text-xl font-semibold text-foreground">
                  {v.value} {v.unit}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(v.name);
                    setEditValue(String(v.value));
                  }}
                  className="mt-2 text-xs text-foreground-muted hover:text-primary"
                >
                  Correct & recalculate
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {revisions.length > 0 && (
        <section>
          <h3 className="section-label">Version History</h3>
          <div className="mt-4 space-y-2">
            {revisions.map((r) => (
              <div key={r.id} className="card-raised flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">
                    v{r.version} — {r.label ?? `Version ${r.version}`}
                  </p>
                  <p className="text-xs text-foreground-muted">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="font-mono text-foreground">
                  {r.result} {r.unit}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {scenarios.length > 0 && (
        <section>
          <h3 className="section-label">Scenarios</h3>
          <div className="mt-4 space-y-2">
            {scenarios.map((s) => (
              <a
                key={s.id}
                href={`/calculations/${s.id}`}
                className="card-raised flex items-center justify-between hover:border-border-strong"
              >
                <p className="text-sm text-foreground">{s.scenarioName ?? "Scenario"}</p>
                <p className="font-mono text-foreground">
                  {s.result ? `${s.result.result} ${s.result.unit}` : "—"}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
