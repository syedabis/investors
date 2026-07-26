"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Tab = "signin" | "signup";

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>("signin");
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        setError("Invalid credentials — access denied.");
        return;
      }

      router.push("/home");
      router.refresh();
    } catch {
      setError("System error. Please retry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full min-h-screen bg-background text-on-surface">
      {/* Left: Hero Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-container-lowest overflow-hidden items-center justify-center">
        {/* Ambient blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-secondary-container/30 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern" />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/60" />

        {/* Content */}
        <div className="relative z-10 p-margin-desktop max-w-xl self-end mb-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-sm text-primary font-label-sm uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            System Online
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-sm leading-tight">
            Global Venture<br />Intelligence
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Deploy capital with unmatched precision. Leverage real-time predictive analytics and proprietary ML models.
          </p>

          {/* Decorative stat row */}
          <div className="mt-lg flex gap-lg">
            {[
              { value: "50", label: "Startups Analyzed" },
              { value: "89.9%", label: "Model R²" },
              { value: "$112K", label: "Avg Profit" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-headline-sm text-headline-sm text-primary neon-text font-bold">{value}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative grid lines on left panel */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/10 to-transparent" />
          <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <div className="absolute left-3/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-secondary/5 to-transparent" />
        </div>
      </div>

      {/* Right: Auth Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-sm md:p-margin-desktop bg-background relative overflow-hidden">
        {/* Subtle blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile brand */}
          <div className="text-center mb-lg lg:hidden">
            <h1 className="font-headline-lg text-headline-lg-mobile text-primary tracking-tight">AIVenture</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-base">Global Venture Intelligence</p>
          </div>

          {/* Desktop brand */}
          <div className="hidden lg:block mb-xl">
            <h2 className="font-headline-md text-headline-md text-primary font-bold">AIVenture.</h2>
          </div>

          <div className="glass-card rounded-xl p-md md:p-lg">
            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-md">
              {(["signin", "signup"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-sm font-label-md text-label-md uppercase tracking-wider text-center transition-all duration-300 border-b-2 ${
                    tab === t
                      ? "border-primary text-on-surface"
                      : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-white/5"
                  }`}
                >
                  {t === "signin" ? "Authenticate" : "Request Access"}
                </button>
              ))}
            </div>

            {/* Sign In Form */}
            {tab === "signin" && (
              <div>
                <div className="mb-md">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs font-semibold">System Access</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Authenticate to access real-time deal flow intelligence.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-sm">
                  <div className="glass-input rounded-lg transition-all duration-300">
                    <div className="relative flex items-center gap-3 px-4 py-3">
                      <span className="material-symbols-outlined text-on-surface-variant shrink-0" style={{ fontSize: "18px" }}>person</span>
                      <input
                        type="text"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        placeholder="Username"
                        required
                        autoComplete="username"
                        className="w-full min-w-0 bg-transparent border-0 text-on-surface focus:outline-none focus:ring-0 text-base placeholder:text-on-surface-variant/50"
                      />
                    </div>
                  </div>

                  <div className="glass-input rounded-lg transition-all duration-300">
                    <div className="relative flex items-center gap-3 px-4 py-3">
                      <span className="material-symbols-outlined text-on-surface-variant shrink-0" style={{ fontSize: "18px" }}>lock</span>
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="Security Key"
                        required
                        autoComplete="current-password"
                        className="w-full min-w-0 bg-transparent border-0 text-on-surface focus:outline-none focus:ring-0 text-base placeholder:text-on-surface-variant/50"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-xs bg-error-container/30 border border-error/30 text-error rounded-lg px-sm py-xs text-body-md font-label-sm">
                      <span className="material-symbols-outlined text-[16px]">error</span>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-md bg-primary-container text-on-primary-container font-label-md text-label-md py-sm rounded-lg hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] disabled:opacity-50 transition-all duration-300 uppercase tracking-widest"
                  >
                    {loading ? "Initializing…" : "Initialize Session"}
                  </button>
                </form>

                {/* Demo accounts */}
                <div className="mt-md pt-md border-t border-white/10">
                  <p className="font-label-sm text-label-sm text-on-surface-variant text-center uppercase tracking-wider mb-sm">Demo Credentials</p>
                  <div className="flex gap-xs justify-center">
                    {[
                      { user: "admin", pass: "admin123" },
                      { user: "investor", pass: "investor123" },
                    ].map(({ user, pass }) => (
                      <button
                        key={user}
                        type="button"
                        onClick={() => setForm({ username: user, password: pass })}
                        className="text-xs font-mono bg-surface-container-highest/50 border border-white/10 hover:border-primary/30 hover:bg-surface-container-high px-3 py-2 rounded-lg text-on-surface-variant hover:text-primary transition-all"
                      >
                        {user} / {pass}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Request Access Form */}
            {tab === "signup" && (
              <div>
                <div className="mb-md">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs font-semibold">Authorization Request</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Request clearance for proprietary market data integration.</p>
                </div>

                <div className="space-y-sm">
                  {[
                    { icon: "person", placeholder: "Full Name" },
                    { icon: "mail", placeholder: "Corporate Email" },
                    { icon: "domain", placeholder: "Fund / Entity Name" },
                    { icon: "monitoring", placeholder: "Assets Under Management (Optional)" },
                  ].map(({ icon, placeholder }) => (
                    <div key={placeholder} className="glass-input rounded-lg">
                      <div className="flex items-center gap-3 px-4 py-3">
                        <span className="material-symbols-outlined text-on-surface-variant shrink-0" style={{ fontSize: "18px" }}>{icon}</span>
                        <input
                          type="text"
                          placeholder={placeholder}
                          className="w-full min-w-0 bg-transparent border-0 text-on-surface focus:outline-none focus:ring-0 text-base placeholder:text-on-surface-variant/50"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="w-full mt-md bg-transparent border border-secondary text-secondary font-label-md text-label-md py-sm rounded-lg hover:bg-secondary/10 hover:shadow-[0_0_15px_rgba(211,187,255,0.2)] transition-all duration-300 uppercase tracking-widest"
                  >
                    Submit Request
                  </button>
                  <p className="font-label-sm text-label-sm text-on-surface-variant text-center mt-md opacity-70">
                    Access is subject to review. Existing users can authenticate on the previous tab.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
