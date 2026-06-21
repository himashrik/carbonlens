import { NavLink } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react';
import { useState } from 'react';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/calculator', label: 'Calculator' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/goals', label: 'Goals' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <nav className="glass-card mx-3 mt-3 sm:mx-6 sm:mt-4 px-4 sm:px-6 py-3 flex items-center justify-between rounded-2xl">
        <NavLink to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <span className="w-9 h-9 rounded-xl bg-canopy flex items-center justify-center group-hover:bg-moss transition-colors">
            <Leaf className="w-5 h-5 text-leaf" />
          </span>
          <span className="font-display text-xl font-semibold text-canopy">CarbonLens</span>
        </NavLink>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive ? 'bg-canopy text-mist' : 'text-ink/70 hover:bg-canopy/5'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <NavLink to="/calculator" className="btn-primary hidden md:inline-flex text-sm !px-5 !py-2.5">
          Calculate Now
        </NavLink>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-canopy/5"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open && (
        <div className="glass-card mx-3 mt-2 sm:mx-6 p-3 rounded-2xl md:hidden flex flex-col gap-1 animate-fade-up">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-medium ${isActive ? 'bg-canopy text-mist' : 'text-ink/70'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
