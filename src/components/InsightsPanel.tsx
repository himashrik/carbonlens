import { TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';
import type { CalculationResult } from '../types';
import GlassCard from './ui/GlassCard';
import { getInsights, CATEGORY_LABELS } from '../utils/insights';

export default function InsightsPanel({ result }: { result: CalculationResult }) {
  const insights = getInsights(result);

  return (
    <GlassCard className="h-full flex flex-col gap-4">
      <h3 className="font-display font-semibold text-canopy">Insights</h3>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-2xl bg-leaf/10 p-4 flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-moss mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-ink/50">Best-performing category</p>
            <p className="font-semibold text-canopy">{CATEGORY_LABELS[insights.bestCategory]}</p>
            <p className="text-xs text-moss font-mono">{insights.bestScore}/100</p>
          </div>
        </div>
        <div className="rounded-2xl bg-coral/10 p-4 flex items-start gap-3">
          <TrendingDown className="w-5 h-5 text-coral mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-ink/50">Highest-emission category</p>
            <p className="font-semibold text-canopy">{CATEGORY_LABELS[insights.worstCategory]}</p>
            <p className="text-xs text-coral font-mono">{insights.worstScore}/100</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-sky/10 p-4 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-sky mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-ink/50">Suggested next action</p>
          <p className="text-sm font-medium text-ink/80">{insights.nextAction}</p>
        </div>
      </div>
    </GlassCard>
  );
}
