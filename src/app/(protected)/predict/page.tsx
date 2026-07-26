"use client";

import { useState } from "react";
import { DATASET_STATS } from "@/lib/model";

interface Result {
  prediction: number;
  percentile: number;
}

interface FormState {
  rd: number;
  admin: number;
  marketing: number;
  state: "California" | "Florida" | "New York";
}

interface HistoryEntry extends FormState {
  id: string;
  timestamp: string;
  prediction: number;
  percentile: number;
}

const DEFAULTS: FormState = {
  rd: 73721,
  admin: 121344,
  marketing: 211025,
  state: "California",
};

const STATES: FormState["state"][] = ["California", "Florida", "New York"];

const KPI_CARDS = [
  { label: "Total Startups", value: `${DATASET_STATS.count}`, delta: "Training set", icon: "dataset" },
  { label: "Avg Predicted Profit", value: `$${(DATASET_STATS.mean / 1000).toFixed(0)}K`, delta: "Dataset mean", icon: "monitoring" },
  { label: "Model Confidence", value: `${(DATASET_STATS.r2 * 100).toFixed(1)}%`, delta: "R² score", icon: "bolt", highlight: true },
];

function fmt(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function PredictPage() {
  const [form, setForm] = useState<FormState>(DEFAULTS);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setResult(null);
  }

  async function handleCalculate() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Prediction failed");
      const data: Result = await res.json();
      setResult(data);

      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toISOString(),
        ...form,
        prediction: data.prediction,
        percentile: data.percentile,
      };
      const prev = JSON.parse(localStorage.getItem("prediction-history") || "[]") as HistoryEntry[];
      localStorage.setItem("prediction-history", JSON.stringify([entry, ...prev].slice(0, 50)));
    } catch {
      setError("Model computation failed. Please retry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-margin-mobile md:p-margin-desktop flex flex-col gap-gutter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold leading-tight">
            Performance Analytics
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Real-time portfolio synthesis and predictive modelling.</p>
        </div>
        <div className="glass-panel px-md py-xs rounded-full flex items-center gap-sm">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-label-sm text-label-sm text-primary">Live Data Sync Active</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {KPI_CARDS.map(({ label, value, delta, icon, highlight }) => (
          <div key={label} className="glass-panel glow-border rounded-xl p-md flex flex-col justify-between h-40">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{label}</span>
            <div>
              <div className={`font-headline-md text-headline-md font-bold ${highlight ? "text-primary neon-text" : "text-on-surface"}`}>
                {value}
              </div>
              <div className="flex items-center gap-xs mt-base">
                <span className={`material-symbols-outlined text-[16px] ${highlight ? "text-primary" : "text-secondary"}`}>
                  {highlight ? "bolt" : "trending_up"}
                </span>
                <span className={`font-label-sm text-label-sm ${highlight ? "text-primary" : "text-secondary"}`}>{delta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prediction Simulator */}
      <section>
        <div className="flex items-center gap-sm mb-md">
          <span className="material-symbols-outlined text-primary text-2xl">science</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Profit Prediction Simulator</h2>
        </div>

        <div className="glass-panel glow-border rounded-xl p-md md:p-lg grid grid-cols-1 lg:grid-cols-2 gap-xl">
          {/* Controls */}
          <div className="flex flex-col gap-md">
            {/* R&D Slider */}
            <div className="space-y-sm">
              <label className="flex justify-between font-label-md text-label-md text-on-surface">
                <span>R&amp;D Cost (Monthly)</span>
                <span className="text-secondary font-mono">${fmt(form.rd)}</span>
              </label>
              <input
                type="range"
                min={0}
                max={500000}
                step={5000}
                value={form.rd}
                onChange={(e) => setField("rd", Number(e.target.value))}
              />
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant/60">
                <span>$0</span>
                <span>$500K</span>
              </div>
            </div>

            {/* Marketing Slider */}
            <div className="space-y-sm">
              <label className="flex justify-between font-label-md text-label-md text-on-surface">
                <span>Marketing Cost (Monthly)</span>
                <span className="text-secondary font-mono">${fmt(form.marketing)}</span>
              </label>
              <input
                type="range"
                min={0}
                max={500000}
                step={5000}
                value={form.marketing}
                onChange={(e) => setField("marketing", Number(e.target.value))}
              />
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant/60">
                <span>$0</span>
                <span>$500K</span>
              </div>
            </div>

            {/* Administration Slider */}
            <div className="space-y-sm">
              <label className="flex justify-between font-label-md text-label-md text-on-surface">
                <span>Administration Cost (Monthly)</span>
                <span className="text-secondary font-mono">${fmt(form.admin)}</span>
              </label>
              <input
                type="range"
                min={0}
                max={200000}
                step={5000}
                value={form.admin}
                onChange={(e) => setField("admin", Number(e.target.value))}
              />
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant/60">
                <span>$0</span>
                <span>$200K</span>
              </div>
            </div>

            {/* State Select */}
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface block">Company State</label>
              <select
                value={form.state}
                onChange={(e) => setField("state", e.target.value as FormState["state"])}
                className="w-full bg-surface-container-high border border-outline-variant rounded-lg p-3 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all pr-10"
              >
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="flex items-center gap-xs bg-error-container/30 border border-error/30 text-error rounded-lg px-sm py-xs font-label-sm">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {error}
              </div>
            )}

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-surface/50 border border-white/20 hover:border-primary/50 text-on-surface hover:text-primary font-label-md text-label-md hover:bg-white/5 transition-all flex items-center justify-center gap-xs disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[20px] ${loading ? "animate-spin" : ""}`}>
                {loading ? "sync" : "science"}
              </span>
              {loading ? "Running Model…" : "Recalculate Model"}
            </button>
          </div>

          {/* Output Visualization */}
          <div className="relative bg-surface-container-lowest rounded-xl border border-white/5 p-md flex flex-col justify-center items-center overflow-hidden min-h-[320px]">
            {/* Radial glow bg */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{ background: "radial-gradient(circle at 50% 50%, rgba(34,197,94,0.35) 0%, transparent 70%)" }}
            />

            {result ? (
              <div className="z-10 text-center flex flex-col items-center w-full gap-md">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Predicted Annual Profit</span>

                <div className="relative">
                  <span className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary neon-text font-bold flex items-baseline gap-xs">
                    ${fmt(result.prediction)}
                  </span>
                  {/* Decorative SVG line */}
                  <svg
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-20 opacity-30 pointer-events-none"
                    viewBox="0 0 100 30"
                    preserveAspectRatio="none"
                  >
                    <path d="M0,25 C20,25 30,10 50,15 C70,20 80,5 100,2" fill="none" stroke="#22c55e" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    <path d="M0,25 C20,25 30,10 50,15 C70,20 80,5 100,2 L100,30 L0,30 Z" fill="url(#profitgrad)" stroke="none" />
                    <defs>
                      <linearGradient id="profitgrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="flex items-center gap-sm bg-surface/80 rounded-full px-sm py-1 border border-primary/20 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Percentile: <strong className="text-on-surface">{result.percentile}th</strong>
                  </span>
                </div>

                <p className="font-label-sm text-label-sm text-on-surface-variant/60 font-mono">
                  ±$9,056 model margin of error
                </p>

                {/* Percentile bar */}
                <div className="w-full px-2">
                  <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant/60 mb-1">
                    <span>Worst</span>
                    <span>Median</span>
                    <span>Best</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${result.percentile}%`,
                        background:
                          result.percentile >= 50
                            ? "linear-gradient(to right, #60a5fa, #4be277)"
                            : "linear-gradient(to right, #fbbf24, #f59e0b)",
                      }}
                    />
                  </div>
                  <p className="text-center font-mono text-xs text-on-surface-variant/60 mt-1">{result.percentile}th percentile</p>
                </div>

                {/* Input summary */}
                <div className="border-t border-white/5 pt-3 grid grid-cols-4 gap-2 w-full text-center">
                  {[
                    { label: "R&D", value: `$${fmt(form.rd)}` },
                    { label: "Admin", value: `$${fmt(form.admin)}` },
                    { label: "Mktg", value: `$${fmt(form.marketing)}` },
                    { label: "State", value: form.state.slice(0, 2).toUpperCase() },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{label}</p>
                      <p className="font-label-sm text-label-sm text-on-surface font-semibold mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="z-10 text-center flex flex-col items-center gap-md">
                <div className="w-16 h-16 rounded-full border border-primary/20 flex items-center justify-center bg-primary/5">
                  <span className="material-symbols-outlined text-primary text-3xl">science</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Awaiting Model Input</span>
                <p className="font-body-md text-body-md text-on-surface-variant/60 text-sm max-w-xs">
                  Adjust the spend parameters and click <span className="text-primary font-mono">Recalculate Model</span> to run the ML prediction.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
