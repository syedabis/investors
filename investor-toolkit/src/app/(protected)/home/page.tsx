import { DATASET_STATS } from "@/lib/model";
import Link from "next/link";

const FEED_ITEMS = [
  {
    icon: "rocket_launch",
    iconBg: "bg-secondary-container/20 text-secondary border border-secondary/20",
    title: "Portfolio ML Model Active",
    time: "Live",
    body: "Linear regression model trained on 50 startups — R&D, Administration, and Marketing spend across three US states. R² = 0.899.",
    tag: "ML Model",
    conviction: "99.0%",
    convictionColor: "text-primary",
  },
  {
    icon: "psychology",
    iconBg: "bg-primary/10 text-primary border border-primary/20",
    title: "High Signal: R&D Spend",
    time: "Insight",
    body: "R&D coefficient of 0.806 is the strongest profit driver in the model — $1 spent on R&D generates ~$0.81 in predicted profit.",
    tag: "Feature Analysis",
    conviction: "98.4%",
    convictionColor: "text-primary",
  },
  {
    icon: "location_on",
    iconBg: "bg-tertiary/10 text-tertiary border border-tertiary/20",
    title: "Geographic Alpha: Florida",
    time: "Signal",
    body: "Florida-based startups show +$939 base profit premium vs. California peers, all else equal. New York shows marginal +$7 effect.",
    tag: "Geo Analysis",
    conviction: "84.7%",
    convictionColor: "text-secondary",
  },
];

