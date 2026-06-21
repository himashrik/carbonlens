import type { CalculationResult, EmissionCategory } from '../types';
import { categoryScores } from './scoring';
import { getRecommendations } from './recommendations';

export interface Insights {
  bestCategory: EmissionCategory;
  bestScore: number;
  worstCategory: EmissionCategory;
  worstScore: number;
  nextAction: string;
}

const CATEGORY_LABELS: Record<EmissionCategory, string> = {
  transport: 'Transport',
  electricity: 'Electricity',
  food: 'Food',
  water: 'Water',
  waste: 'Waste',
};

export function getInsights(result: CalculationResult): Insights {
  const scores = categoryScores(result.emissions);
  const entries = Object.entries(scores) as [EmissionCategory, number][];

  const best = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
  const worst = entries.reduce((a, b) => (b[1] < a[1] ? b : a));

  const recs = getRecommendations(result);
  const topRec = recs.find((r) => r.category === worst[0]) ?? recs[0];
  const nextAction = topRec
    ? `${topRec.title} — could save ~${topRec.potentialReductionKg} kg CO₂e/month`
    : `Keep up the great work in ${CATEGORY_LABELS[best[0]]}!`;

  return {
    bestCategory: best[0],
    bestScore: best[1],
    worstCategory: worst[0],
    worstScore: worst[1],
    nextAction,
  };
}

export { CATEGORY_LABELS };
