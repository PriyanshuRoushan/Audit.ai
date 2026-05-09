import { useNavigate } from 'react-router-dom';

const TOOL_CARDS = [
  { icon: "code", name: "Cursor", status: "Inefficient", statusColor: "#ffb4ab", statusIcon: "warning", plan: "Business ($40/seat)", utilLabel: "Utilization", util: "42%", utilColor: "#ffb4ab", actionLabel: "Recommended Action", actionLabelColor: "#4edea3", actionBg: "rgba(78,222,163,0.05)", actionBorder: "rgba(78,222,163,0.2)", action: "Downgrade 8 inactive seats to Pro. Savings: ", savings: "$160/mo" },
  { icon: "chat", name: "ChatGPT", status: "Optimized", statusColor: "#4edea3", statusIcon: "check_circle", plan: "Team ($25/seat)", utilLabel: "Utilization", util: "94%", utilColor: "#4edea3", actionLabel: "Observation", actionLabelColor: "#908fa0", actionBg: "rgba(255,255,255,0.05)", actionBorder: "rgba(255,255,255,0.1)", action: "Usage aligns with growth. No changes recommended.", savings: null },
  { icon: "palette", name: "Midjourney", status: "Shadow Spend", statusColor: "#ffb4ab", statusIcon: "sync_problem", plan: "Basic (Individual)", utilLabel: "Detection", util: "4 Individual Subs", utilColor: "#ffb4ab", actionLabel: "Recommended Action", actionLabelColor: "#4edea3", actionBg: "rgba(78,222,163,0.05)", actionBorder: "rgba(78,222,163,0.2)", action: "Consolidate to a single Pro account. Savings: ", savings: "$40/mo" },
];

