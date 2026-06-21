import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Database, ArrowRight } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import ScoreRing from '../components/ui/ScoreRing';
import TrendChart from '../components/charts/TrendChart';
import CategoryChart from '../components/charts/CategoryChart';
import { EmptyState, LoadingState, StatPill } from '../components/ui/Atoms';
import InsightsPanel from '../components/InsightsPanel';
import { useAppData } from '../hooks/useAppData';
import { buildMockCalculations } from '../data/mockData';

export default function Dashboard() {
  const { data, isLoading, removeCalculation, loadMock } = useAppData();
  const { calculations } = data;
  const latest = calculations[0];

  const avgScore = useMemo(() => {
    if (calculations.length === 0) return 0;
    return Math.round(calculations.reduce((s, c) => s + c.sustainabilityScore, 0) / calculations.length);
  }, [calculations]);

  if (isLoading) {
    return (
      <div className="px-3 sm:px-6 max-w-6xl mx-auto pt-6">
        <LoadingState label="Loading your dashboard…" />
      </div>
    );
  }

  if (calculations.length === 0) {
    return (
      <div className="px-3 sm:px-6 max-w-6xl mx-auto pt-6">
        <GlassCard>
          <EmptyState
            title="No calculations yet"
            description="Run your first carbon footprint calculation to unlock your dashboard, charts, and insights."
            action={
              <div className="flex gap-3 flex-wrap justify-center">
                <Link to="/calculator" className="btn-primary">
                  Calculate Now <ArrowRight className="w-4 h-4" />
                </Link>
                <button onClick={() => loadMock(buildMockCalculations())} className="btn-secondary">
                  <Database className="w-4 h-4" /> Load Sample Data
                </button>
              </div>
            }
          />
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-6 max-w-6xl mx-auto pt-6 pb-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <span className="label-eyebrow">Your overview</span>
          <h1 className="text-3xl sm:text-4xl font-display font-semibold mt-2">Dashboard</h1>
        </div>
        <Link to="/calculator" className="btn-secondary text-sm">
          New Calculation
        </Link>
      </div>

      {/* Top stat row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <GlassCard className="flex items-center justify-center">
          <ScoreRing score={latest.sustainabilityScore} size={140} />
        </GlassCard>
        <GlassCard className="flex flex-col justify-center gap-5">
          <StatPill label="Latest footprint" value={`${latest.totalMonthlyKg} kg`} accent="text-canopy" />
          <StatPill label="Average score" value={`${avgScore}/100`} accent="text-sky" />
        </GlassCard>
        <GlassCard className="sm:col-span-2 lg:col-span-2">
          <h3 className="font-display font-semibold text-canopy mb-1">Monthly trend</h3>
          <TrendChart data={calculations} />
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <GlassCard className="lg:col-span-1">
          <h3 className="font-display font-semibold text-canopy mb-1">Category distribution</h3>
          <CategoryChart emissions={latest.emissions} />
        </GlassCard>
        <div className="lg:col-span-2">
          <InsightsPanel result={latest} />
        </div>
      </div>

      {/* Recent calculations */}
      <GlassCard>
        <h3 className="font-display font-semibold text-canopy mb-4">Recent calculations</h3>
        <div className="space-y-2">
          {calculations.slice(0, 8).map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-2xl bg-white/50 px-4 py-3 hover:bg-white/80 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-ink/80">
                  {new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-xs text-ink/40">Score {c.sustainabilityScore}/100</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm font-semibold text-canopy">{c.totalMonthlyKg} kg</span>
                <button
                  onClick={() => removeCalculation(c.id)}
                  className="p-2 rounded-full hover:bg-coral/10 text-ink/30 hover:text-coral transition-colors"
                  aria-label="Delete calculation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
