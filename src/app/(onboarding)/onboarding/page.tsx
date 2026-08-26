"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addOnboardingBranch, createRestaurantProfile, getChecklist, saveBusinessSettings, type SetupChecklist } from "@/lib/api";

const HOURS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => ({
  day,
  open: day === "Sunday" ? "10:00" : "08:00",
  close: day === "Sunday" ? "20:00" : "22:00",
}));

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    name: "",
    description: "",
    cuisine: "Rwandan",
    logoUrl: "",
    coverUrl: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    city: "Kigali",
    country: "Rwanda",
  });
  const [settings, setSettings] = useState({ currency: "RWF", timezone: "Africa/Kigali", taxRate: 18 });
  const [hours, setHours] = useState(HOURS);
  const [branch, setBranch] = useState({ name: "", city: "Kigali", address: "" });
  const [branches, setBranches] = useState<{ name: string; city: string }[]>([]);
  const [check, setCheck] = useState<SetupChecklist | null>(null);

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    await createRestaurantProfile(profile);
    setStep(2);
  };

  const saveBiz = async (e: FormEvent) => {
    e.preventDefault();
    await saveBusinessSettings({ ...settings, openingHours: hours });
    setStep(3);
  };

  const addBranch = async (e: FormEvent) => {
    e.preventDefault();
    await addOnboardingBranch(branch);
    setBranches((b) => [...b, branch]);
    setBranch({ name: "", city: "Kigali", address: "" });
  };

  useEffect(() => {
    if (step === 4) getChecklist().then(setCheck);
  }, [step]);

  return (
    <div className="page-shell max-w-2xl py-12">
      <p className="eyebrow">Owner onboarding</p>
      <h1 className="mt-2 text-3xl font-bold">Let&apos;s set up your restaurant</h1>
      <p className="mt-2 text-sm text-foreground-muted">Step {Math.min(step, 4)} of 4</p>

      {step === 1 && (
        <form onSubmit={saveProfile} className="card mt-8 space-y-3">
          <p className="font-semibold">Step 1 - Restaurant profile</p>
          {Object.entries({
            name: "Restaurant name",
            description: "Description",
            cuisine: "Cuisine",
            logoUrl: "Logo URL",
            coverUrl: "Cover image URL",
            phone: "Phone",
            email: "Email",
            website: "Website",
            address: "Address",
            city: "City",
            country: "Country",
          }).map(([key, label]) => (
            <label key={key} className="block text-sm">
              {label}
              <input className="mt-1 w-full rounded-lg border border-border px-3 py-2" value={(profile as Record<string, string>)[key]} onChange={(e) => setProfile({ ...profile, [key]: e.target.value })} required={key === "name"} />
            </label>
          ))}
          <button className="btn-primary">Continue</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={saveBiz} className="card mt-8 space-y-3">
          <p className="font-semibold">Business settings</p>
          <label className="block text-sm">
            Currency
            <input className="mt-1 w-full rounded-lg border border-border px-3 py-2" value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} />
          </label>
          <label className="block text-sm">
            Timezone
            <input className="mt-1 w-full rounded-lg border border-border px-3 py-2" value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })} />
          </label>
          <label className="block text-sm">
            Tax rate
            <input className="mt-1 w-full rounded-lg border border-border px-3 py-2" type="number" value={settings.taxRate} onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })} />
          </label>
          <div className="space-y-2">
            {hours.map((h, i) => (
              <div key={h.day} className="flex items-center gap-2 text-sm">
                <span className="w-24">{h.day}</span>
                <input className="rounded-lg border border-border px-2 py-1" type="time" value={h.open} onChange={(e) => setHours(hours.map((x, idx) => (idx === i ? { ...x, open: e.target.value } : x)))} />
                <span>–</span>
                <input className="rounded-lg border border-border px-2 py-1" type="time" value={h.close} onChange={(e) => setHours(hours.map((x, idx) => (idx === i ? { ...x, close: e.target.value } : x)))} />
              </div>
            ))}
          </div>
          <button className="btn-primary">Continue</button>
        </form>
      )}

      {step === 3 && (
        <div className="card mt-8 space-y-4">
          <p className="font-semibold">Branch setup</p>
          <p className="text-sm text-foreground-secondary">Your restaurant can have multiple branches.</p>
          <form onSubmit={addBranch} className="space-y-3">
            <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Branch name" value={branch.name} onChange={(e) => setBranch({ ...branch, name: e.target.value })} required />
            <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="City" value={branch.city} onChange={(e) => setBranch({ ...branch, city: e.target.value })} required />
            <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Address" value={branch.address} onChange={(e) => setBranch({ ...branch, address: e.target.value })} />
            <button className="btn-secondary" type="submit">
              + Add Branch
            </button>
          </form>
          <ul className="space-y-2 text-sm">
            {branches.map((b) => (
              <li key={b.name} className="rounded-lg border border-border px-3 py-2">
                {b.name} · {b.city}
              </li>
            ))}
          </ul>
          <button className="btn-primary" type="button" disabled={!branches.length} onClick={() => setStep(4)}>
            Continue to checklist
          </button>
        </div>
      )}

      {step === 4 && check && (
        <article className="card mt-8 space-y-3">
          <p className="font-semibold">Restaurant setup</p>
          <Check ok={check.restaurant} label="Restaurant profile" />
          <Check ok={check.business} label="Business information" />
          <Check ok={check.branches} label="Branches" />
          <Check ok={check.tables} label="Create tables" />
          <Check ok={check.categories} label="Create menu categories" />
          <Check ok={check.menu} label="Add menu items" />
          <Check ok={check.recipes} label="Add recipes" />
          <Check ok={check.ingredients} label="Add ingredients" />
          <Check ok={check.inventory} label="Configure inventory" />
          <Check ok={check.staff} label="Add staff" />
          <Check ok={check.reservations} label="Configure reservations" />
          <Check ok={check.payments} label="Configure payment methods" />
          <Check ok={check.notifications} label="Configure notifications" />
          <button className="btn-primary mt-4" type="button" onClick={() => router.push("/app")}>
            Open restaurant workspace
          </button>
        </article>
      )}
    </div>
  );
}

function Check({ ok, label }: { ok: boolean; label: string }) {
  return (
    <p className="text-sm">
      {ok ? "✓" : "○"} {label}
    </p>
  );
}
