const FEATURES = [
  { title: "Restaurant Command Center", body: "See revenue, occupancy, kitchen load, inventory alerts, and staff status in one live view." },
  { title: "Multi-branch management", body: "Head office sees every location. Branch managers see only their branch. Hierarchical access by role." },
  { title: "Reservations", body: "Date, time, guests, branch, and table preference - with statuses from pending to seated, completed, or no-show." },
  { title: "Smart table management", body: "Interactive floor plan: available, occupied, reserved, or cleaning. Click a table for guest, waiter, order, and bill." },
  { title: "Point of Sale", body: "Fast tickets, tax, discounts, cash, card, and mobile money - one module inside the larger operation." },
  { title: "Kitchen Display System", body: "Orders move from POS to kitchen instantly. New, preparing, ready, then waiter notified." },
  { title: "Menu engineering", body: "Track selling price, ingredient cost, margin, and classify Stars, Plow Horses, Puzzles, and Dogs." },
  { title: "Recipes & inventory", body: "Selling a dish deducts ingredients automatically. Stock alerts drive purchasing." },
  { title: "Procurement & suppliers", body: "Projected need, purchase orders, deliveries, invoices, and supplier performance." },
  { title: "Waste management", body: "Record expired, damaged, overproduced, and returned items - and the money they cost." },
  { title: "Staff & shifts", body: "Roles, attendance, clock-in, and shift coverage across branches." },
  { title: "CRM, loyalty & delivery", body: "Customer profiles, points, feedback, and an internal delivery queue." },
];

export default function FeaturesPage() {
  return (
    <div className="page-shell pt-28">
      <p className="eyebrow">Features</p>
      <h1 className="page-title">The operating system for restaurant operations.</h1>
      <p className="page-subtitle">POS is just one component. Nexora covers the floor, kitchen, back office, and intelligence layer.</p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {FEATURES.map((f) => (
          <article key={f.title} className="card-raised">
            <p className="font-semibold">{f.title}</p>
            <p className="mt-2 text-sm text-foreground-secondary">{f.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
