// Central type definitions for the Carbon Footprint Awareness Platform

export type TransportType = 'car_petrol' | 'car_diesel' | 'car_electric' | 'bus' | 'train' | 'bike' | 'walk' | 'motorbike';

export type FoodPreference = 'meat_heavy' | 'meat_moderate' | 'vegetarian' | 'vegan';

export type WasteLevel = 'low' | 'medium' | 'high';

// Raw inputs collected from the calculator form
export interface CalculatorInputs {
  dailyTravelDistanceKm: number;
  transportType: TransportType;
  monthlyElectricityKwh: number;
  foodPreference: FoodPreference;
  dailyWaterUsageLiters: number;
  weeklyWasteKg: WasteLevel;
}

// Emissions broken down by category, in kg CO2e / month
export interface CategoryEmissions {
  transport: number;
  electricity: number;
  food: number;
  water: number;
  waste: number;
}

export type EmissionCategory = keyof CategoryEmissions;

// A single saved calculation, persisted to LocalStorage
export interface CalculationResult {
  id: string;
  date: string; // ISO timestamp
  inputs: CalculatorInputs;
  emissions: CategoryEmissions;
  totalMonthlyKg: number;
  sustainabilityScore: number; // 0–100, higher is better
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Recommendation {
  id: string;
  category: EmissionCategory;
  title: string;
  description: string;
  estimatedImpact: string; // human-readable summary
  difficulty: DifficultyLevel;
  potentialReductionKg: number; // kg CO2e / month
}

export interface Goal {
  id: string;
  createdAt: string;
  targetReductionPercent: number; // e.g. 20 = reduce footprint by 20%
  baselineKg: number; // footprint at the time the goal was set
  deadline: string; // ISO date
}

export interface AppData {
  calculations: CalculationResult[];
  goals: Goal[];
}
