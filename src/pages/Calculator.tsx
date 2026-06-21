import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RotateCcw } from 'lucide-react';
import CalculatorForm from '../components/calculator/CalculatorForm';
import GlassCard from '../components/ui/GlassCard';
import ScoreRing from '../components/ui/ScoreRing';
import RecommendationCard from '../components/RecommendationCard';
import CategoryChart from '../components/charts/CategoryChart';
import { LoadingState } from '../components/ui/Atoms';
import type { CalculationResult, CalculatorInputs } from '../types';
import { calculateEmissions, totalEmissions } from '../utils/carbonCalculator';
import { calculateSustainabilityScore, scoreLabel } from '../utils/scoring';
import { getRecommendations } from '../utils/recommendations';
import { generateId } from '../utils/storage';
import { useAppData } from '../hooks/useAppData';
import { AVERAGE_MONTHLY_FOOTPRINT_KG } from '../data/emissionFactors';

export default function Calculator() {
  const { addCalculation } = useAppData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);

  function handleSubmit(inputs: CalculatorInputs) {
    setIsSubmitting(true);
    // brief artificial delay so the loading state is visible and feels intentional
    setTimeout(() => {
      const emissions = calculateEmissions(inputs);
      const total = totalEmissions(emissions);
      const score = calculateSustainabilityScore(emissions);
      const newResult: CalculationResult = {
        id: generateId(),
        date: new Date().toISOString(),
        inputs,
        emissions,
        totalMonthlyKg: total,
        sustainabilityScore: score,
      };
      addCalculation(newResult);
      setResult(newResult);
      setIsSubmitting(false);
    }, 500);
  }

  const comparison = result ? Math.round(((result.totalMonthlyKg - AVERAGE_MONTHLY_FOOTPRINT_KG) / AVERAGE_MONTHLY_FOOTPRINT_KG) * 100) : 0;

  const recommendations = useMemo(() => {
    return result ? getRecommendations(result) : [];
  }, [result]);

  return (
    <div className="px-3 sm:px-6 max-w-6xl mx-auto pt-6">
      <div className="mb-8 max-w-xl">
        <span className="label-eyebrow">Step 1</span>
        <h1 className="text-3xl sm:text-4xl font-display font-semibold mt-2">Calculate your carbon footprint</h1>
        <p className="text-ink/60 mt-2">Answer a few questions about your everyday habits — we'll do the math.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <GlassCard className="lg:col-span-3">
          <CalculatorForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </GlassCard>

        <div className="lg:col-span-2 space-y-6">
          {isSubmitting && (
            <GlassCard>
              <LoadingState label="Calculating your footprint…" />
            </GlassCard>
          )}

          {!isSubmitting && !result && (
            <GlassCard className="flex flex-col items-center text-center gap-3 py-12">
              <span className="label-eyebrow">Your results</span>
              <p className="text-ink/50 text-sm max-w-[220px]">
                Fill in the form and submit to see your Eco Score and category breakdown here.
              </p>
            </GlassCard>
          )}

          {!isSubmitting && result && (
            <>
              <GlassCard className="flex flex-col items-center gap-4 animate-fade-up">
                <ScoreRing score={result.sustainabilityScore} />
                <div className="text-center">
                  <p className={`font-semibold ${scoreLabel(result.sustainabilityScore).color}`}>
                    {scoreLabel(result.sustainabilityScore).label}
                  </p>
                  <p className="font-mono text-2xl font-semibold text-canopy mt-1">{result.totalMonthlyKg} kg CO₂e</p>
                  <p className="text-xs text-ink/50">estimated per month</p>
                  <p className={`text-xs mt-2 font-medium ${comparison <= 0 ? 'text-leaf-text' : 'text-coral-text'}`}>
                    {comparison <= 0 ? `${Math.abs(comparison)}% below` : `${comparison}% above`} the average footprint
                  </p>
                </div>
              </GlassCard>

              <GlassCard className="animate-fade-up">
                <h3 className="font-display font-semibold text-canopy mb-2">Category breakdown</h3>
                <CategoryChart emissions={result.emissions} />
              </GlassCard>

              <Link to="/dashboard" className="btn-secondary w-full">
                View Full Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>

      {!isSubmitting && result && (
        <section className="mt-12 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-display font-semibold text-canopy">Recommended for you</h2>
            <button
              onClick={() => setResult(null)}
              className="text-sm text-ink/50 hover:text-sky flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Recalculate
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
