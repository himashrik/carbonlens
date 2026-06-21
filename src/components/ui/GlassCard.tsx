import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}

/** The recurring glassmorphism surface used across the app. */
export default function GlassCard({ children, className = '', dark = false }: GlassCardProps) {
  return <div className={`${dark ? 'glass-card-dark' : 'glass-card'} p-6 ${className}`}>{children}</div>;
}
