import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { tools } from '../data/tools';

const TOOLS = [
  { id: "cursor", label: "Cursor", sub: "AI Code Editor", icon: "code", colorClass: "text-primary", fill: false },
  { id: "chatgpt", label: "ChatGPT", sub: "Plus / Team / Enterprise", icon: "chat_bubble", colorClass: "text-secondary", fill: false },
  { id: "claude", label: "Claude", sub: "Anthropic Web UI", icon: "temp_preferences_custom", colorClass: "text-tertiary", fill: false },
  { id: "copilot", label: "GitHub Copilot", sub: "Business/Enterprise", icon: "terminal", colorClass: "text-on-surface", fill: false },
  { id: "gemini", label: "Gemini", sub: "Google Workspace", icon: "diamond", colorClass: "text-primary-fixed-dim", fill: true },
  { id: "openai", label: "OpenAI API", sub: "Token-based usage", icon: "api", colorClass: "text-on-tertiary-container", fill: false },
  { id: "anthropic", label: "Anthropic API", sub: "Claude API keys", icon: "hub", colorClass: "text-on-secondary-fixed-variant", fill: false },
  { id: "windsurf", label: "Windsurf", sub: "Next-gen Agentic IDE", icon: "surfing", colorClass: "text-secondary", fill: false },
];

const PLAN_OPTIONS = tools.reduce((acc, tool) => {
  acc[tool.id] = tool.plans;
  return acc;
}, {});

