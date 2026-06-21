import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, ArrowRight, X } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { EmptyState, LoadingState } from '../components/ui/Atoms';
import { useAppData } from '../hooks/useAppData';
import { generateId } from '../utils/storage';
import type { Goal } from '../types';

const PERCENT_OPTIONS = [10, 20, 30, 50];

export default function Goals() {
  const { data, isLoading, setGoal, clearGoal } = useAppData();
  const { calculations, goals } = data;
  const activeGoal = goals[0];
  const [selectedPercent, setSelectedPercent] = useState(20);
  const [months, setMonths] = useState(3);
  const [now] = useState(() => Date.now());

  if (isLoading) {
    return (
      <div className="px-3 sm:px-6 max-w-4xl mx-auto pt-6">
        <LoadingState label="Loading your goals…" />
      </div>
    );
  }

  if (calculations.length === 0) {
    return (
      <div className="px-3 sm:px-6 max-w-4xl mx-auto pt-6">
        <GlassCard>
          <EmptyState
            title="Calculate your footprint first"
            description="Goals are tracked against your latest calculation, so run one before setting a reduction target."
            action={
              <Link to="/calculator" className="btn-primary">
                Go to Calculator <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />
        </GlassCard>
      </div>
    );
  }

  const latest = calculations[0];

  function handleSetGoal() {
    const deadline = new Date();
    deadline.setMonth(deadline.getMonth() + months);
    const goal: Goal = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      targetReductionPercent: selectedPercent,
      baselineKg: latest.totalMonthlyKg,
      deadline: deadline.toISOString(),
    };
    setGoal(goal);
  }

  return (
    <div className="px-3 sm:px-6 max-w-4xl mx-auto pt-6 pb-8">
      <div className="mb-8">
        <span className="label-eyebrow">Stay accountable</span>
        <h1 className="text-3xl sm:text-4xl font-display font-semibold mt-2">Goal tracker</h1>
        <p className="text-ink/60 mt-2">Set a reduction target and track your progress as you log new calculations.</p>
      </div>

      {!activeGoal ? (
        <GlassCard className="space-y-6">
          <div>
            <h3 className="font-display font-semibold text-canopy mb-3">Choose a reduction target</h3>
            <div className="flex flex-wrap gap-3">
              {PERCENT_OPTIONS.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPercent(p)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-colors ${
                    selectedPercent === p
                      ? 'bg-leaf border-leaf text-canopy'
                      : 'border-canopy/15 text-ink/60 hover:border-leaf'
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-canopy mb-3">Timeframe</h3>
            <div className="flex flex-wrap gap-3">
              {[1, 3, 6, 12].map((m) => (
                <button
                  key={m}
                  onClick={() => setMonths(m)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-colors ${
                    months === m ? 'bg-sky border-sky text-white' : 'border-canopy/15 text-ink/60 hover:border-sky'
                  }`}
                >
                  {m} mo
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-leaf/10 p-4 text-sm text-ink/70">
            Target: reduce from <span className="font-mono font-semibold">{latest.totalMonthlyKg} kg</span> to{' '}
            <span className="font-mono font-semibold text-moss">
              {Math.round(latest.totalMonthlyKg * (1 - selectedPercent / 100))} kg
            </span>{' '}
            CO₂e/month within {months} month{months > 1 ? 's' : ''}.
          </div>

          <button onClick={handleSetGoal} className="btn-primary">
            <Target className="w-4 h-4" /> Set Goal
          </button>
        </GlassCard>
      ) : (
        <ActiveGoalCard goalBaseline={activeGoal} latestKg={latest.totalMonthlyKg} onClear={clearGoal} now={now} />
      )}
    </div>
  );
}

function ActiveGoalCard({
  goalBaseline,
  latestKg,
  onClear,
  now,
}: {
  goalBaseline: Goal;
  latestKg: number;
  onClear: () => void;
  now: number;
}) {
  const targetKg = goalBaseline.baselineKg * (1 - goalBaseline.targetReductionPercent / 100);
  const totalReductionNeeded = goalBaseline.baselineKg - targetKg;
  const achievedReduction = Math.max(0, goalBaseline.baselineKg - latestKg);
  const progressPercent = totalReductionNeeded > 0
    ? Math.min(100, Math.round((achievedReduction / totalReductionNeeded) * 100))
    : latestKg <= targetKg ? 100 : 0;

  const daysLeft = Math.max(0, Math.ceil((new Date(goalBaseline.deadline).getTime() - now) / 86400000));

  return (
    <GlassCard className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <span className="label-eyebrow">Active goal</span>
          <h3 className="font-display text-2xl font-semibold text-canopy mt-1">
            Reduce footprint by {goalBaseline.targetReductionPercent}%
          </h3>
        </div>
        <button onClick={onClear} className="p-2 rounded-full hover:bg-coral/10 text-ink/30 hover:text-coral" aria-label="Clear goal">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-ink/60">Progress</span>
          <span className="font-mono font-semibold text-canopy">{progressPercent}%</span>
        </div>
        <div className="h-3 rounded-full bg-canopy/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-leaf to-aqua rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-2">
        <div>
          <p className="text-xs text-ink/40">Baseline</p>
          <p className="font-mono font-semibold text-canopy">{Math.round(goalBaseline.baselineKg)} kg</p>
        </div>
        <div>
          <p className="text-xs text-ink/40">Target</p>
          <p className="font-mono font-semibold text-moss">{Math.round(targetKg)} kg</p>
        </div>
        <div>
          <p className="text-xs text-ink/40">Current</p>
          <p className="font-mono font-semibold text-sky">{Math.round(latestKg)} kg</p>
        </div>
      </div>

      <p className="text-xs text-ink/40">
        {daysLeft > 0 ? `${daysLeft} days remaining until deadline.` : 'Deadline reached — set a new goal to keep going.'}
      </p>

      {progressPercent >= 100 && (
        <div className="rounded-2xl bg-leaf/15 p-4 text-sm font-medium text-moss">
          🎉 Goal achieved! Set a new target to keep reducing your footprint.
        </div>
      )}
    </GlassCard>
  );
}
