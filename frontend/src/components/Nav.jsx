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
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-white/10 flex justify-between items-center px-container-padding py-stack-md">
      <div className="flex items-center gap-gutter">
        <span 
          onClick={() => handleNavigate("landing")}
          className="font-h2 text-h2 font-bold text-on-surface tracking-tight cursor-pointer"
        >
          Audit.ai
        </span>
        <div className="hidden md:flex items-center gap-stack-md ml-stack-md">
          {[["dashboard", "Dashboard"], ["audit", "Audit"], ["report", "History"], [null, "Settings"]].map(([key, label]) => (
            <button
              key={label}
              onClick={() => key && handleNavigate(key)}
              className={`${
                activePage === key 
                  ? 'text-primary font-bold border-b-2 border-primary pb-1' 
                  : 'text-on-surface-variant font-medium hover:text-primary transition-colors duration-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-stack-md">
        <div className="hidden lg:flex items-center bg-surface-container-low rounded-lg px-stack-sm py-1 border border-white/10">
          <span className="material-symbols-outlined text-outline text-[20px]">search</span>
          <input className="bg-transparent border-none focus:ring-0 text-body-sm w-48 outline-none" placeholder="Search audits..." type="text" />
        </div>
        <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">notifications</span>
        <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">help_outline</span>
        <button 
          onClick={() => handleNavigate("audit")}
          className="bg-primary text-on-primary px-stack-md py-2 rounded-lg font-label-caps hover:opacity-90 active:scale-95 transition-all"
        >
          Connect Stack
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-white/10">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-gBFYrEwUPYH_Q66K4W6bJlk5x8JuPt8_kKtSX0HxkLpjB081tC8PXJAd0YfRM_MtFjBcfOTQHLxDpAVcfv7cSjLpMO4seTg85V5IvFhNNX6sObsBeCJXNVy5sOScHcYisKA5TgRiCg8eaowxq6t6eTRjP068Yiwv0twbQ12mPlEZaqj7Y4_zkCZE8KWyVBv_iA1PA7xMwOY51-YBdrgPUQ5b_HOjpB_0W70sKbEXMdZAOIFJGuOiB-jjoGpmlOhx_mzKgTC6F1Au" alt="User profile" className="w-full h-full object-cover" />
        </div>
      </div>
    </nav>
  );
}
