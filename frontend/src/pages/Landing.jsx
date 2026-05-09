import { useNavigate } from 'react-router-dom';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

const TESTIMONIALS = [
  { quote: "Audit.ai found $32,000 in unused seats in the first 10 minutes. It paid for itself for the next 5 years instantly.", name: "Sarah Chen", title: "Head of Finance, Linear Systems", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBiWJsAdT13hkG3UO4guyasW4ZRUimmH__88tGympmJ3-BQ3Yzrp79treRw6y4FuoigJAg8pkOsL-FE1pQZY3e_vsHJtamBlvE9ncm4et6rrhz7Z6gXm625a9hFNgt7oMP5Po8vAQoMhdDb1--fLPlPu4L1-oSdiu65llSR9-QgoXcgVQXJ0lFBu1QwrA-Z7LxFg_Fj4fiyTH6thaDCj8paP7NR7vwFCfXATlBxTrL-Zl0bH2sp-_H59rHnwudcLk1Kp3tSidB3NAQ", accent: "" },
  { quote: "The AI insights are scary accurate. It flagged a duplicate billing for a tool we thought we'd canceled months ago.", name: "Marcus V.", title: "CFO, NextScale", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjdqBNl864QAdHKw3B7kSjkg41p6HAHteNr4r37Wz8eBSy6tw_8IgGNQD9A9xbbXO4X1WOX1vhMFJkEvnjO7_qGFn8gIW7TPk-LTBcv-ytngJWfJ5widv5CSc5P7wLdM8cBOCwJTD17bFmli_bFpgOOBrsAMUesNFS4wLWSnHQAq046-XTQC7Jh7tqrdVMn87ad6wSE90rw5iayXMl9P-6aaghF_DEOVP4bFbXsQCEMFMWjtd5JFK5seqBgNxst3asMn3kMLpbK-jP", accent: "border-t-2 border-purple-400" },
  { quote: "Finally, a tool that actually understands the complexity of modern API usage and tiered enterprise pricing.", name: "Elena G.", title: "VP Ops, Vertex", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2FBtFKPPw9Lkx8SJYOf9akT-7_ARsvY8Z8BxgGbjYjpU38_yB8TkgWx7_3LztWQReX9yL3YykOaJmg9m2jlmfT8ggJv-5Oi7C7Emx-uEgepP7EK1ohlprxSrZl9yXCmvPwV8M1PoGvb3iSiDfQraJw1t7sL5YT-QxZ9NH-ucHtdwOrXlIyZeLNMaZnraMdt76VV44rud7gUb6ATvlzzv0FN8pBUA-DoCMdwI6AnZ1cMElVt03myrElX2jktav-a9JCmv8brSQFNMP", accent: "" },
];

export default function LandingPage() {
  const routerNavigate = useNavigate();
  const navigate = (key) => {
    if (key === "audit") routerNavigate("/audit");
    else if (key === "report") routerNavigate("/report/demo");
    else if (key === "dashboard") routerNavigate("/dashboard");
    else if (key === "landing") routerNavigate("/");
  };

  const C = { primary: "#c0c1ff", secondary: "#4edea3", tertiary: "#ffb2b7", error: "#ffb4ab", outline: "#908fa0", surface: "#131313", onSurface: "#e5e2e1", onSurfaceVariant: "#c7c4d7", onPrimary: "#1000a9" };

  return (
    <>
      <Nav />
      <main style={{ paddingTop: 96, background: "#131313" }}>
        {/* Hero */}
        <section style={{ padding: "48px 24px 96px", background: "radial-gradient(circle at 50% 50%, rgba(192,193,255,0.08) 0%, transparent 50%)" }}>
          <div style={{ maxWidth: 1152, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "4px 16px", borderRadius: 999, marginBottom: 16 }}>
              <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: 18, fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.primary, letterSpacing: "0.1em", textTransform: "uppercase" }}>New: Instant SaaS Audits</span>
            </div>
            <h1 style={{ fontSize: "clamp(40px,6vw,60px)", fontWeight: 700, color: C.onSurface, marginBottom: 16, lineHeight: 1.1, letterSpacing: "-0.04em" }}>
              Stop Overpaying for AI Tools
            </h1>
            <p style={{ fontSize: 16, color: C.onSurfaceVariant, marginBottom: 48, maxWidth: 640, margin: "0 auto 48px", lineHeight: 1.6 }}>
              Audit.ai connects to your financial stack to identify ghost seats, redundant subscriptions, and inefficient AI spend in under 60 seconds.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
              <button onClick={() => navigate("audit")} style={{ background: C.primary, color: C.onPrimary, padding: "16px 32px", borderRadius: 12, fontWeight: 600, fontSize: 18, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                Run Free Audit <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button onClick={() => navigate("report")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: C.onSurface, padding: "16px 32px", borderRadius: 12, fontWeight: 600, fontSize: 18, cursor: "pointer" }}>
                View Demo
              </button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div style={{ maxWidth: 960, margin: "80px auto 0", position: "relative" }}>
            <div style={{ position: "absolute", inset: -4, background: "linear-gradient(to right, rgba(192,193,255,0.2), rgba(78,222,163,0.2))", borderRadius: 16, filter: "blur(24px)", opacity: 0.5 }} />
            <div style={{ position: "relative", background: "rgba(23,23,23,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {[C.error, C.tertiary, C.secondary].map((c, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c, opacity: 0.4 }} />)}
                </div>
                <span style={{ color: C.onSurfaceVariant, fontFamily: "monospace", fontSize: 11, opacity: 0.5 }}>DASHBOARD_LIVE_FEED_v2.0</span>
              </div>
              <div style={{ padding: 24, display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16 }}>
                <div style={{ gridColumn: "span 8", display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: C.onSurfaceVariant, marginBottom: 8 }}>Monthly AI Spend Trend</div>
                    <div style={{ height: 192, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 8px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                      {[66, 50, 75, 33, 83, 50].map((h, i) => (
                        <div key={i} style={{ width: 32, borderRadius: "4px 4px 0 0", height: `${h}%`, background: `rgba(192,193,255,${0.2 + i * 0.12})` }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ gridColumn: "span 4", display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderLeft: `2px solid rgba(78,222,163,0.5)`, borderRadius: 8, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: C.secondary }}>Projected Savings</span>
                      <span className="material-symbols-outlined" style={{ color: C.secondary, fontVariationSettings: "'FILL' 1", fontSize: 20 }}>trending_down</span>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: C.onSurface }}>$12,450.00</div>
                    <div style={{ fontSize: 14, color: C.onSurfaceVariant }}>Annualized waste found</div>
                  </div>
                  <div style={{ background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderLeft: `2px solid rgba(192,193,255,0.5)`, borderRadius: 8, padding: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: C.primary, marginBottom: 8 }}>AI Tool Density</div>
                    <div style={{ fontSize: 24, fontWeight: 600, color: C.onSurface }}>42 Seats</div>
                    <div style={{ fontSize: 14, color: C.onSurfaceVariant }}>Across 14 platforms</div>
                  </div>
                </div>
                <div style={{ gridColumn: "span 12", background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ padding: "8px 16px", background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.1)", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: C.onSurfaceVariant }}>Latest Audit Findings</div>
                  {[{ l: "C", name: "Claude Enterprise", sub: "6 Inactive seats detected", badge: "Flagged", badgeStyle: { background: "rgba(255,180,171,0.1)", color: C.error }, lc: C.primary }, { l: "O", name: "OpenAI API", sub: "Unusual token spike (Tier 4)", badge: "Investigate", badgeStyle: { background: "rgba(78,222,163,0.1)", color: C.secondary }, lc: C.secondary }].map(row => (
                    <div key={row.name} style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 4, background: "#201f1f", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: row.lc }}>{row.l}</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.onSurface }}>{row.name}</div>
                          <div style={{ fontSize: 11, color: C.onSurfaceVariant }}>{row.sub}</div>
                        </div>
                      </div>
                      <div style={{ ...row.badgeStyle, padding: "4px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>{row.badge}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By */}
        <section style={{ padding: "48px 24px", borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)", background: "#0e0e0e" }}>
          <div style={{ maxWidth: 1152, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.outline, marginBottom: 16 }}>Auditing spend for teams at</p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 48, opacity: 0.5, filter: "grayscale(1)" }}>
              {["AB6AXuBsQM1cy9_vgn3FR0k5liyW1FSKDU3d5fEDyR5vshRaWZ0Bz9S6kMb-u25Cd1OyPi7yoQpfBor4wgK9Mm00YHLrs5ScV0Kd_jMzJZc7G9a_TR3oUcCWveSgjh09CqNsAh6l2fkGDZ8rS_lkOSsNXhz35K3ArPjclq7IhgXarh7KoKVxGecnEnx34dA11W-JknnyXXrFSePLlCrPnekQfm-4oQs8N3FIvvUoWqYp6g9FziQ48WcziS5rLS_PqydSKPLJGyxsRoo8oXhZ", "AB6AXuAM0Ilhb1QfvrxLpdEdr3Yj5GQhdsiIWrf_8H0cdcPBCEnlwrAVpl1m_xc5nRZnZOdXuQPu4O7mx_lDoRSbQHUmxsbfJy_s1ud9Pi0g_wqDAUyyKQ7dFEp4SZR7cWWo8QfiOJRQfrdCvYIn9rT48QuLq742ip3JXGdn8TvDaOgTgbREf6bxVEFYHL8Z8ltzNFYBKC2gBuz2VbitKYakXOTTwL4EUXpMAkiLP_9WTSjwne5rTuDtlVyUc1qhd39NEu8linFDTWSsmMMC"].map((id, i) => (
                <img key={i} src={`https://lh3.googleusercontent.com/aida-public/${id}`} alt="Partner" style={{ height: 24, objectFit: "contain" }} />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section style={{ padding: "48px 24px" }}>
          <div style={{ maxWidth: 1152, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <h2 style={{ fontSize: 32, fontWeight: 700, color: C.onSurface, marginBottom: 8 }}>Audit Your Stack in 3 Steps</h2>
              <p style={{ color: C.onSurfaceVariant }}>Zero complex setup. Complete visibility in minutes.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
              {[
                { icon: "link", color: C.primary, bg: "rgba(192,193,255,0.1)", title: "Connect", desc: "Link your Plaid, Stripe, or Quickbooks account via secure, read-only API access." },
                { icon: "auto_awesome", color: C.secondary, bg: "rgba(78,222,163,0.1)", title: "Analyze", desc: "Our AI scans for duplicate SaaS billing, unassigned seats, and tier mismatches.", fill: true },
                { icon: "payments", color: C.tertiary, bg: "rgba(255,178,183,0.1)", title: "Save", desc: "Receive a prioritized list of savings. One click cancels or downgrades redundant tools." },
              ].map((step) => (
                <div key={step.title} style={{ background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: step.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <span className="material-symbols-outlined" style={{ color: step.color, fontVariationSettings: step.fill ? "'FILL' 1" : undefined }}>{step.icon}</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: C.onSurface }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: C.onSurfaceVariant }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section style={{ padding: "48px 24px", background: "#1c1b1b" }}>
          <div style={{ maxWidth: 1152, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16 }}>
            <div style={{ gridColumn: "span 8", background: "linear-gradient(to bottom right, rgba(192,193,255,0.1), transparent), rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", minHeight: 200 }}>
              <div style={{ marginBottom: "auto" }}>
                <span style={{ padding: "4px 8px", borderRadius: 4, background: "rgba(192,193,255,0.2)", color: C.primary, fontSize: 10, fontWeight: 700 }}>EFFICIENCY</span>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 600, color: C.onSurface, marginBottom: 8 }}>Identify Redundant AI Licenses</h3>
              <p style={{ color: C.onSurfaceVariant, maxWidth: 440 }}>Companies spend $1,400 per employee on tools they never log into. We find every single one.</p>
            </div>
            <div style={{ gridColumn: "span 4", background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderLeft: `4px solid ${C.secondary}`, borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: 200 }}>
              <div style={{ fontSize: 48, fontWeight: 700, color: C.secondary, marginBottom: 8 }}>24%</div>
              <p style={{ fontSize: 18, fontWeight: 600, color: C.onSurface }}>Average Savings</p>
              <p style={{ fontSize: 14, color: C.onSurfaceVariant }}>On total monthly SaaS burn</p>
            </div>
            <div style={{ gridColumn: "span 4", background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24, minHeight: 180 }}>
              <span className="material-symbols-outlined" style={{ color: C.tertiary, fontSize: 40, marginBottom: 16, display: "block" }}>security</span>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: C.onSurface }}>Bank-Level Security</h3>
              <p style={{ fontSize: 14, color: C.onSurfaceVariant }}>SOC2 Type II compliant with AES-256 encryption on all financial metadata.</p>
            </div>
            <div style={{ gridColumn: "span 8", background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24, display: "flex", gap: 16, alignItems: "center", minHeight: 180 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 24, fontWeight: 600, color: C.onSurface, marginBottom: 8 }}>Real-time Anomaly Detection</h3>
                <p style={{ color: C.onSurfaceVariant }}>Get alerted the moment a "free trial" converts to a $5k monthly enterprise commitment.</p>
              </div>
              <div style={{ width: 128, height: 128, borderRadius: 8, background: "#131313", flexShrink: 0, border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <div style={{ width: "100%", height: "50%", background: "rgba(255,180,171,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="material-symbols-outlined" style={{ color: C.error }}>warning</span>
                </div>
                <div style={{ padding: 8, fontSize: 10, fontFamily: "monospace", color: C.outline }}>ALERT_LOG_ID_778</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section style={{ padding: "48px 24px" }}>
          <div style={{ maxWidth: 1152, margin: "0 auto" }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, textAlign: "center", marginBottom: 64, color: C.onSurface }}>Loved by Finance Teams</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {TESTIMONIALS.map((t) => (
                <div key={t.name} style={{ background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderTop: t.accent ? "2px solid #c0c1ff" : undefined, borderRadius: 12, padding: 24, position: "relative" }}>
                  <span className="material-symbols-outlined" style={{ position: "absolute", top: 16, right: 16, fontSize: 40, color: "rgba(255,255,255,0.1)" }}>format_quote</span>
                  <p style={{ fontSize: 16, fontStyle: "italic", color: C.onSurface, marginBottom: 16, lineHeight: 1.6 }}>"{t.quote}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <img src={t.img} alt={t.name} style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)" }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: C.onSurface }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: C.onSurfaceVariant }}>{t.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "48px 24px", background: "#0e0e0e" }}>
          <div style={{ maxWidth: 768, margin: "0 auto" }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: "center", marginBottom: 48, color: C.onSurface }}>Common Questions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { q: "Is my data safe?", a: "Absolutely. We use read-only API keys and never store your raw credentials. Our platform is SOC2 Type II compliant and we undergo annual third-party security audits.", open: true },
                { q: "How long does an audit take?", a: "Once you connect your accounts, our initial analysis typically finishes in under 60 seconds. Larger enterprises may take up to 5 minutes." },
                { q: "What tools do you integrate with?", a: "We support 5,000+ financial platforms via Plaid and Stripe, as well as direct SSO integrations with Okta, Google Workspace, and Microsoft Entra." },
              ].map((faq) => (
                <details key={faq.q} style={{ background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} open={faq.open}>
                  <summary style={{ padding: 16, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 18, fontWeight: 600, color: C.onSurface, listStyle: "none" }}>
                    {faq.q}
                    <span className="material-symbols-outlined">expand_more</span>
                  </summary>
                  <div style={{ padding: "0 16px 16px", color: C.onSurfaceVariant, fontSize: 14 }}>{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "48px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: 896, margin: "0 auto", background: "linear-gradient(to top, rgba(192,193,255,0.05), transparent)", border: "2px solid rgba(192,193,255,0.2)", borderRadius: 24, padding: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: C.onSurface, marginBottom: 16 }}>Ready to cut the waste?</h2>
            <p style={{ color: C.onSurfaceVariant, fontSize: 16, marginBottom: 16 }}>Join 500+ teams who have optimized their AI spend with Audit.ai</p>
            <button onClick={() => navigate("audit")} style={{ background: C.primary, color: C.onPrimary, padding: "16px 48px", borderRadius: 12, fontSize: 24, fontWeight: 600, border: "none", cursor: "pointer" }}>
              Run Free Audit
            </button>
            <p style={{ marginTop: 16, color: C.outline, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }}>NO CREDIT CARD REQUIRED • 60-SECOND SETUP</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
