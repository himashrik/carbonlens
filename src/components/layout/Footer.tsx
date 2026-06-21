import { Leaf } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="mt-24 px-3 sm:px-6 pb-6">
      <div className="glass-card-dark rounded-3xl px-6 sm:px-10 py-10 text-mist/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-leaf" />
            <span className="font-display text-lg font-semibold text-mist">CarbonLens</span>
          </div>
          <p className="text-sm text-mist/60 max-w-md">
            Built for a single-day hackathon sprint. All data stays on your device — nothing is sent to a server.
          </p>
        </div>
        <div className="mt-8 pt-6 border-t border-white/10 text-xs text-mist/40 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {CURRENT_YEAR} CarbonLens. Estimates are approximate, not a certified audit.</span>
          <span>Made with React, TypeScript &amp; Tailwind</span>
        </div>
      </div>
    </footer>
  );
}
