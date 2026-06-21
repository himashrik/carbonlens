// Realistic, publicly-referenced average emission factors used across the app.
// Sources (approximate, rounded for a hackathon-friendly MVP):
//  - Transport: EPA / DEFRA average passenger vehicle factors (kg CO2e per km)
//  - Electricity: global grid average ~0.475 kg CO2e per kWh (IEA)
//  - Food: Poore & Nemecek (2018) diet-level lifecycle estimates (kg CO2e per day)
//  - Water: utility treatment + heating average (kg CO2e per liter)
//  - Waste: landfill decomposition + collection average (kg CO2e per kg/week)

import type { TransportType, FoodPreference, WasteLevel } from '../types';

// kg CO2e emitted per kilometer traveled, by transport mode
export const TRANSPORT_FACTORS: Record<TransportType, number> = {
  car_petrol: 0.192,
  car_diesel: 0.171,
  car_electric: 0.053,
  motorbike: 0.103,
  bus: 0.105,
  train: 0.041,
  bike: 0,
  walk: 0,
};

export const TRANSPORT_LABELS: Record<TransportType, string> = {
  car_petrol: 'Petrol Car',
  car_diesel: 'Diesel Car',
  car_electric: 'Electric Car',
  motorbike: 'Motorbike',
  bus: 'Bus',
  train: 'Train / Metro',
  bike: 'Bicycle',
  walk: 'Walking',
};

// kg CO2e per kWh of grid electricity consumed (global average)
export const ELECTRICITY_FACTOR = 0.475;

// kg CO2e per day, by dietary pattern (lifecycle average including land-use)
export const FOOD_FACTORS: Record<FoodPreference, number> = {
  meat_heavy: 7.19,
  meat_moderate: 5.63,
  vegetarian: 3.81,
  vegan: 2.89,
};

export const FOOD_LABELS: Record<FoodPreference, string> = {
  meat_heavy: 'Meat with most meals',
  meat_moderate: 'Meat a few times a week',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
};

// kg CO2e per liter of water (treatment, pumping, heating share)
export const WATER_FACTOR = 0.000298;

// kg CO2e per kg of waste sent to landfill per week, by self-reported level
export const WASTE_FACTORS: Record<WasteLevel, number> = {
  low: 1.1, // ~5 kg/week
  medium: 2.6, // ~12 kg/week
  high: 4.8, // ~22 kg/week
};

export const WASTE_LABELS: Record<WasteLevel, string> = {
  low: 'Low (mostly recycle/compost)',
  medium: 'Medium (mixed habits)',
  high: 'High (rarely sort waste)',
};

// National average monthly footprint, for comparison context (India-skewed global blend)
export const AVERAGE_MONTHLY_FOOTPRINT_KG = 416;
