export default function HowItWorksPage() {
  return (
    <div className="page-shell pt-28 space-y-8">
        <p className="eyebrow">How it works</p>
        <h1 className="page-title">A workflow engine, not a hardcoded org chart.</h1>
        <p className="page-subtitle">Administrators configure steps and transitions. The engine creates tasks, enforces SLA, writes events, and notifies people.</p>
        <pre className="card overflow-x-auto text-sm leading-7">
{`Student
   │  Transcript Request
   ↓
Registrar Review
   ├── Reject → Student
   └── Approve
          ↓
      Finance Check
          ├── Outstanding Balance → Student
          └── Clear
                ↓
          Document Generation
                ↓
             Student`}
        </pre>
    </div>
  );
}
