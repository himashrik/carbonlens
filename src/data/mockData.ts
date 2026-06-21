import type { CalculationResult } from '../types';
import { calculateEmissions, totalEmissions } from '../utils/carbonCalculator';
import { calculateSustainabilityScore } from '../utils/scoring';

/**
 * Generates 6 months of realistic mock calculations so the Dashboard has
 * something meaningful to chart for first-time / demo users. Not persisted
 * automatically — only used when explicitly loaded via "Load sample data".
 */
export function buildMockCalculations(): CalculationResult[] {
  const now = new Date();
  const scenarios = [
    { km: 18, transport: 'car_petrol' as const, kwh: 280, food: 'meat_heavy' as const, water: 180, waste: 'high' as const },
    { km: 16, transport: 'car_petrol' as const, kwh: 260, food: 'meat_heavy' as const, water: 170, waste: 'high' as const },
    { km: 14, transport: 'bus' as const, kwh: 230, food: 'meat_moderate' as const, water: 160, waste: 'medium' as const },
    { km: 10, transport: 'bus' as const, kwh: 210, food: 'meat_moderate' as const, water: 150, waste: 'medium' as const },
    { km: 8, transport: 'train' as const, kwh: 190, food: 'vegetarian' as const, water: 130, waste: 'medium' as const },
    { km: 6, transport: 'bike' as const, kwh: 160, food: 'vegetarian' as const, water: 110, waste: 'low' as const },
  ];

  return scenarios.map((s, idx) => {
    const inputs = {
      dailyTravelDistanceKm: s.km,
      transportType: s.transport,
      monthlyElectricityKwh: s.kwh,
      foodPreference: s.food,
      dailyWaterUsageLiters: s.water,
      weeklyWasteKg: s.waste,
    };
    const emissions = calculateEmissions(inputs);
    const total = totalEmissions(emissions);
    const date = new Date(now);
    date.setMonth(date.getMonth() - (scenarios.length - 1 - idx));

    return {
      id: `mock-${idx}`,
      date: date.toISOString(),
      inputs,
      emissions,
      totalMonthlyKg: total,
      sustainabilityScore: calculateSustainabilityScore(emissions),
    };
  });
}
