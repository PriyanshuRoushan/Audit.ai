export function GlassCard({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-xl ${className}`}
      style={{
        background: "rgba(23,23,23,0.7)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
