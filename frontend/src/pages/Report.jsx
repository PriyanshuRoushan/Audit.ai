import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

export default function ReportPage() {
  const { slug } = useParams(); // Using slug as the audit ID for now
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const routerNavigate = useNavigate();
  const navigate = (key) => {
    if (key === "audit") routerNavigate("/audit");
    else if (key === "report") routerNavigate("/report/demo");
    else if (key === "dashboard") routerNavigate("/dashboard");
    else if (key === "landing") routerNavigate("/");
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/audits/${slug}/report`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to fetch report');
        const data = await res.json();
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [slug]);

  const C = { primary: "#c0c1ff", secondary: "#4edea3", outline: "#908fa0", onSurface: "#e5e2e1", onSurfaceVariant: "#c7c4d7", onPrimary: "#1000a9" };

  if (loading) {
    return (
      <>
        <Nav />
        <main style={{ paddingTop: 128, paddingBottom: 48, background: "#131313", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <p style={{ color: C.onSurfaceVariant }}>Loading AI Evaluation...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !report) {
    return (
      <>
        <Nav />
        <main style={{ paddingTop: 128, paddingBottom: 48, background: "#131313", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <p style={{ color: "#ffb4ab" }}>{error || "Report not found"}</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <main style={{ paddingTop: 128, paddingBottom: 48, background: "#131313" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px" }}>
          <header style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(78,222,163,0.1)", color: C.secondary, padding: "4px 16px", borderRadius: 999, marginBottom: 16, border: "1px solid rgba(78,222,163,0.2)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Public Verified Report</span>
            </div>
            <h1 style={{ fontSize: "clamp(40px,6vw,60px)", fontWeight: 700, color: C.onSurface, marginBottom: 8, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
              {report.audits?.title || "Efficiency Audit"}
            </h1>
            <p style={{ fontSize: 16, color: C.onSurfaceVariant, lineHeight: 1.6 }}>
              {report.summary || "Anonymized summary of AI infrastructure optimizations and realized spend reductions."}
            </p>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16 }}>
            {/* Hero Metric */}
            <div style={{ gridColumn: "span 8", background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 320 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: C.outline }}>Annualized Projected Savings</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
                  <span style={{ fontSize: 64, fontWeight: 700, color: C.primary, letterSpacing: "-0.04em", lineHeight: 1 }}>$142,400</span>
                  <span style={{ color: C.secondary, fontSize: 24, fontWeight: 600 }}>+24.2% efficiency</span>
                </div>
              </div>
              <div style={{ marginTop: 48 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: C.onSurfaceVariant, fontSize: 14 }}>Audit Integrity Score</span>
                  <span style={{ color: C.primary, fontWeight: 700 }}>{report.score}/100</span>
                </div>
                <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${report.score}%`, background: C.primary, borderRadius: 999, boxShadow: "0 0 8px rgba(192,193,255,0.5)" }} />
                </div>
              </div>
            </div>

            {/* Share */}
            <div style={{ gridColumn: "span 4", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24, flex: 1 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: C.onSurface, marginBottom: 16 }}>Share Impact</h3>
                {[{ icon: "share", label: "Share on Twitter", tr: "arrow_forward" }, { icon: "work", label: "Post to LinkedIn", tr: "arrow_forward" }, { icon: "content_copy", label: "Copy Report Link", tr: "link" }].map((btn) => (
                  <button key={btn.label} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: 16, borderRadius: 8, cursor: "pointer", marginBottom: 8, color: C.onSurface }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 14, fontWeight: 500 }}>
                      <span className="material-symbols-outlined" style={{ color: C.outline }}>{btn.icon}</span>
                      {btn.label}
                    </span>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: C.outline }}>{btn.tr}</span>
                  </button>
                ))}
              </div>
              <div style={{ background: "rgba(192,193,255,0.1)", border: "1px solid rgba(192,193,255,0.2)", borderRadius: 12, padding: 24 }}>
                <p style={{ fontSize: 14, color: C.primary, marginBottom: 8, fontWeight: 500 }}>Want these results?</p>
                <button onClick={() => navigate("audit")} style={{ width: "100%", background: C.primary, color: C.onPrimary, padding: "8px 0", borderRadius: 4, fontWeight: 700, border: "none", cursor: "pointer" }}>Get Free Audit</button>
              </div>
            </div>

            {/* Social Preview */}
            <div style={{ gridColumn: "span 12", background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden", marginTop: 8 }}>
              <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: C.outline }}>Social Preview Optimization</span>
                <span className="material-symbols-outlined" style={{ color: C.outline }}>visibility</span>
              </div>
              <div style={{ padding: 24, display: "flex", gap: 16 }}>
                <div style={{ width: "50%", aspectRatio: "16/9", borderRadius: 8, overflow: "hidden", position: "relative", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ0uKTpxh0lXHSKeBrvzwEPXYlfkeMTS0opy4VAB5W3sEDm4jFFcceTHGpYM7KKE-RPG-ZbS5uO97T6agLyygwnKnbRt5utTM6ZGKi2TK0JgjFcemu6Aw0qGv3nYo46lZzdP-SKGGWUgNz7-Bq1cxaxHwA7sp3TkOzWWbgnPiHIFzil0dx3mJw7N_Ea99BDJPo8Fwfa-QYsGbHFu_BFZBEVBd1ak8V0doDgNM9NpSUqz3rzs8ulikBau6Com-_KTi04kIu3aKoWXe8" alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #131313, transparent)" }} />
                  <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 4 }}>Audit.ai Realized Savings</div>
                    <div style={{ fontSize: 14, color: C.primary, fontWeight: 700 }}>+$142k Optimized Yearly</div>
                  </div>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
                  <div>
                    <h4 style={{ fontSize: 18, fontWeight: 600, color: C.onSurface }}>Dynamic Metadata</h4>
                    <p style={{ fontSize: 14, color: C.onSurfaceVariant }}>The public report link automatically generates high-impact cards for social platforms using real-time data.</p>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[{ l: "TITLE TAG", v: "Public Audit: $142k Saved" }, { l: "IMAGE SOURCE", v: "og_report_q4.png" }].map((m) => (
                      <div key={m.l} style={{ background: "rgba(255,255,255,0.05)", padding: 8, borderRadius: 4, border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: C.outline, display: "block" }}>{m.l}</span>
                        <span style={{ fontFamily: "monospace", fontSize: 11, color: C.onSurface }}>{m.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Insight Cards (Dynamic from recommendations) */}
            {(report.recommendations || []).map((rec, index) => (
              <div key={index} style={{ gridColumn: "span 6", background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span className="material-symbols-outlined" style={{ color: C.secondary }}>bolt</span>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: C.onSurface }}>Recommendation {index + 1}</h3>
                </div>
                <p style={{ color: C.onSurfaceVariant, marginBottom: 16, lineHeight: 1.6, fontSize: 14 }}>{rec}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ background: `${C.secondary}18`, color: C.secondary, fontSize: 12, padding: "2px 8px", borderRadius: 4, fontWeight: 700, border: `1px solid ${C.secondary}33` }}>
                    {report.risk_level === 'High' ? 'HIGH PRIORITY' : 'ACTIONABLE'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
