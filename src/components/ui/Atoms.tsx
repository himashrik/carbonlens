import type { ReactNode } from 'react';
import { Leaf } from 'lucide-react';
import type { DifficultyLevel } from '../../types';

export function DifficultyBadge({ level }: { level: DifficultyLevel }) {
  const styles: Record<DifficultyLevel, string> = {
    easy: 'bg-leaf/15 text-moss',
    medium: 'bg-amber/20 text-amber',
    hard: 'bg-coral/15 text-coral',
  };
  const text: Record<DifficultyLevel, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold font-mono uppercase tracking-wide ${styles[level]}`}>
      {text[level]}
    </span>
  );
}

export function StatPill({ label, value, accent = 'text-canopy' }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="label-eyebrow">{label}</span>
      <span className={`font-display text-2xl font-semibold ${accent}`}>{value}</span>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-16 px-6">
      <div className="w-16 h-16 rounded-full bg-leaf/15 flex items-center justify-center">
        <Leaf className="w-7 h-7 text-moss" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-display font-semibold text-canopy">{title}</h3>
        <p className="text-ink/60 max-w-sm">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function LoadingState({ label = 'Crunching the numbers…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="w-10 h-10 rounded-full border-2 border-leaf/30 border-t-leaf animate-spin" />
      <span className="text-sm text-ink/50 font-mono">{label}</span>
    </div>
  );
}
