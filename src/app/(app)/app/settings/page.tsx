"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { askAssistant } from "@/lib/api";
import { FormEvent, useState } from "react";

export default function SettingsPage() {
  const [question, setQuestion] = useState("Why are transcript requests taking so long?");
  const [answer, setAnswer] = useState<string | null>(null);

  const ask = async (e: FormEvent) => {
    e.preventDefault();
    const res = await askAssistant(question);
    setAnswer(res.answer);
  };

  return (
    <div className="page-shell grid gap-6 lg:grid-cols-2">
      <article className="card space-y-4">
        <p className="eyebrow">Appearance</p>
        <p className="text-sm text-foreground-secondary">Light, dark, or follow the system.</p>
        <ThemeToggle variant="settings" />
      </article>
      <article className="card space-y-4">
        <p className="eyebrow">Nexora Assistant</p>
        <p className="text-sm text-foreground-secondary">Optional. Answers come from live request metrics, not a required GPU model.</p>
        <form onSubmit={ask} className="space-y-3">
          <input className="w-full rounded-lg border border-border px-3 py-2 text-sm" value={question} onChange={(e) => setQuestion(e.target.value)} />
          <button className="btn-secondary">Ask</button>
        </form>
        {answer && <pre className="whitespace-pre-wrap text-sm text-foreground-secondary">{answer}</pre>}
      </article>
    </div>
  );
}
