const FEATURES = [
  "Configurable workflows",
  "Approval engine with statuses and SLA",
  "Unified staff inbox",
  "Document attachments and generated letters",
  "Asset lifecycle",
  "Role-based dashboards",
  "Audit trail",
  "Live analytics",
  "REST API + Swagger",
  "Optional Nexora Assistant",
];

export default function FeaturesPage() {
  return (
    <div className="page-shell pt-28">
      <p className="eyebrow">Features</p>
      <h1 className="page-title">Built for campus operations.</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {FEATURES.map((f) => (
          <article key={f} className="card-raised">
            <p className="font-semibold">{f}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
