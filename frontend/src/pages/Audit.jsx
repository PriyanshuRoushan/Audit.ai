import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const TOOLS = [
  { id: "cursor", label: "Cursor", sub: "AI Code Editor", icon: "code", color: "#c0c1ff", selected: true },
  { id: "chatgpt", label: "ChatGPT", sub: "Plus / Team / Enterprise", icon: "chat_bubble", color: "#4edea3" },
  { id: "claude", label: "Claude", sub: "Anthropic Web UI", icon: "temp_preferences_custom", color: "#ffb2b7" },
  { id: "copilot", label: "GitHub Copilot", sub: "Business/Enterprise", icon: "terminal", color: "#e5e2e1" },
  { id: "gemini", label: "Gemini", sub: "Google Workspace", icon: "diamond", color: "#c0c1ff", fill: true },
  { id: "openai", label: "OpenAI API", sub: "Token-based usage", icon: "api", color: "#ff516a" },
  { id: "anthropic", label: "Anthropic API", sub: "Claude API keys", icon: "hub", color: "#005236" },
  { id: "windsurf", label: "Windsurf", sub: "Next-gen Agentic IDE", icon: "surfing", color: "#4edea3" },
];

export default function AuditPage() {
  const routerNavigate = useNavigate();
  const navigate = (key) => {
    if (key === "audit") routerNavigate("/audit");
    else if (key === "report") routerNavigate("/report/demo");
    else if (key === "dashboard") routerNavigate("/dashboard");
    else if (key === "landing") routerNavigate("/");
  };

  const [selected, setSelected] = useState(new Set(["cursor"]));
  const [metrics, setMetrics] = useState({ monthlySpend: '', numSeats: '', teamSize: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const C = { primary: "#c0c1ff", secondary: "#4edea3", outline: "#908fa0", onSurface: "#e5e2e1", onSurfaceVariant: "#c7c4d7", onPrimary: "#1000a9", background: "#131313", error: "#ffb4ab" };

  const toggle = (id) => setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleMetricChange = (e, field) => {
    setMetrics({ ...metrics, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in first.');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/audits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          selectedTools: Array.from(selected),
          metrics: metrics
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit audit');
      }

      // Redirect to the newly generated report
      routerNavigate(`/report/${data.report.audit_id}`);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Nav />
      <main style={{ paddingTop: 96, paddingBottom: 48, background: "#131313" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            {/* Header */}
            <header>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#c0c1ff", marginBottom: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>AI Stack Discovery</span>
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 700, color: C.onSurface, marginBottom: 8 }}>Configuration Audit</h1>
              <p style={{ color: C.onSurfaceVariant, fontSize: 16, maxWidth: 640, lineHeight: 1.6 }}>
                Identify and reconcile AI tooling expenditures across your engineering and product teams. Data is encrypted and anonymized.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 12px", background: "rgba(78,222,163,0.1)", border: "1px solid rgba(78,222,163,0.2)", borderRadius: 999 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.secondary }} />
                  <span style={{ color: C.secondary, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Auto-saving to cloud</span>
                </div>
                <span style={{ color: C.outline, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Last edit: 2 mins ago</span>
              </div>
            </header>

            {/* Tool Grid */}
            <section>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 24, fontWeight: 600, color: C.onSurface }}>Select Tools in Use</h2>
                <span style={{ color: C.outline, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Step 1 of 3</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
                {TOOLS.map((tool) => {
                  const isSel = selected.has(tool.id);
                  return (
                    <div key={tool.id} onClick={() => toggle(tool.id)} style={{ padding: 16, borderRadius: 12, cursor: "pointer", background: "rgba(23,23,23,0.7)", backdropFilter: "blur(12px)", border: isSel ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)", backgroundImage: isSel ? "linear-gradient(#171717,#171717), linear-gradient(to bottom, rgba(192,193,255,0.3), transparent)" : undefined, backgroundOrigin: isSel ? "padding-box, border-box" : undefined, backgroundClip: isSel ? "padding-box, border-box" : undefined, transition: "all 0.2s" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                        <div style={{ width: 48, height: 48, background: "#2a2a2a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
                          <span className="material-symbols-outlined" style={{ color: tool.color, fontVariationSettings: tool.fill ? "'FILL' 1" : undefined }}>{tool.icon}</span>
                        </div>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", border: isSel ? "2px solid #c0c1ff" : "1px solid rgba(144,143,160,0.3)", background: isSel ? C.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {isSel && <span className="material-symbols-outlined" style={{ fontSize: 14, color: C.onPrimary, fontWeight: 700 }}>check</span>}
                        </div>
                      </div>
                      <p style={{ fontSize: 18, fontWeight: 600, color: C.onSurface, marginBottom: 4 }}>{tool.label}</p>
                      <p style={{ fontSize: 14, color: C.outline }}>{tool.sub}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Metrics */}
            <section>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16, marginBottom: 16 }}>
                <h2 style={{ fontSize: 24, fontWeight: 600, color: C.onSurface }}>Usage Metrics</h2>
                <span style={{ color: C.outline, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Step 2 of 3</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                  { id: "monthlySpend", label: "Monthly Spend ($)", prefix: "$", placeholder: "0.00", hint: "Aggregated across all selected tools." },
                  { id: "numSeats", label: "Number of Seats", icon: "person", placeholder: "0", hint: "Total licensed user accounts." },
                  { id: "teamSize", label: "Total Team Size", icon: "groups", placeholder: "0", hint: "Denominator for penetration %." }
                ].map((f) => (
                  <div key={f.label}>
                    <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: C.onSurfaceVariant, display: "block", marginBottom: 8 }}>{f.label}</label>
                    <div style={{ position: "relative" }}>
                      {f.prefix && <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: C.outline }}>{f.prefix}</span>}
                      {f.icon && <span className="material-symbols-outlined" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: C.outline, fontSize: 20 }}>{f.icon}</span>}
                      <input 
                        type="number" 
                        value={metrics[f.id]}
                        onChange={(e) => handleMetricChange(e, f.id)}
                        placeholder={f.placeholder} 
                        style={{ width: "100%", background: C.background, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "16px 16px 16px", paddingLeft: f.prefix || f.icon ? 32 : 16, color: C.onSurface, fontSize: 14, fontFamily: "monospace", outline: "none", boxSizing: "border-box" }} 
                      />
                    </div>
                    <p style={{ fontSize: 12, color: C.outline, marginTop: 4 }}>{f.hint}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* AI Insight */}
            <div style={{ padding: 24, borderRadius: 12, display: "flex", gap: 24, alignItems: "center", background: "linear-gradient(#1c1b1b,#1c1b1b) padding-box, linear-gradient(to bottom, rgba(192,193,255,0.3), transparent) border-box", border: "1px solid transparent", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -48, top: -48, width: 192, height: 192, background: "rgba(192,193,255,0.1)", borderRadius: "50%", filter: "blur(64px)" }} />
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(192,193,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: 32 }}>insights</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: 16, fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <h4 style={{ fontSize: 18, fontWeight: 600, color: C.onSurface }}>AI Spend Optimization Insight</h4>
                </div>
                <p style={{ color: C.onSurfaceVariant, fontSize: 14 }}>
                  Based on your Cursor and GitHub Copilot selection, we've detected potential seat redundancy. Consolidating to one provider could save <span style={{ color: C.secondary, fontWeight: 700 }}>$420/month</span>.
                </p>
              </div>
              <button onClick={() => navigate("report")} style={{ border: "1px solid rgba(255,255,255,0.1)", padding: "8px 16px", borderRadius: 8, background: "none", color: C.onSurface, cursor: "pointer", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                View Report
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div style={{ position: "sticky", top: 96, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: C.onSurface, marginBottom: 16 }}>Audit Progress</h3>
                {[{ done: true, active: false, label: "Tool Selection", sub: `${selected.size} tools identified` }, { done: false, active: true, label: "Usage Metrics", sub: "3 fields pending" }, { done: false, active: false, label: "Verification", sub: "Connect SSO / Billing" }].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, marginBottom: i < 2 ? 0 : 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: step.done ? C.primary : "transparent", border: step.done ? "none" : step.active ? `2px solid ${C.primary}` : "2px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {step.done && <span className="material-symbols-outlined" style={{ fontSize: 14, color: C.onPrimary }}>check</span>}
                        {step.active && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.primary }} />}
                      </div>
                      {i < 2 && <div style={{ width: 2, height: 40, background: step.done ? C.primary : "rgba(255,255,255,0.1)" }} />}
                    </div>
                    <div style={{ paddingBottom: i < 2 ? 16 : 0 }}>
                      <p style={{ fontWeight: 500, color: step.done ? C.primary : step.active ? C.onSurface : C.onSurfaceVariant }}>{step.label}</p>
                      <p style={{ color: C.outline, fontSize: 14 }}>{step.sub}</p>
                    </div>
                  </div>
                ))}
                {error && <p style={{ color: C.error, fontSize: 14, marginTop: 16, marginBottom: 0 }}>{error}</p>}
                <button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  style={{ width: "100%", background: C.primary, color: C.onPrimary, padding: "8px 0", borderRadius: 8, fontWeight: 700, fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase", border: "none", cursor: isSubmitting ? "not-allowed" : "pointer", marginTop: 16, opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? "Analyzing..." : "Submit Audit"}
                </button>
              </div>
              <div style={{ background: "rgba(42,42,42,0.5)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.onSurfaceVariant, marginBottom: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>security</span>
                  <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Compliance Shield</span>
                </div>
                <p style={{ color: C.outline, fontSize: 12 }}>Your data is SOC2 Type II compliant. No direct billing access is required for this phase.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}