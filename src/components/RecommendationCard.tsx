import { Leaf, Zap, Droplet, Trash2, Car } from 'lucide-react';
import type { Recommendation, EmissionCategory } from '../types';
import GlassCard from './ui/GlassCard';
import { DifficultyBadge } from './ui/Atoms';

const CATEGORY_ICON: Record<EmissionCategory, React.ElementType> = {
  transport: Car,
  electricity: Zap,
  food: Leaf,
  water: Droplet,
  waste: Trash2,
};

export default function RecommendationCard({ rec }: { rec: Recommendation }) {
  const Icon = CATEGORY_ICON[rec.category];
  return (
    <GlassCard className="flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300">
      <div className="flex items-start justify-between">
        <span className="w-11 h-11 rounded-2xl bg-leaf/15 flex items-center justify-center">
          <Icon className="w-5 h-5 text-moss" />
        </span>
        <DifficultyBadge level={rec.difficulty} />
      </div>
      <div className="space-y-1.5">
        <h4 className="font-display text-lg font-semibold text-canopy">{rec.title}</h4>
        <p className="text-sm text-ink/65">{rec.description}</p>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-canopy/10">
        <div>
          <p className="text-xs text-ink/40">{rec.estimatedImpact}</p>
        </div>
        <div className="text-right">
          <p className="font-mono font-semibold text-leaf-text">-{rec.potentialReductionKg} kg</p>
          <p className="text-[10px] text-ink/40 uppercase tracking-wide">CO₂e / month</p>
        </div>
      </div>
    </GlassCard>
  );
}
