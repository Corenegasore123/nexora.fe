export default function SettingsPage() {
  const settings = [
    {
      key: "NEXT_PUBLIC_API_URL",
      value: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
      desc: "Backend API endpoint",
    },
    {
      value: process.env.NEXT_PUBLIC_CONFIDENCE_AUTO_ACCEPT ?? "0.95",
      desc: "Auto-accept threshold",
    },
    {
      key: "CONFIDENCE_FLAG",
      value: process.env.NEXT_PUBLIC_CONFIDENCE_FLAG ?? "0.80",
      desc: "Flag for review threshold",
    },
    {
      key: "CV_SERVICE_URL",
      value: "http://localhost:8000",
      desc: "Computer vision service endpoint",
    },
    {
      key: "CV_OCR_PROVIDER",
      value: "tesseract",
      desc: "OCR provider (tesseract | mock)",
    },
    {
      key: "MAX_UPLOAD_SIZE_MB",
      value: "20",
      desc: "Maximum upload size",
    },
  ];

  return (
    <div className="page-shell">
      <p className="eyebrow">Configuration</p>
      <h1 className="page-title mt-3">Settings</h1>

      <div className="mt-10 space-y-3">
        {settings.map((s) => (
          <div key={s.key} className="card-raised">
            <p className="font-mono text-sm font-medium text-foreground">{s.key}</p>
            <p className="mt-1 text-sm font-light text-foreground-secondary">{s.desc}</p>
            <p className="mt-3 font-mono text-xs text-foreground-muted">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
