"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface HistoryEntry {
  id: string;
  timestamp: string;
  rd: number;
  admin: number;
  marketing: number;
  state: string;
  prediction: number;
  percentile: number;
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("prediction-history");
      if (stored) setEntries(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  function handleDelete(id: string) {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem("prediction-history", JSON.stringify(updated));
  }

  function handleClearAll() {
    setEntries([]);
    localStorage.removeItem("prediction-history");
  }

  if (!mounted) return null;

  return (
    <div className="p-margin-mobile md:p-margin-desktop flex flex-col gap-gutter">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold leading-tight">
            Prediction History
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            {entries.length === 0
              ? "No simulations recorded yet."
              : `${entries.length} simulation${entries.length !== 1 ? "s" : ""} stored locally`}
          </p>
        </div>

        <div className="flex items-center gap-sm">
          {entries.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-xs font-label-md text-label-md text-error/70 hover:text-error border border-error/20 hover:border-error/50 px-sm py-xs rounded-lg transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
              Clear All
            </button>
          )}
          <Link
            href="/predict"
            className="flex items-center gap-xs font-label-md text-label-md text-on-primary bg-primary hover:bg-primary-fixed px-sm py-xs rounded-lg transition-all shadow-[0_0_10px_rgba(75,226,119,0.2)] hover:shadow-[0_0_20px_rgba(75,226,119,0.4)]"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            New Simulation
          </Link>
        </div>
      </div>

      {/* Content */}
      {entries.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-gutter">
          {entries.map((entry, i) => (
            <EntryCard key={entry.id} entry={entry} index={i} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

function EntryCard({
  entry,
  index,
  onDelete,
}: {
  entry: HistoryEntry;
  index: number;
  onDelete: (id: string) => void;
}) {
  const date = new Date(entry.timestamp);
  const isStrong = entry.percentile >= 50;

  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="glass-card glow-border rounded-xl p-md hover:border-white/10 transition-all group">
      <div className="flex items-start justify-between mb-md">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isStrong ? "bg-primary/10 border border-primary/20" : "bg-secondary/10 border border-secondary/20"}`}>
            <span className={`material-symbols-outlined text-[18px] ${isStrong ? "text-primary" : "text-secondary"}`}>
              {isStrong ? "trending_up" : "trending_flat"}
            </span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant font-mono">{dateStr} · {timeStr}</p>
            <p className="font-headline-sm text-headline-sm text-on-surface font-bold mt-0.5 neon-text">
              ${fmt(entry.prediction)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-sm">
          <span
            className={`px-3 py-1 rounded-full font-label-sm text-label-sm font-mono ${
              isStrong
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-secondary/10 text-secondary border border-secondary/20"
            }`}
          >
            {entry.percentile}th %ile
          </span>
          <button
            onClick={() => onDelete(entry.id)}
            aria-label="Delete entry"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant/40 hover:text-error hover:bg-error/10 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      </div>

      {/* Percentile bar */}
      <div className="mb-md">
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${entry.percentile}%`,
              background: isStrong
                ? "linear-gradient(to right, #60a5fa, #4be277)"
                : "linear-gradient(to right, #fbbf24, #f59e0b)",
            }}
          />
        </div>
      </div>

      {/* Spend breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-white/5 pt-md">
        {[
          { label: "R&D Spend", value: `$${fmt(entry.rd)}`, icon: "science" },
          { label: "Administration", value: `$${fmt(entry.admin)}`, icon: "business_center" },
          { label: "Marketing", value: `$${fmt(entry.marketing)}`, icon: "campaign" },
          { label: "State", value: entry.state, icon: "location_on" },
        ].map(({ label, value, icon }) => (
          <div key={label} className="flex items-start gap-2">
            <span className="material-symbols-outlined text-on-surface-variant/40 text-[14px] mt-0.5">{icon}</span>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">{label}</p>
              <p className="font-body-md text-body-md text-on-surface font-medium mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass-card rounded-xl flex flex-col items-center justify-center py-xl px-md text-center">
      {/* Decorative orb */}
      <div className="w-20 h-20 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center mb-md relative">
        <span className="material-symbols-outlined text-primary/50 text-4xl">history</span>
        <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping opacity-30" />
      </div>

      <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-xs">No Simulations Recorded</h3>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-xs leading-relaxed mb-lg">
        Head to the Profit Predictor and run your first simulation — it will appear here for review.
      </p>

      <Link
        href="/predict"
        className="inline-flex items-center gap-xs bg-primary text-on-primary font-label-md text-label-md px-md py-sm rounded-lg hover:bg-primary-fixed transition-all shadow-[0_0_15px_rgba(75,226,119,0.3)] hover:shadow-[0_0_25px_rgba(75,226,119,0.5)]"
      >
        <span className="material-symbols-outlined text-[18px]">science</span>
        Run First Prediction
      </Link>
    </div>
  );
}
