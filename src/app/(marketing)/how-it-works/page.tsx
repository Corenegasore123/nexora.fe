export default function HowItWorksPage() {
  return (
    <div className="page-shell space-y-8 pt-28">
      <p className="eyebrow">How it works</p>
        <h1 className="page-title">Nexora has three products.</h1>
        <p className="page-subtitle">
          Platform admins create restaurant owners. Owners set up restaurants and staff. Guests discover and book tables
          — then the reservation becomes a live service flow.
        </p>
      <pre className="card overflow-x-auto text-sm leading-7">
{`CUSTOMER
   ↓
RESERVATION / WALK-IN
   ↓
TABLE
   ↓
ORDER
   ↓
KITCHEN
   ↓
PREPARATION
   ↓
SERVING
   ↓
PAYMENT
   ↓
INVENTORY
   ↓
ACCOUNTING DATA
   ↓
ANALYTICS`}
      </pre>
      <pre className="card overflow-x-auto text-sm leading-7">
{`                    NEXORA
                       │
       ┌───────────────┼────────────────┐
       │               │                │
   FRONT OF HOUSE   KITCHEN        BACK OFFICE
       │               │                │
 Reservations       KDS             Inventory
 Tables             Orders          Suppliers
 Customers          Recipes         Purchasing
 Waiters            Production      Staff
 POS                Delivery        Finance
       │               │                │
       └───────────────┼────────────────┘
                       │
                BUSINESS INTELLIGENCE
                       │
             Reports • Analytics • Alerts`}
      </pre>
    </div>
  );
}
