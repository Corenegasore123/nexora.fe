"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Search,
} from "lucide-react";
import { clampDateToToday, todayKigali } from "@/lib/dates";
import { ALL_PLACES_LABEL, RWANDA_PLACES } from "@/lib/rwanda-places";

const REGIONS = [
  "City of Kigali",
  "Northern Province",
  "Southern Province",
  "Eastern Province",
  "Western Province",
] as const;

const HOURS_12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const PERIODS = ["AM", "PM"] as const;

function useDismissible(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return ref;
}

function formatDateLabel(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(y, m - 1, d));
}

function parseTime(value: string) {
  const [hRaw, mRaw] = value.split(":").map(Number);
  const hour24 = Number.isFinite(hRaw) ? Math.min(23, Math.max(0, hRaw)) : 19;
  const minute = Number.isFinite(mRaw) ? Math.min(59, Math.max(0, mRaw)) : 0;
  const period: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
  const hour12 = ((hour24 + 11) % 12) + 1;
  return { hour12, minute, period };
}

function to24h(hour12: number, minute: number, period: "AM" | "PM") {
  let hour24 = hour12 % 12;
  if (period === "PM") hour24 += 12;
  return `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function formatTimeLabel(value: string) {
  const { hour12, minute, period } = parseTime(value);
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function toIso(year: number, monthIndex: number, day: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function PlacePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const listId = useId();
  const ref = useDismissible(open, () => setOpen(false));

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return REGIONS.map((region) => ({
      region,
      places: RWANDA_PLACES.filter(
        (p) =>
          p.region === region &&
          (!q || p.name.toLowerCase().includes(q) || region.toLowerCase().includes(q))
      ),
    })).filter((g) => g.places.length > 0);
  }, [query]);

  return (
    <div className={`nx-picker ${open ? "is-open" : ""}`} ref={ref}>
      <button
        type="button"
        className="nx-picker-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <MapPin size={16} strokeWidth={1.85} />
        <span className="nx-picker-value">{value}</span>
        <ChevronDown size={14} strokeWidth={2} className="nx-picker-caret" />
      </button>
      {open && (
        <div className="nx-picker-panel nx-picker-panel-place" role="listbox" id={listId}>
          <div className="nx-picker-search">
            <Search size={14} strokeWidth={1.85} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search districts"
              aria-label="Search districts"
            />
          </div>
          <div className="nx-picker-scroll">
            {(!query.trim() || ALL_PLACES_LABEL.toLowerCase().includes(query.trim().toLowerCase()) || "places".includes(query.trim().toLowerCase())) && (
              <div className="nx-place-group">
                <button
                  type="button"
                  role="option"
                  aria-selected={value === ALL_PLACES_LABEL}
                  className={`nx-place-option ${value === ALL_PLACES_LABEL ? "is-active" : ""}`}
                  onClick={() => {
                    onChange(ALL_PLACES_LABEL);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <span>All places</span>
                  {value === ALL_PLACES_LABEL && <Check size={14} strokeWidth={2.2} />}
                </button>
              </div>
            )}
            {groups.map((g) => (
              <div key={g.region} className="nx-place-group">
                <p className="nx-place-region">{g.region}</p>
                {g.places.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    role="option"
                    aria-selected={p.name === value}
                    className={`nx-place-option ${p.name === value ? "is-active" : ""}`}
                    onClick={() => {
                      onChange(p.name);
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    <span>{p.name}</span>
                    {p.name === value && <Check size={14} strokeWidth={2.2} />}
                  </button>
                ))}
              </div>
            ))}
            {!groups.length && <p className="nx-picker-empty">No districts match.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export function DatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const min = todayKigali();
  const selected = clampDateToToday(value);
  const [open, setOpen] = useState(false);
  const initial = selected.split("-").map(Number);
  const [cursor, setCursor] = useState({ year: initial[0], month: initial[1] - 1 });
  const ref = useDismissible(open, () => setOpen(false));

  useEffect(() => {
    if (!open) return;
    const parts = selected.split("-").map(Number);
    setCursor({ year: parts[0], month: parts[1] - 1 });
  }, [open, selected]);

  const minParts = min.split("-").map(Number);
  const minYear = minParts[0];
  const minMonth = minParts[1] - 1;
  const minDay = minParts[2];

  const firstWeekday = new Date(cursor.year, cursor.month, 1).getDay();
  const total = daysInMonth(cursor.year, cursor.month);
  const blanks = Array.from({ length: firstWeekday }, (_, i) => i);
  const days = Array.from({ length: total }, (_, i) => i + 1);

  const title = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(new Date(cursor.year, cursor.month, 1));

  const canPrev =
    cursor.year > minYear || (cursor.year === minYear && cursor.month > minMonth);

  const shiftMonth = (delta: number) => {
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  return (
    <div className={`nx-picker ${open ? "is-open" : ""}`} ref={ref}>
      <button
        type="button"
        className="nx-picker-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Calendar size={16} strokeWidth={1.85} />
        <span className="nx-picker-value">{formatDateLabel(selected)}</span>
        <ChevronDown size={14} strokeWidth={2} className="nx-picker-caret" />
      </button>
      {open && (
        <div className="nx-picker-panel nx-picker-panel-cal" role="dialog" aria-label="Choose date">
          <div className="nx-cal-head">
            <button
              type="button"
              className="nx-cal-nav"
              aria-label="Previous month"
              disabled={!canPrev}
              onClick={() => shiftMonth(-1)}
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>
            <p className="nx-cal-title">{title}</p>
            <button type="button" className="nx-cal-nav" aria-label="Next month" onClick={() => shiftMonth(1)}>
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>
          <div className="nx-cal-weekdays">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="nx-cal-grid">
            {blanks.map((b) => (
              <span key={`b-${b}`} className="nx-cal-day is-blank" />
            ))}
            {days.map((day) => {
              const iso = toIso(cursor.year, cursor.month, day);
              const disabled =
                cursor.year < minYear ||
                (cursor.year === minYear && cursor.month < minMonth) ||
                (cursor.year === minYear && cursor.month === minMonth && day < minDay);
              const isSelected = iso === selected;
              const isToday = iso === min;
              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  className={`nx-cal-day ${isSelected ? "is-selected" : ""} ${isToday ? "is-today" : ""}`}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function TimeColumn<T extends string | number>({
  label,
  options,
  value,
  onChange,
  format = (v) => String(v).padStart(2, "0"),
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
  format?: (v: T) => string;
}) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "center" });
  }, [value]);

  return (
    <div className="nx-time-col">
      <p className="nx-time-col-label">{label}</p>
      <div className="nx-time-col-scroll" role="listbox" aria-label={label}>
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={String(opt)}
              ref={active ? activeRef : undefined}
              type="button"
              role="option"
              aria-selected={active}
              className={`nx-time-option ${active ? "is-active" : ""}`}
              onClick={() => onChange(opt)}
            >
              {format(opt)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const parsed = parseTime(value);
  const [hour12, setHour12] = useState(parsed.hour12);
  const [minute, setMinute] = useState(parsed.minute);
  const [period, setPeriod] = useState<"AM" | "PM">(parsed.period);
  const ref = useDismissible(open, () => setOpen(false));

  useEffect(() => {
    if (!open) return;
    const next = parseTime(value);
    setHour12(next.hour12);
    setMinute(next.minute);
    setPeriod(next.period);
  }, [open, value]);

  const commit = (h: number, m: number, p: "AM" | "PM") => {
    onChange(to24h(h, m, p));
  };

  return (
    <div className={`nx-picker ${open ? "is-open" : ""}`} ref={ref}>
      <button
        type="button"
        className="nx-picker-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Clock size={16} strokeWidth={1.85} />
        <span className="nx-picker-value">{formatTimeLabel(value)}</span>
        <ChevronDown size={14} strokeWidth={2} className="nx-picker-caret" />
      </button>
      {open && (
        <div className="nx-picker-panel nx-picker-panel-time" role="dialog" aria-label="Choose time">
          <div className="nx-time-wheels">
            <TimeColumn
              label="Hour"
              options={HOURS_12}
              value={hour12 as (typeof HOURS_12)[number]}
              onChange={(h) => {
                setHour12(h);
                commit(h, minute, period);
              }}
              format={(v) => String(v)}
            />
            <TimeColumn
              label="Min"
              options={MINUTES}
              value={minute}
              onChange={(m) => {
                setMinute(m);
                commit(hour12, m, period);
              }}
            />
            <TimeColumn
              label="Period"
              options={PERIODS}
              value={period}
              onChange={(p) => {
                setPeriod(p);
                commit(hour12, minute, p);
              }}
              format={(v) => v}
            />
          </div>
          <button type="button" className="nx-time-done" onClick={() => setOpen(false)}>
            Done
          </button>
        </div>
      )}
    </div>
  );
}