export default function AuditPage() {
  const routerNavigate = useNavigate();
  const navigate = (key) => {
    if (key === "audit") routerNavigate("/audit");
    else if (key === "report") routerNavigate("/report/demo");
    else if (key === "dashboard") routerNavigate("/dashboard");
    else if (key === "landing") routerNavigate("/");
  };

  const [selected, setSelected] = useState(new Set(["cursor", "chatgpt"]));
  const [metrics, setMetrics] = useState({
    cursor: { plan: "Business", spend: "400", seats: "20" },
    chatgpt: { plan: "Enterprise", spend: "1200", seats: "40" }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const toggle = (id) => {
    setSelected((p) => { 
      const n = new Set(p); 
      if (n.has(id)) {
        n.delete(id);
        const newMetrics = { ...metrics };
        delete newMetrics[id];
        setMetrics(newMetrics);
      } else {
        n.add(id);
        setMetrics({ ...metrics, [id]: { plan: PLAN_OPTIONS[id]?.[0] || "", spend: "", seats: "" } });
      }
      return n; 
    });
  };

  const handleMetricChange = (id, field, value) => {
    setMetrics({ 
      ...metrics, 
      [id]: { ...(metrics[id] || {}), [field]: value } 
    });
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

  // Calculate pending fields
  let pendingFields = 0;
  Array.from(selected).forEach(id => {
    const m = metrics[id];
    if (!m) {
      pendingFields += 3;
    } else {
      if (!m.plan) pendingFields++;
      if (!m.spend) pendingFields++;
      if (!m.seats) pendingFields++;
    }
  });

  const isToolSelectionDone = selected.size > 0;
  const isUsageMetricsDone = selected.size > 0 && pendingFields === 0;
  const isUsageMetricsActive = selected.size > 0 && pendingFields > 0;
  const isVerificationActive = isUsageMetricsDone;

  return (
    <>
      <Nav />
      <main className="pt-24 pb-section-gap px-container-padding max-w-[1400px] mx-auto grid grid-cols-12 gap-gutter">
        {/* Left Content Area */}
        <div className="col-span-12 lg:col-span-9 space-y-section-gap">
          {/* Header Section */}
          <header className="space-y-stack-sm">
            <div className="flex items-center gap-2 text-primary-fixed-dim">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span className="font-label-caps">AI STACK DISCOVERY</span>
            </div>
            <h1 className="font-h1 text-h1 text-on-surface">Configuration Audit</h1>
            <p className="text-on-surface-variant text-body-lg max-w-2xl">
              Identify and reconcile AI tooling expenditures across your engineering and product teams. Data is encrypted and anonymized.
            </p>
            <div className="flex items-center gap-stack-md pt-stack-sm">
              <div className="flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="text-secondary text-label-caps">Auto-saving to cloud</span>
              </div>
              <span className="text-outline text-label-caps">Last edit: 2 mins ago</span>
            </div>
          </header>

          {/* Audit Form Section */}
          <section className="space-y-stack-md">
            <div className="flex items-center justify-between">
              <h2 className="font-h2 text-h2">Select Tools in Use</h2>
              <span className="text-outline font-label-caps">Step 1 of 3</span>
            </div>
            {/* Tools Bento Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-stack-md">
              {TOOLS.map((tool) => {
                const isSel = selected.has(tool.id);
                return (
                  <div 
                    key={tool.id} 
                    onClick={() => toggle(tool.id)}
                    className={`${isSel ? 'ai-gradient-border' : ''} glass-card p-stack-md rounded-xl cursor-pointer group hover:bg-white/5 transition-all`}
                  >
                    <div className="flex justify-between items-start mb-stack-md">
                      <div className="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center border border-white/5">
                        <span className={`material-symbols-outlined ${tool.colorClass}`} style={tool.fill ? { fontVariationSettings: "'FILL' 1" } : {}}>
                          {tool.icon}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                        isSel 
                          ? 'border-2 border-primary-fixed-dim bg-primary' 
                          : 'border border-outline/30 group-hover:border-primary/50'
                      }`}>
                        {isSel && <span className="material-symbols-outlined text-[14px] text-on-primary font-bold">check</span>}
                      </div>
                    </div>
                    <p className="font-h3 text-h3 mb-1">{tool.label}</p>
                    <p className="text-outline text-body-sm">{tool.sub}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Usage Metrics Section */}
          {selected.size > 0 && (
            <section className="space-y-stack-md">
              <div className="flex items-center justify-between border-t border-white/5 pt-stack-md">
                <h2 className="font-h2 text-h2">Usage Metrics</h2>
                <span className="text-outline font-label-caps">Step 2 of 3</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-md w-full">
                {Array.from(selected).map((toolId) => {
                  const tool = TOOLS.find(t => t.id === toolId);
                  const toolMetrics = metrics[toolId] || { plan: '', spend: '', seats: '' };
                  const options = PLAN_OPTIONS[toolId] || ["Default"];

                  return (
                    <div key={toolId} className="glass-card p-stack-md rounded-xl border border-white/10 space-y-stack-md">
                      <div className="flex items-center gap-stack-sm border-b border-white/5 pb-stack-sm">
                        <div className="w-8 h-8 bg-surface-container-high rounded flex items-center justify-center">
                          <span className={`material-symbols-outlined text-[18px] ${tool.colorClass}`} style={tool.fill ? { fontVariationSettings: "'FILL' 1" } : {}}>
                            {tool.icon}
                          </span>
                        </div>
                        <span className="font-h3 text-h3">{tool.label}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-stack-sm">
                        <div className="space-y-1">
                          <label className="text-[10px] font-label-caps text-on-surface-variant uppercase">Plan</label>
                          <select 
                            value={toolMetrics.plan}
                            onChange={(e) => handleMetricChange(toolId, 'plan', e.target.value)}
                            className="w-full bg-surface-container-low border border-white/10 rounded-lg text-body-sm py-2 px-2 focus:ring-primary/20 focus:border-primary outline-none"
                          >
                            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-label-caps text-on-surface-variant uppercase">Spend ($)</label>
                          <input 
                            type="number" 
                            value={toolMetrics.spend}
                            onChange={(e) => handleMetricChange(toolId, 'spend', e.target.value)}
                            className="w-full bg-surface-container-low border border-white/10 rounded-lg text-body-sm py-2 px-2 font-mono focus:ring-primary/20 focus:border-primary outline-none" 
                            placeholder="0.00" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-label-caps text-on-surface-variant uppercase">Seats</label>
                          <input 
                            type="number" 
                            value={toolMetrics.seats}
                            onChange={(e) => handleMetricChange(toolId, 'seats', e.target.value)}
                            className="w-full bg-surface-container-low border border-white/10 rounded-lg text-body-sm py-2 px-2 font-mono focus:ring-primary/20 focus:border-primary outline-none" 
                            placeholder="0" 
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Spend Insight Card (AI Generated) */}
          <div className="ai-gradient-border p-container-padding rounded-xl bg-surface-container-low flex flex-col md:flex-row items-center gap-container-padding relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 rounded-full blur-[64px]"></div>
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-[32px]">insights</span>
            </div>
            <div className="flex-1 space-y-2 z-10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <h4 className="font-h3 text-h3">AI Spend Optimization Insight</h4>
              </div>
              <p className="text-on-surface-variant">
                Based on your Cursor and GitHub Copilot selection, we've detected potential seat redundancy. Consolidating to one provider could save <span className="text-secondary font-bold">$420/month</span>.
              </p>
            </div>
            <button onClick={() => navigate("report")} className="border border-white/10 px-stack-md py-stack-sm rounded-lg hover:bg-white/5 transition-all font-label-caps whitespace-nowrap z-10 bg-surface">
              View Report
            </button>
          </div>
        </div>

        {/* Sticky Progress Sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-gutter">
            <div className="glass-card p-stack-md rounded-xl space-y-stack-md">
              <h3 className="font-h3 text-h3">Audit Progress</h3>
              <div className="space-y-stack-md">
                <div className="flex gap-stack-md">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isToolSelectionDone ? 'bg-primary' : 'border-2 border-primary bg-background'}`}>
                      {isToolSelectionDone ? (
                        <span className="material-symbols-outlined text-[14px] text-on-primary font-bold">check</span>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      )}
                    </div>
                    <div className={`w-0.5 h-10 ${isToolSelectionDone ? 'bg-primary' : 'bg-white/10'}`}></div>
                  </div>
                  <div className="pb-stack-md">
                    <p className={`font-medium ${isToolSelectionDone ? 'text-primary' : 'text-on-surface'}`}>Tool Selection</p>
                    <p className="text-outline text-body-sm">{selected.size} tools identified</p>
                  </div>
                </div>
                
                <div className="flex gap-stack-md">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isUsageMetricsDone ? 'bg-primary border-primary' : isUsageMetricsActive ? 'border-primary bg-background' : 'border-white/10 bg-background'}`}>
                      {isUsageMetricsDone ? (
                        <span className="material-symbols-outlined text-[14px] text-on-primary font-bold">check</span>
                      ) : isUsageMetricsActive ? (
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      ) : null}
                    </div>
                    <div className={`w-0.5 h-10 ${isUsageMetricsDone ? 'bg-primary' : 'bg-white/10'}`}></div>
                  </div>
                  <div className="pb-stack-md">
                    <p className={`font-medium ${isUsageMetricsDone ? 'text-primary' : isUsageMetricsActive ? 'text-on-surface' : 'text-on-surface-variant'}`}>Usage Metrics</p>
                    <p className="text-outline text-body-sm">{!isToolSelectionDone ? 'Pending selection' : isUsageMetricsDone ? 'Completed' : `${pendingFields} fields pending`}</p>
                  </div>
                </div>
                
                <div className="flex gap-stack-md">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full border-2 bg-background flex items-center justify-center ${isVerificationActive ? 'border-primary' : 'border-white/10'}`}>
                      {isVerificationActive && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                    </div>
                  </div>
                  <div className="">
                    <p className={`font-medium ${isVerificationActive ? 'text-on-surface' : 'text-on-surface-variant'}`}>Verification</p>
                    <p className="text-outline text-body-sm">Connect SSO / Billing</p>
                  </div>
                </div>
              </div>
              
              {error && <p className="text-error text-body-sm mt-2">{error}</p>}
              
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting || !isUsageMetricsDone}
                className={`w-full py-stack-sm rounded-lg font-label-caps transition-all ${
                  isSubmitting || !isUsageMetricsDone 
                    ? 'bg-primary/50 text-on-primary/50 cursor-not-allowed' 
                    : 'bg-primary text-on-primary hover:opacity-90 active:scale-95'
                }`}
              >
                {isSubmitting ? "Analyzing..." : "Submit Audit"}
              </button>
            </div>
            
            <div className="bg-surface-container-high/50 p-stack-md rounded-xl border border-white/5 space-y-stack-sm">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">security</span>
                <span className="text-label-caps">Compliance Shield</span>
              </div>
              <p className="text-outline text-[12px]">Your data is SOC2 Type II compliant. No direct billing access is required for this phase.</p>
            </div>
          </div>
        </aside>
      </main>
      <Footer />
    </>
  );
}