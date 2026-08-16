"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDocuments } from "@/lib/api";

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Awaited<ReturnType<typeof getDocuments>>>([]);
  useEffect(() => {
    getDocuments().then(setDocs).catch(() => setDocs([]));
  }, []);

  return (
    <div className="page-shell">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <ul className="divide-y divide-border">
          {docs.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <p className="font-medium">📄 {doc.filename}</p>
                <p className="text-foreground-muted">
                  {doc.request.number} · {doc.request.type.name}
                  {doc.generated ? " · generated" : ""}
                </p>
              </div>
              <Link href={`/app/requests/${doc.request.id}`} className="text-primary">
                Open request
              </Link>
            </li>
          ))}
          {!docs.length && <li className="px-4 py-10 text-center text-foreground-muted">No documents yet.</li>}
        </ul>
      </div>
    </div>
  );
}
