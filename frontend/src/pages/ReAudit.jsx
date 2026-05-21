import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';

export default function ReAuditPage() {
  const { auditId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const routerNavigate = useNavigate();
  const navigate = (key) => {
    if (key === "dashboard") routerNavigate("/dashboard");
    else if (key === "audit") routerNavigate("/audit");
  };

  useEffect(() => {
    const runReAudit = async () => {
      try {
        const token = localStorage.getItem("token");
        const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        const res = await fetch(
          `${API}/api/re-audit/${auditId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to run re-audit");
        }

        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (auditId) {
      runReAudit();
    }
  }, [auditId]);

  const C = {
    primary: "#c0c1ff",
    secondary: "#4edea3",
    outline: "#908fa0",
    onSurface: "#e5e2e1",
    onSurfaceVariant: "#c7c4d7",
    onPrimary: "#1000a9",
    surface: "#131313",
    error: "#ffb4ab",
    success: "#4edea3"
  };

  if (loading) {
    return (
      <>
        <Nav />
        <main style={{ paddingTop: 128, paddingBottom: 48, background: "#131313", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: C.primary, animation: 'spin 2s linear infinite' }}>sync</span>
            <p style={{ color: C.onSurfaceVariant, marginTop: 16 }}>Re-analyzing infrastructure with latest market pricing...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Nav />
        <main style={{ paddingTop: 128, paddingBottom: 48, background: "#131313", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', padding: 32, borderRadius: 12 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: C.error }}>error</span>
            <p style={{ color: C.error, marginTop: 16, fontSize: 16, fontWeight: 500 }}>{error || "Re-audit failed"}</p>
            <button onClick={() => navigate("dashboard")} style={{ marginTop: 24, background: C.primary, color: C.onPrimary, padding: '8px 24px', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              Return to Dashboard
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { oldResult, newResult, diff } = data;
  const isSaving = diff.savingsDifference >= 0;

  return (
    <>
      <Nav />
      <main style={{ paddingTop: 128, paddingBottom: 48, background: "#131313" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px" }}>
          
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: C.outline, marginBottom: 4 }}>Dynamic Optimization</p>
              <h1 style={{ fontSize: 32, fontWeight: 700, color: C.onSurface, letterSpacing: '-0.02em' }}>Re-Audit Analysis</h1>
            </div>
            <button onClick={() => navigate("dashboard")} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 8, color: C.onSurface, cursor: 'pointer' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
              Dashboard
            </button>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
            
            {/* Impact Banner Card */}
            <div style={{ gridColumn: 'span 12', background: isSaving ? 'rgba(78,222,163,0.05)' : 'rgba(255,180,171,0.05)', border: `1px solid ${isSaving ? 'rgba(78,222,163,0.15)' : 'rgba(255,180,171,0.15)'}`, borderRadius: 16, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: isSaving ? C.success : C.error, background: isSaving ? 'rgba(78,222,163,0.1)' : 'rgba(255,180,171,0.1)', padding: '4px 8px', borderRadius: 4, letterSpacing: '0.05em' }}>
                  {isSaving ? 'Cost Savings Detected' : 'Price Increases Detected'}
                </span>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: C.onSurface, marginTop: 12 }}>
                  {isSaving 
                    ? `Re-running this audit reveals potential savings of $${diff.savingsDifference}/mo` 
                    : `Re-running this audit reveals monthly costs increased by $${Math.abs(diff.savingsDifference)}/mo`
                  }
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: 12, color: C.outline }}>Score Trajectory</span>
                <span style={{ fontSize: 28, fontWeight: 700, color: diff.scoreDifference >= 0 ? C.success : C.error }}>
                  {diff.scoreDifference >= 0 ? `+${diff.scoreDifference}` : diff.scoreDifference} Efficiency Points
                </span>
              </div>
            </div>

            {/* Side-by-Side Comparison */}
            <div style={{ gridColumn: 'span 6', background: 'rgba(23,23,23,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 24 }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 16, marginBottom: 20 }}>
                <span style={{ fontSize: 12, color: C.outline, fontWeight: 600 }}>HISTORICAL RECORD</span>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: C.onSurface, marginTop: 4 }}>Old Audit</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <span style={{ fontSize: 12, color: C.outline }}>Efficiency Score</span>
                  <div style={{ fontSize: 36, fontWeight: 700, color: C.primary, marginTop: 4 }}>{oldResult.score}/100</div>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: C.outline }}>Monthly Spend</span>
                  <div style={{ fontSize: 36, fontWeight: 700, color: C.onSurface, marginTop: 4 }}>${oldResult.monthlyCost}/mo</div>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: C.outline }}>Recommendations</span>
                  <p style={{ color: C.onSurfaceVariant, fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>{oldResult.recommendation}</p>
                </div>
              </div>
            </div>

            <div style={{ gridColumn: 'span 6', background: 'rgba(23,23,23,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 24, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 12, padding: 1, background: 'linear-gradient(to bottom, rgba(192,193,255,0.2), transparent)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', pointerEvents: 'none' }} />
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 16, marginBottom: 20 }}>
                <span style={{ fontSize: 12, color: C.primary, fontWeight: 600 }}>UPDATED WITH LATEST PRICES</span>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: C.onSurface, marginTop: 4 }}>New Audit</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <span style={{ fontSize: 12, color: C.outline }}>Efficiency Score</span>
                  <div style={{ fontSize: 36, fontWeight: 700, color: C.primary, marginTop: 4 }}>{newResult.score}/100</div>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: C.outline }}>Monthly Spend</span>
                  <div style={{ fontSize: 36, fontWeight: 700, color: isSaving ? C.success : C.error, marginTop: 4 }}>${newResult.monthlyCost}/mo</div>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: C.outline }}>Recommendations</span>
                  <p style={{ color: C.onSurfaceVariant, fontSize: 14, marginTop: 8, lineHeight: 1.5, background: diff.recommendationChanged ? 'rgba(192,193,255,0.05)' : 'none', padding: diff.recommendationChanged ? 12 : 0, borderRadius: 6, border: diff.recommendationChanged ? `1px dashed rgba(192,193,255,0.2)` : 'none' }}>
                    {newResult.recommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* Price Diff Table */}
            {diff.toolChanges && diff.toolChanges.length > 0 && (
              <div style={{ gridColumn: 'span 12', background: 'rgba(23,23,23,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 24, marginTop: 8 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: C.onSurface, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ color: C.primary }}>payments</span>
                  Dynamic Pricing Plan Differences
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: C.outline }}>
                        <th style={{ padding: '12px 16px', fontWeight: 600 }}>Tool</th>
                        <th style={{ padding: '12px 16px', fontWeight: 600 }}>Plan</th>
                        <th style={{ padding: '12px 16px', fontWeight: 600 }}>Old Price</th>
                        <th style={{ padding: '12px 16px', fontWeight: 600 }}>New Price</th>
                        <th style={{ padding: '12px 16px', fontWeight: 600 }}>Delta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {diff.toolChanges.map((change, i) => {
                        const delta = change.newPrice - change.oldPrice;
                        const isIncrease = delta > 0;
                        return (
                          <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: C.onSurfaceVariant }}>
                            <td style={{ padding: '16px', fontWeight: 600, color: C.onSurface, textTransform: 'capitalize' }}>{change.tool.replace('_', ' ')}</td>
                            <td style={{ padding: '16px' }}>{change.plan}</td>
                            <td style={{ padding: '16px' }}>${change.oldPrice}</td>
                            <td style={{ padding: '16px' }}>${change.newPrice}</td>
                            <td style={{ padding: '16px', fontWeight: 600, color: isIncrease ? C.error : C.success }}>
                              {isIncrease ? `+$${delta.toFixed(2)}` : `-$${Math.abs(delta).toFixed(2)}`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
