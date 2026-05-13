export function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-white/10">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center px-container-padding py-section-gap w-full">
        <div className="flex flex-col items-center md:items-start gap-stack-sm mb-stack-md md:mb-0">
          <span className="font-h3 text-h3 text-on-surface">Audit.ai</span>
          <p className="text-outline text-label-caps">© 2024 Audit.ai. Secure financial precision for builders.</p>
        </div>
        <div className="flex gap-gutter">
          <a className="text-outline font-label-caps hover:text-on-surface transition-colors" href="#">Privacy</a>
          <a className="text-outline font-label-caps hover:text-on-surface transition-colors" href="#">Security</a>
          <a className="text-outline font-label-caps hover:text-on-surface transition-colors" href="#">Terms</a>
          <a className="text-outline font-label-caps hover:text-on-surface transition-colors" href="#">API Docs</a>
        </div>
      </div>
    </footer>
  );
}