export default function HomePage() {
  const kpis = [
    { label: "Startups Analyzed", value: String(DATASET_STATS.count), icon: "dataset", delta: "Train set" },
    { label: "Avg Portfolio Profit", value: `$${(DATASET_STATS.mean / 1000).toFixed(0)}K`, icon: "trending_up", delta: "+YTD" },
    { label: "Peak Profit Signal", value: `$${(DATASET_STATS.max / 1000).toFixed(0)}K`, icon: "bolt", delta: "Top performer" },
    { label: "Model Accuracy (R²)", value: DATASET_STATS.r2.toFixed(3), icon: "science", delta: "High confidence" },
  ];

  return (
    <div className="p-margin-mobile md:p-margin-desktop flex flex-col gap-gutter">
      {/* Top Utility Bar */}
      <header className="hidden md:flex items-center justify-between">
        <div className="flex items-center gap-4 bg-surface-container-low/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/5 w-96 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-body-md text-on-surface placeholder:text-on-surface-variant/50 w-full p-0 outline-none font-body-md"
            placeholder="Search signals, founders, or sectors..."
            type="text"
            readOnly
          />
          <span className="font-mono text-xs text-on-surface-variant/50 border border-white/10 rounded px-1">⌘K</span>
        </div>
        <div className="flex items-center gap-xs">
          <button className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors relative">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_5px_rgba(75,226,119,1)]" />
          </button>
          <button className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
        </div>
      </header>

      {/* Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2 font-bold leading-tight">
            Welcome back, <span className="text-primary text-glow-primary">Partner</span>.
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            ML intelligence is <span className="text-tertiary">live</span> — profit signals ready for analysis.
          </p>
        </div>
        <div className="font-mono text-sm text-on-surface-variant bg-surface-container-low/50 px-3 py-1 rounded border border-white/5 whitespace-nowrap">
          MODEL.STATUS: <span className="text-primary">ACTIVE</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
        {kpis.map(({ label, value, icon, delta }) => (
          <div key={label} className="glass-card glow-border rounded-xl p-md flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider leading-tight">{label}</span>
              <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
            </div>
            <div>
              <div className="font-headline-sm text-headline-sm text-on-surface font-bold">{value}</div>
              <div className="flex items-center gap-1 font-mono text-xs mt-1">
                <span className="text-primary bg-primary/10 px-2 py-0.5 rounded">{delta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Portfolio Snapshot */}
        <div className="lg:col-span-5 glass-card glass-card-glow rounded-xl p-md flex flex-col justify-between min-h-[200px]">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Profit Distribution</h3>
            <span className="material-symbols-outlined text-primary text-[20px]">trending_up</span>
          </div>
          <div>
            <div className="font-headline-md text-headline-md text-on-surface font-bold">${(DATASET_STATS.max / 1000).toFixed(0)}K</div>
            <div className="flex items-center gap-2 font-mono text-xs mt-1">
              <span className="text-primary bg-primary/10 px-2 py-0.5 rounded flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">arrow_upward</span>
                Peak Startup Profit
              </span>
              <span className="text-on-surface-variant">Dataset max</span>
            </div>
          </div>
          {/* Mini bar chart */}
          <div className="mt-4 h-14 w-full flex items-end gap-1">
            {[20, 35, 28, 55, 42, 68, 72, 85, 90, 95].map((h, i) => (
              <div
                key={i}
                className={`w-full rounded-t transition-all ${
                  i >= 7 ? "bg-primary hover:bg-primary-fixed shadow-[0_0_8px_rgba(75,226,119,0.3)]" : "bg-secondary-container/40 hover:bg-secondary-container/60"
                }`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Model Confidence */}
        <div className="lg:col-span-3 glass-card glass-card-glow rounded-xl p-md flex flex-col min-h-[200px]">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Model Confidence</h3>
            <span className="material-symbols-outlined text-tertiary text-[20px]">radar</span>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            {/* Radar viz */}
            <div className="w-28 h-28 rounded-full border border-white/5 relative flex items-center justify-center">
              <div className="absolute w-full h-px bg-white/5" />
              <div className="absolute h-full w-px bg-white/5" />
              <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center bg-tertiary/5 relative">
                  <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_rgba(75,226,119,0.8)] animate-pulse" />
                  <div className="absolute bottom-3 left-3 w-2 h-2 bg-secondary rounded-full shadow-[0_0_8px_rgba(211,187,255,0.6)]" />
                  <div className="absolute top-6 left-1 w-1.5 h-1.5 bg-tertiary rounded-full" />
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 w-14 h-px bg-gradient-to-r from-transparent to-primary origin-left animate-[spin_4s_linear_infinite] opacity-50" />
            </div>
          </div>
          <div className="flex justify-between text-xs font-mono text-on-surface-variant mt-2">
            <span>R² <span className="text-primary">89.9%</span></span>
            <span>RMSE <span className="text-secondary">$9K</span></span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-4 glass-card rounded-xl p-md flex flex-col gap-3">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">Quick Actions</h3>
          <Link
            href="/predict"
            className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 transition-all group"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">science</span>
            <div>
              <p className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">Profit Predictor</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Run ML model simulation</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary ml-auto transition-colors text-[16px]">arrow_forward</span>
          </Link>
          <Link
            href="/history"
            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 border border-secondary/20 hover:border-secondary/40 transition-all group"
          >
            <span className="material-symbols-outlined text-secondary text-[20px]">history</span>
            <div>
              <p className="font-label-md text-label-md text-on-surface group-hover:text-secondary transition-colors">Prediction History</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Review past simulations</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-secondary ml-auto transition-colors text-[16px]">arrow_forward</span>
          </Link>
          <div className="mt-auto pt-3 border-t border-white/5">
            <p className="font-label-sm text-label-sm text-on-surface-variant/60 font-mono">
              MODEL: <span className="text-primary">LinearRegression v1.0</span>
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant/60 font-mono mt-0.5">
              DATASET: <span className="text-on-surface-variant">50 startups · 3 states</span>
            </p>
          </div>
        </div>
      </div>

      {/* Intelligence Feed */}
      <div className="glass-card rounded-xl p-0 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-surface-container-low/50">
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 font-semibold">
            <span className="material-symbols-outlined text-primary text-[20px]">stream</span>
            Live Intelligence Feed
          </h3>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping inline-block" />
            LIVE
          </span>
        </div>

        <div className="flex flex-col divide-y divide-white/5">
          {FEED_ITEMS.map(({ icon, iconBg, title, time, body, tag, conviction, convictionColor }) => (
            <div key={title} className="p-4 hover:bg-surface-container/30 transition-colors flex gap-4 group">
              <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}>
                <span className="material-symbols-outlined text-[18px]">{icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-body-md text-on-surface font-semibold group-hover:text-primary transition-colors">{title}</h4>
                  <span className="font-mono text-xs text-on-surface-variant ml-4 whitespace-nowrap">{time}</span>
                </div>
                <p className="font-body-md text-sm text-on-surface-variant/80 mb-2 leading-relaxed">{body}</p>
                <div className="flex items-center gap-3">
                  <span className="bg-surface-container-highest px-2 py-0.5 rounded text-xs font-mono border border-white/5">{tag}</span>
                  <div className="flex items-center gap-1 text-xs font-mono">
                    <span className="text-on-surface-variant">AI Conviction:</span>
                    <span className={`${convictionColor} flex items-center`}>
                      <span className="material-symbols-outlined text-[12px]">star</span>
                      {conviction}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
