export default function ContactPage() {
  return (
    <div className="page-shell pt-28">
      <p className="eyebrow">Contact</p>
      <h1 className="page-title">Open the restaurant workspace.</h1>
      <p className="page-subtitle">
        Sign in with a demo account to walk the full flow: reservation → seating → order → kitchen → payment →
        inventory → analytics.
      </p>
      <div className="mt-8 card max-w-xl space-y-2 text-sm">
        <p>
          <span className="font-medium">Manager</span> · manager@nexora.rw
        </p>
        <p>
          <span className="font-medium">Waiter</span> · waiter@nexora.rw
        </p>
        <p>
          <span className="font-medium">Chef</span> · chef@nexora.rw
        </p>
        <p>
          <span className="font-medium">Cashier</span> · cashier@nexora.rw
        </p>
        <p className="text-foreground-muted">Password: Nexora#2026</p>
      </div>
    </div>
  );
}
