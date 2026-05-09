export function Footer() {
  return (
    <footer style={{ background: "#0e0e0e", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="flex flex-col md:flex-row justify-between items-center px-6 py-12 max-w-full mx-auto gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-bold text-lg" style={{ color: "#e5e2e1" }}>Audit.ai</span>
          <p style={{ color: "#908fa0", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            © 2024 Audit.ai. Secure financial precision for builders.
          </p>
        </div>
        <div className="flex gap-4">
          {["Privacy", "Security", "Terms", "API Docs"].map((link) => (
            <a key={link} href="#" style={{ color: "#908fa0", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>
              {link}
            </a>
          ))}
        </div>
        <div className="flex gap-2">
          {["share", "hub"].map((icon) => (
            <div key={icon} style={{ width: 32, height: 32, borderRadius: 4, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#e5e2e1" }}>{icon}</span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
