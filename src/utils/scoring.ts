import type { CategoryEmissions, EmissionCategory } from '../types';

/**
 * Sustainability score (0–100, higher = better).
 *
 * Each category is scored independently by comparing the user's monthly
 * emissions against an "ideal" (low-impact) and "poor" (high-impact)
 * benchmark, then linearly interpolating between 100 and 0. Category
 * scores are combined using weights that reflect how much each category
 * typically contributes to a household's footprint and how controllable
 * it is day-to-day.
 */

interface Benchmark {
  ideal: number; // kg CO2e/month that earns a 100
  poor: number; // kg CO2e/month that earns a 0
  weight: number; // contribution to overall score (weights sum to 1)
}

const BENCHMARKS: Record<EmissionCategory, Benchmark> = {
  transport: { ideal: 10, poor: 250, weight: 0.3 },
  electricity: { ideal: 40, poor: 300, weight: 0.25 },
  food: { ideal: 85, poor: 220, weight: 0.2 },
  water: { ideal: 2, poor: 15, weight: 0.15 },
  waste: { ideal: 3, poor: 25, weight: 0.1 },
};

function scoreCategory(category: EmissionCategory, valueKg: number): number {
  const { ideal, poor } = BENCHMARKS[category];
  if (valueKg <= ideal) return 100;
  if (valueKg >= poor) return 0;
  // linear interpolation between ideal (100) and poor (0)
  const ratio = (valueKg - ideal) / (poor - ideal);
  return Math.round(100 - ratio * 100);
}

export function calculateSustainabilityScore(emissions: CategoryEmissions): number {
  let weightedTotal = 0;
  (Object.keys(BENCHMARKS) as EmissionCategory[]).forEach((category) => {
    const categoryScore = scoreCategory(category, emissions[category]);
    weightedTotal += categoryScore * BENCHMARKS[category].weight;
  });
  return Math.round(weightedTotal);
}

export function categoryScores(emissions: CategoryEmissions): Record<EmissionCategory, number> {
  const result = {} as Record<EmissionCategory, number>;
  (Object.keys(BENCHMARKS) as EmissionCategory[]).forEach((category) => {
    result[category] = scoreCategory(category, emissions[category]);
  });
  return result;
}

export function scoreLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Excellent', color: 'text-leaf-text' };
  if (score >= 60) return { label: 'Good', color: 'text-aqua-text' };
  if (score >= 40) return { label: 'Fair', color: 'text-amber-text' };
  return { label: 'Needs Work', color: 'text-coral-text' };
}
