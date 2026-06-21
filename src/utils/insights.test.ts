import { describe, it, expect } from 'vitest';
import { getInsights } from './insights';
import type { CalculationResult } from '../types';

describe('insights', () => {
  it('should evaluate transport as the worst performing category when travel emissions are high', () => {
    const result: CalculationResult = {
      id: 'test-ins-1',
      date: new Date().toISOString(),
      inputs: {
        dailyTravelDistanceKm: 150, // very high travel
        transportType: 'car_petrol',
        monthlyElectricityKwh: 50,  // low energy
        foodPreference: 'vegan',    // low food
        dailyWaterUsageLiters: 10,  // low water
        weeklyWasteKg: 'low',       // low waste
      },
      emissions: {
        transport: 864, // 150 * 0.192 * 30
        electricity: 23.75,
        food: 86.7,
        water: 0.09,
        waste: 4.78,
      },
      totalMonthlyKg: 979.32,
      sustainabilityScore: 40,
    };

    const insights = getInsights(result);

    expect(insights.worstCategory).toBe('transport');
    expect(insights.worstScore).toBe(0); // far above poor transport threshold
    expect(insights.bestCategory).toBe('water');
    expect(insights.bestScore).toBe(100);
    expect(insights.nextAction).toContain('Switch to public transport twice a week');
  });

  it('should evaluate electricity as the worst performing category when monthly usage is very high', () => {
    const result: CalculationResult = {
      id: 'test-ins-2',
      date: new Date().toISOString(),
      inputs: {
        dailyTravelDistanceKm: 0,
        transportType: 'walk',
        monthlyElectricityKwh: 800, // very high energy
        foodPreference: 'vegan',
        dailyWaterUsageLiters: 10,
        weeklyWasteKg: 'low',
      },
      emissions: {
        transport: 0,
        electricity: 380, // 800 * 0.475
        food: 86.7,
        water: 0.09,
        waste: 4.78,
      },
      totalMonthlyKg: 471.57,
      sustainabilityScore: 55,
    };

    const insights = getInsights(result);

    expect(insights.worstCategory).toBe('electricity');
    expect(insights.worstScore).toBe(0); // far above poor electricity threshold
    expect(insights.nextAction).toContain('Explore rooftop solar or a green energy plan');
  });
});