export default function DashboardPage() {
  const routerNavigate = useNavigate();
  const navigate = (key) => {
    if (key === "audit") routerNavigate("/audit");
    else if (key === "report") routerNavigate("/report/demo");
    else if (key === "dashboard") routerNavigate("/dashboard");
    else if (key === "landing") routerNavigate("/");
  };

  const C = { primary: "#c0c1ff", secondary: "#4edea3", outline: "#908fa0", onSurface: "#e5e2e1", onSurfaceVariant: "#c7c4d7", onPrimary: "#1000a9", surface: "#131313" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a" }}>
      {/* Sidebar */}
      <aside style={{ position: "fixed", left: 0, top: 0, height: "100%", width: 256, background: "#131313", borderRight: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", padding: 24, zIndex: 40 }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 32, height: 32, background: C.primary, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined" style={{ color: C.onPrimary, fontSize: 20 }}>terminal</span>
            </div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: C.primary }}>Acme Corp</h1>
          </div>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.onSurfaceVariant }}>Pro Plan</p>
        </div>
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {[{ icon: "dashboard", label: "Overview", active: true }, { icon: "payments", label: "Expenditure" }, { icon: "auto_awesome", label: "AI Insights" }, { icon: "receipt_long", label: "Audit Logs" }, { icon: "extension", label: "Integrations" }].map((link) => (
            <a key={link.label} href="#" style={{ display: "flex", alignItems: "center", gap: 16, padding: "8px 16px", borderRadius: 8, textDecoration: "none", color: link.active ? C.primary : C.onSurfaceVariant, background: link.active ? "rgba(255,255,255,0.05)" : "transparent", borderLeft: link.active ? `2px solid ${C.primary}` : "none", transform: link.active ? "translateX(4px)" : "none" }}>
              <span className="material-symbols-outlined">{link.icon}</span>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>
        <div style={{ marginBottom: 16 }}>
          <button onClick={() => navigate("audit")} style={{ width: "100%", background: C.primary, color: C.onPrimary, padding: "8px 0", borderRadius: 8, fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            Start New Audit
          </button>
        </div>
        {[{ icon: "menu_book", label: "Documentation" }, { icon: "support_agent", label: "Support" }].map((l) => (
          <a key={l.label} href="#" style={{ display: "flex", alignItems: "center", gap: 16, color: C.onSurfaceVariant, padding: "8px 16px", textDecoration: "none" }}>
            <span className="material-symbols-outlined">{l.icon}</span>
            <span>{l.label}</span>
          </a>
        ))}
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 256, minHeight: "100vh", padding: 24, flex: 1 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: C.outline, marginBottom: 4 }}>Performance Analytics</p>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: C.onSurface }}>Audit.ai Dashboard</h2>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[{ icon: "share", label: "Share Report" }, { icon: "picture_as_pdf", label: "Export PDF" }].map((btn) => (
              <button key={btn.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)", background: "none", cursor: "pointer", color: C.onSurfaceVariant, fontWeight: 500, fontSize: 14 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{btn.icon}</span>
                {btn.label}
              </button>
            ))}
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16 }}>
          {/* Hero */}
          <div style={{ gridColumn: "span 8", background: "#171717", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 256, height: 256, background: "rgba(192,193,255,0.1)", filter: "blur(100px)", pointerEvents: "none" }} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ padding: "4px 8px", background: "rgba(78,222,163,0.1)", color: C.secondary, borderRadius: 4, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>trending_down</span> Optimized
                </span>
                <span style={{ color: C.onSurfaceVariant, fontWeight: 500, fontSize: 14 }}>Projected Annual Savings</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                <h3 style={{ fontSize: 56, fontWeight: 700, color: C.onSurface, letterSpacing: "-0.04em" }}>$12,400</h3>
                <span style={{ color: C.secondary, fontSize: 24, fontWeight: 700 }}>saved per year</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, marginTop: 48 }}>
              {[{ l: "Current Burn", v: "$4,250/mo", c: "" }, { l: "Recommended", v: "$3,217/mo", c: C.primary }, { l: "Audit Coverage", v: "98.2%", c: "" }, { l: "Last Audit", v: "2h ago", c: "" }].map((s) => (
                <div key={s.l}>
                  <p style={{ color: C.onSurfaceVariant, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{s.l}</p>
                  <p style={{ fontSize: 18, fontWeight: 600, color: s.c || C.onSurface }}>{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Summary */}
          <div style={{ gridColumn: "span 4", background: "#171717", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24, position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 12, padding: 1, background: "linear-gradient(to bottom, rgba(192,193,255,0.3), transparent)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", pointerEvents: "none" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.primary }}>
                <span className="material-symbols-outlined">auto_awesome</span>
                <span style={{ fontSize: 18, fontWeight: 600 }}>AI Summary</span>
              </div>
              <span style={{ color: C.outline, fontSize: 12, fontFamily: "monospace" }}>v4.2-Audit</span>
            </div>
            <p style={{ color: C.onSurfaceVariant, lineHeight: 1.6, fontSize: 14, marginBottom: 16 }}>
              Analysis complete. We detected <span style={{ color: C.primary }}>14 duplicate seat licenses</span> across Cursor and ChatGPT Plus. Switching to Enterprise billing for OpenAI could yield an additional <span style={{ color: C.secondary, fontWeight: 700 }}>12% reduction</span> in overhead.
            </p>
            <div style={{ padding: 16, background: "rgba(255,255,255,0.05)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: C.outline, marginBottom: 8 }}>Top Recommendation</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: C.onSurface }}>Consolidate Dev Tools</span>
                <span style={{ color: C.secondary, fontFamily: "monospace", fontSize: 14 }}>+$420/mo</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div style={{ gridColumn: "span 12", background: "#171717", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
              <h3 style={{ fontSize: 24, fontWeight: 600, color: C.onSurface }}>Monthly Spend Trajectory</h3>
              <div style={{ display: "flex", gap: 8, background: "#0e0e0e", padding: 4, borderRadius: 4 }}>
                <button style={{ padding: "4px 16px", borderRadius: 4, background: "rgba(255,255,255,0.1)", color: C.onSurface, border: "none", cursor: "pointer", fontSize: 14 }}>6 Months</button>
                <button style={{ padding: "4px 16px", borderRadius: 4, background: "none", color: C.onSurfaceVariant, border: "none", cursor: "pointer", fontSize: 14 }}>1 Year</button>
              </div>
            </div>
            <div style={{ height: 256, display: "flex", alignItems: "flex-end", gap: 8, padding: "0 16px", position: "relative" }}>
              {[{ h: 80, bg: "rgba(192,193,255,0.2)" }, { h: 85, bg: "rgba(192,193,255,0.2)" }, { h: 90, bg: "rgba(192,193,255,0.2)" }, { h: 75, bg: "rgba(192,193,255,0.2)" }, { h: 65, bg: "rgba(78,222,163,0.4)", special: true }, { h: 60, bg: "rgba(78,222,163,0.4)" }].map((bar, i) => (
                <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.05)", height: `${bar.h}%`, borderRadius: "4px 4px 0 0", position: "relative", border: bar.special ? "1px solid rgba(192,193,255,0.4)" : "none" }}>
                  <div style={{ position: "absolute", inset: "auto 0 0 0", background: bar.bg, height: "50%" }} />
                  {bar.special && <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", background: C.secondary, color: "#003824", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>AUDIT APPLIED</div>}
                </div>
              ))}
              <div style={{ position: "absolute", left: 0, bottom: 0, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: 10, fontFamily: "monospace", color: C.outline, transform: "translateX(-8px)" }}>
                <span>$5.0k</span><span>$2.5k</span><span>$0</span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, padding: "0 16px", color: C.outline, fontSize: 11, fontFamily: "monospace" }}>
              {["JAN", "FEB", "MAR", "APR", "MAY (PROJ)", "JUN (PROJ)"].map((m) => <span key={m}>{m}</span>)}
            </div>
          </div>

          {/* Tool Cards */}
          <div style={{ gridColumn: "span 12", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {TOOL_CARDS.map((card) => (
              <div key={card.name} style={{ background: "#171717", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: 16, borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 4, background: "rgba(229,226,225,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: C.onSurface }}>{card.icon}</span>
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 600, color: C.onSurface }}>{card.name}</span>
                  </div>
                  <span style={{ color: card.statusColor, fontFamily: "monospace", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{card.statusIcon}</span>
                    {card.status}
                  </span>
                </div>
                <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: C.onSurfaceVariant }}>Current Plan</span>
                    <span style={{ fontWeight: 700, fontSize: 14, color: C.onSurface }}>{card.plan}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: C.onSurfaceVariant }}>{card.utilLabel}</span>
                    <span style={{ color: card.utilColor, fontWeight: 700, fontSize: 14 }}>{card.util}</span>
                  </div>
                  <div style={{ padding: 8, background: card.actionBg, border: `1px solid ${card.actionBorder}`, borderRadius: 4 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: card.actionLabelColor, marginBottom: 4 }}>{card.actionLabel}</p>
                    <p style={{ fontSize: 14, color: C.onSurface }}>{card.action}{card.savings && <span style={{ fontWeight: 700 }}>{card.savings}</span>}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Credex */}
          <div style={{ gridColumn: "span 12", marginTop: 48 }}>
            <div style={{ background: "linear-gradient(to right, rgba(192,193,255,0.2), #131313, rgba(78,222,163,0.1))", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", border: `2px solid rgba(192,193,255,0.3)`, flexShrink: 0 }}>
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr8K2TUHeBzZm6H2duY_bKU4dLKxPpRnYcFNjxjlWkCcZtqfOhzs98zIWoZaPhzwX_XcIvVujy1FseEdcqOs4kZH1XppLMA0EU-oDshEcSNYSV5ilVVaG-UWdlnJiRxmBCVExHJbwm2XE36VICpGxDlbFCGlw-Bb2v_azHbBmHNUmIR9uMG8id19uel5YDirY89XSvzm5c4iue4PWNJEIbUThoJ5wSeif5P29ZDNUtzt_WMpKxPekqEg70OoucuZjTjj8Q9FhAGBzx" alt="Consultant" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <h4 style={{ fontSize: 24, fontWeight: 600, color: C.onSurface, marginBottom: 8 }}>Unlock further efficiencies with Credex</h4>
                  <p style={{ color: C.onSurfaceVariant, maxWidth: 560, fontSize: 14 }}>
                    Your current projected savings of <span style={{ color: C.secondary, fontWeight: 700 }}>$1,033/mo</span> qualify you for a complimentary expert audit. Let our specialists negotiate your enterprise AI contracts.
                  </p>
                </div>
              </div>
              <button style={{ background: C.onSurface, color: "#131313", padding: "16px 48px", borderRadius: 8, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
                Book Credex Consultation
              </button>
            </div>
          </div>
        </div>

        <footer style={{ marginTop: 48, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 48, display: "flex", justifyContent: "space-between", alignItems: "center", color: C.outline }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: C.onSurface }}>Audit.ai</p>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>© 2024 Audit.ai. Secure financial precision for builders.</p>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy", "Security", "Terms", "API Docs"].map((l) => (
              <a key={l} href="#" style={{ color: C.outline, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
}
