import { describe, it, expect } from 'vitest';
import { calculateEmissions, totalEmissions } from './carbonCalculator';
import type { CalculatorInputs } from '../types';

describe('carbonCalculator', () => {
  describe('calculateEmissions', () => {
    it('should correctly calculate emissions for baseline/default inputs', () => {
      const inputs: CalculatorInputs = {
        dailyTravelDistanceKm: 12,
        transportType: 'car_petrol',
        monthlyElectricityKwh: 200,
        foodPreference: 'meat_moderate',
        dailyWaterUsageLiters: 140,
        weeklyWasteKg: 'medium',
      };

      const emissions = calculateEmissions(inputs);

      // Transport: 12 km * 0.192 kg/km * 30 days = 69.12
      expect(emissions.transport).toBe(69.12);

      // Electricity: 200 kWh * 0.475 = 95
      expect(emissions.electricity).toBe(95);

      // Food: 5.63 kg/day * 30 days = 168.9
      expect(emissions.food).toBe(168.9);

      // Water: 140 liters * 0.000298 * 30 days = 1.25
      expect(emissions.water).toBe(1.25);

      // Waste: 2.6 kg/week * 4.345 weeks = 11.3
      expect(emissions.waste).toBe(11.3);
    });

    it('should result in zero transport emissions for walking and cycling', () => {
      const walkInputs: CalculatorInputs = {
        dailyTravelDistanceKm: 50,
        transportType: 'walk',
        monthlyElectricityKwh: 0,
        foodPreference: 'vegan',
        dailyWaterUsageLiters: 0,
        weeklyWasteKg: 'low',
      };

      const bikeInputs: CalculatorInputs = {
        ...walkInputs,
        transportType: 'bike',
      };

      expect(calculateEmissions(walkInputs).transport).toBe(0);
      expect(calculateEmissions(bikeInputs).transport).toBe(0);
    });

    it('should correctly handle boundary transport options (EV, diesel)', () => {
      const evInputs: CalculatorInputs = {
        dailyTravelDistanceKm: 10,
        transportType: 'car_electric',
        monthlyElectricityKwh: 0,
        foodPreference: 'vegan',
        dailyWaterUsageLiters: 0,
        weeklyWasteKg: 'low',
      };

      const dieselInputs: CalculatorInputs = {
        ...evInputs,
        transportType: 'car_diesel',
      };

      // EV: 10 * 0.053 * 30 = 15.9
      expect(calculateEmissions(evInputs).transport).toBe(15.9);
      // Diesel: 10 * 0.171 * 30 = 51.3
      expect(calculateEmissions(dieselInputs).transport).toBe(51.3);
    });
  });

  describe('totalEmissions', () => {
    it('should sum all category emissions correctly', () => {
      const emissions = {
        transport: 100,
        electricity: 150,
        food: 200,
        water: 50,
        waste: 25,
      };

      expect(totalEmissions(emissions)).toBe(525);
    });
  });
});
