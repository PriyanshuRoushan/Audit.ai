import { useNavigate, useLocation } from 'react-router-dom';

export function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active page from path
  const path = location.pathname;
  let activePage = "landing";
  if (path.startsWith("/dashboard")) activePage = "dashboard";
  else if (path.startsWith("/audit")) activePage = "audit";
  else if (path.startsWith("/report")) activePage = "report";

  const handleNavigate = (key) => {
    if (key === "landing") navigate("/");
    else if (key === "dashboard") navigate("/dashboard");
    else if (key === "audit") navigate("/audit");
    else if (key === "report") navigate("/report/demo");
  };

  return (
    <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(19,19,19,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px" }}>
      <div className="flex items-center gap-10">
        <span
          onClick={() => handleNavigate("landing")}
          style={{ fontWeight: 700, fontSize: 24, color: "#e5e2e1", letterSpacing: "-0.01em", cursor: "pointer" }}
        >
          Audit.ai
        </span>
        <div 
          className="hidden md:flex items-center ml-4"
          style={{ display: "flex", gap: "10px" }}
        >
          {[["dashboard", "Dashboard"], ["audit", "Audit"], ["report", "History"], [null, "Settings"]].map(([key, label]) => (
            <button
              key={label}
              onClick={() => key && handleNavigate(key)}
              style={{
                fontSize: 14,
                fontWeight: activePage === key ? 700 : 500,
                color: activePage === key ? "#c0c1ff" : "#c7c4d7",
                background: "none",
                border: "none",
                cursor: "pointer",
                borderBottom: activePage === key ? "2px solid #c0c1ff" : "none",
                paddingBottom: activePage === key ? 4 : 0,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleNavigate("audit")}
          style={{ background: "#c0c1ff", color: "#1000a9", padding: "8px 16px", borderRadius: 8, fontWeight: 700, fontSize: 12, letterSpacing: "0.05em", border: "none", cursor: "pointer" }}
        >
          Connect Stack
        </button>
        <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-gBFYrEwUPYH_Q66K4W6bJlk5x8JuPt8_kKtSX0HxkLpjB081tC8PXJAd0YfRM_MtFjBcfOTQHLxDpAVcfv7cSjLpMO4seTg85V5IvFhNNX6sObsBeCJXNVy5sOScHcYisKA5TgRiCg8eaowxq6t6eTRjP068Yiwv0twbQ12mPlEZaqj7Y4_zkCZE8KWyVBv_iA1PA7xMwOY51-YBdrgPUQ5b_HOjpB_0W70sKbEXMdZAOIFJGuOiB-jjoGpmlOhx_mzKgTC6F1Au"
            alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    </nav>
  );
}
