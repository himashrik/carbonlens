import { describe, it, expect } from 'vitest';
import { getRecommendations } from './recommendations';
import type { CalculationResult } from '../types';

describe('recommendations', () => {
  it('should generate transport-specific recommendations for petrol/diesel car users', () => {
    const result: CalculationResult = {
      id: 'test-1',
      date: new Date().toISOString(),
      inputs: {
        dailyTravelDistanceKm: 20,
        transportType: 'car_petrol',
        monthlyElectricityKwh: 100,
        foodPreference: 'vegan',
        dailyWaterUsageLiters: 100,
        weeklyWasteKg: 'low',
      },
      emissions: {
        transport: 115.2, // 20 * 0.192 * 30
        electricity: 47.5,
        food: 86.7,
        water: 0.89,
        waste: 4.78,
      },
      totalMonthlyKg: 255.07,
      sustainabilityScore: 75,
    };

    const recs = getRecommendations(result);

    // Should include EV alternative and public transport alternative
    const evRec = recs.find((r) => r.id === 'rec_transport_ev');
    const publicRec = recs.find((r) => r.id === 'rec_transport_public');

    expect(evRec).toBeDefined();
    expect(publicRec).toBeDefined();
    expect(evRec?.potentialReductionKg).toBe(80.64); // 115.2 * 0.7
  });

  it('should include solar recommendation for high electricity users', () => {
    const result: CalculationResult = {
      id: 'test-2',
      date: new Date().toISOString(),
      inputs: {
        dailyTravelDistanceKm: 0,
        transportType: 'walk',
        monthlyElectricityKwh: 300,
        foodPreference: 'vegan',
        dailyWaterUsageLiters: 100,
        weeklyWasteKg: 'low',
      },
      emissions: {
        transport: 0,
        electricity: 142.5, // 300 * 0.475
        food: 86.7,
        water: 0.89,
        waste: 4.78,
      },
      totalMonthlyKg: 234.87,
      sustainabilityScore: 82,
    };

    const recs = getRecommendations(result);

    const solarRec = recs.find((r) => r.id === 'rec_electricity_solar');
    const ledRec = recs.find((r) => r.id === 'rec_electricity_efficiency');

    expect(solarRec).toBeDefined();
    expect(ledRec).toBeDefined();
    expect(solarRec?.potentialReductionKg).toBe(85.5); // 142.5 * 0.6
  });

  it('should sort recommendations with highest reduction impact first and limit to max 6', () => {
    const result: CalculationResult = {
      id: 'test-3',
      date: new Date().toISOString(),
      inputs: {
        dailyTravelDistanceKm: 100,
        transportType: 'car_petrol',
        monthlyElectricityKwh: 400,
        foodPreference: 'meat_heavy',
        dailyWaterUsageLiters: 200,
        weeklyWasteKg: 'high',
      },
      emissions: {
        transport: 576,
        electricity: 190,
        food: 215.7,
        water: 1.79,
        waste: 20.86,
      },
      totalMonthlyKg: 1004.35,
      sustainabilityScore: 20,
    };

    const recs = getRecommendations(result);

    expect(recs.length).toBeLessThanOrEqual(6);

    // Recommendations must be sorted descending by potentialReductionKg
    for (let i = 0; i < recs.length - 1; i++) {
      expect(recs[i].potentialReductionKg).toBeGreaterThanOrEqual(recs[i + 1].potentialReductionKg);
    }
  });
});
