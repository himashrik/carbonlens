import type { CalculatorInputs, CategoryEmissions } from '../types';
import {
  TRANSPORT_FACTORS,
  ELECTRICITY_FACTOR,
  FOOD_FACTORS,
  WATER_FACTOR,
  WASTE_FACTORS,
} from '../data/emissionFactors';

const DAYS_PER_MONTH = 30;
const WEEKS_PER_MONTH = 4.345;

/**
 * Converts raw calculator inputs into category-wise monthly CO2e emissions (kg).
 * All formulas normalize to a monthly figure so categories with different
 * natural units (daily travel, monthly electricity, weekly waste) are comparable.
 */
export function calculateEmissions(inputs: CalculatorInputs): CategoryEmissions {
  const transport =
    inputs.dailyTravelDistanceKm * TRANSPORT_FACTORS[inputs.transportType] * DAYS_PER_MONTH;

  const electricity = inputs.monthlyElectricityKwh * ELECTRICITY_FACTOR;

  const food = FOOD_FACTORS[inputs.foodPreference] * DAYS_PER_MONTH;

  const water = inputs.dailyWaterUsageLiters * WATER_FACTOR * DAYS_PER_MONTH;

  const waste = WASTE_FACTORS[inputs.weeklyWasteKg] * WEEKS_PER_MONTH;

  return {
    transport: round(transport),
    electricity: round(electricity),
    food: round(food),
    water: round(water),
    waste: round(waste),
  };
}

export function totalEmissions(emissions: CategoryEmissions): number {
  return round(Object.values(emissions).reduce((sum, v) => sum + v, 0));
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
