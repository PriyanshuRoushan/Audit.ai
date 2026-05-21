import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

export default function ReportPage() {
  const { slug, shareToken } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const routerNavigate = useNavigate();
  const navigate = (key) => {
    if (key === "audit") routerNavigate("/audit");
    else if (key === "report") routerNavigate("/report/demo");
    else if (key === "dashboard") routerNavigate("/dashboard");
    else if (key === "landing") routerNavigate("/");
  };

  const handleCopyLink = () => {
    const tokenVal = report?.audits?.share_token;
    const shareUrl = tokenVal 
      ? `${window.location.origin}/share/${tokenVal}`
      : window.location.href;
    
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");
        const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        let url = '';
        let headers = {};

        if (shareToken) {
          url = `${API}/api/audits/share/${shareToken}`;
        } else {
          url = `${API}/api/audits/${slug}/report`;
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
        }

        const res = await fetch(url, { headers });

        if (!res.ok) throw new Error("Failed to fetch report");

        const data = await res.json();
        
        if (shareToken) {
          const normalizedReport = {
            ...data.report,
            audits: data.audit
          };
          setReport(normalizedReport);
        } else {
          setReport(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [slug, shareToken]);

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
          {report.audits?.invalidated && (
            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', padding: '16px 24px', borderRadius: 12, marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="material-symbols-outlined" style={{ color: '#fbbf24', animation: 'pulse 1.5s infinite', fontSize: 28 }}>warning</span>
                <div>
                  <strong style={{ color: '#fbbf24', fontSize: 16 }}>Pricing Update Detected</strong>
                  <p style={{ color: C.onSurfaceVariant, fontSize: 13, marginTop: 4 }}>
                    Pricing for tools in this audit has changed. The current report may be outdated.
                    {report.audits?.last_checked_at && ` (Last checked: ${new Date(report.audits.last_checked_at).toLocaleDateString()})`}
                  </p>
                </div>
              </div>
              <button onClick={() => routerNavigate(`/re-audit/${report.audits.id}`)} style={{ background: C.primary, color: C.onPrimary, border: 'none', padding: '8px 20px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                Re-Run Audit
              </button>
            </div>
          )}
          <style>{`@keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }`}</style>
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
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: C.outline }}>AI Usage Efficiency</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
                  <span style={{ fontSize: 64, fontWeight: 700, color: C.primary, letterSpacing: "-0.04em", lineHeight: 1 }}>{report.ai_usage_score || 0}%</span>
                  <span style={{ color: C.secondary, fontSize: 24, fontWeight: 600 }}>Utilization</span>
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
                <h3 style={{ fontSize: 18, fontWeight: 600, color: C.onSurface, marginBottom: 16 }}>Share Report</h3>
                <p style={{ fontSize: 13, color: C.onSurfaceVariant, marginBottom: 16, lineHeight: 1.5 }}>
                  Share this verified AI stack optimization report publicly using the secure link below:
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      readOnly 
                      value={report?.audits?.share_token ? `${window.location.origin}/share/${report.audits.share_token}` : 'Generating link...'} 
                      style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: C.onSurfaceVariant, fontSize: 13, outline: 'none', paddingRight: 40 }}
                    />
                    <span 
                      className="material-symbols-outlined" 
                      style={{ position: 'absolute', right: 12, color: C.outline, fontSize: 18 }}
                    >
                      link
                    </span>
                  </div>

                  <button 
                    onClick={handleCopyLink} 
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: copied ? 'rgba(78,222,163,0.15)' : C.primary, color: copied ? '#4edea3' : C.onPrimary, border: copied ? '1px solid #4edea3' : 'none', padding: '12px 0', borderRadius: 8, fontWeight: 700, cursor: "pointer", transition: 'all 0.2s' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                      {copied ? 'check_circle' : 'content_copy'}
                    </span>
                    {copied ? 'Link Copied!' : 'Copy Share Link'}
                  </button>

                  <button 
                    onClick={() => window.open(report?.audits?.share_token ? `/share/${report.audits.share_token}` : window.location.href, '_blank')} 
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: '12px 0', borderRadius: 8, fontWeight: 600, cursor: "pointer", color: C.onSurface, transition: 'all 0.2s' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>open_in_new</span>
                    Open Public Report
                  </button>
                </div>
              </div>
              <div style={{ background: "rgba(192,193,255,0.1)", border: "1px solid rgba(192,193,255,0.2)", borderRadius: 12, padding: 24 }}>
                <p style={{ fontSize: 14, color: C.primary, marginBottom: 8, fontWeight: 500 }}>Want these results?</p>
                <button onClick={() => navigate("audit")} style={{ width: "100%", background: C.primary, color: C.onPrimary, padding: "8px 0", borderRadius: 4, fontWeight: 700, border: "none", cursor: "pointer" }}>Get Free Audit</button>
              </div>
            </div>

            {/* Detected Issues */}
            {report.issues && report.issues.length > 0 && (
              <div style={{ gridColumn: "span 12", background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden", marginTop: 8, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span className="material-symbols-outlined" style={{ color: "#ffb4ab" }}>error</span>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: C.onSurface }}>Detected Issues</h3>
                </div>
                <ul style={{ listStyleType: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                  {report.issues.map((issue, idx) => (
                    <li key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "rgba(255,255,255,0.05)", padding: 16, borderRadius: 8 }}>
                       <span className="material-symbols-outlined" style={{ color: "#ffb4ab" }}>warning</span>
                       <span style={{ color: C.onSurfaceVariant, fontSize: 14, lineHeight: 1.5 }}>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* SEO & Performance Notes */}
            {(report.seo_notes || report.performance_notes) && (
              <div style={{ gridColumn: "span 12", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
                {report.seo_notes && (
                  <div style={{ background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                      <span className="material-symbols-outlined" style={{ color: C.primary }}>search</span>
                      <h3 style={{ fontSize: 18, fontWeight: 600, color: C.onSurface }}>SEO Notes</h3>
                    </div>
                    <p style={{ color: C.onSurfaceVariant, fontSize: 14, lineHeight: 1.6 }}>{report.seo_notes}</p>
                  </div>
                )}
                {report.performance_notes && (
                  <div style={{ background: "rgba(23,23,23,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                      <span className="material-symbols-outlined" style={{ color: C.primary }}>speed</span>
                      <h3 style={{ fontSize: 18, fontWeight: 600, color: C.onSurface }}>Performance Notes</h3>
                    </div>
                    <p style={{ color: C.onSurfaceVariant, fontSize: 14, lineHeight: 1.6 }}>{report.performance_notes}</p>
                  </div>
                )}
              </div>
            )}

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
