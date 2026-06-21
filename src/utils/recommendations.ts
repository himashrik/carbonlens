import type { CalculationResult, Recommendation } from '../types';

/**
 * Builds a personalized recommendation list from the user's latest calculation.
 * Recommendations are drawn from a static library per category, then filtered
 * to only show ones relevant to the user's current habits, and sorted by
 * potential CO2 reduction (highest impact first).
 */
export function getRecommendations(result: CalculationResult): Recommendation[] {
  const { inputs, emissions } = result;
  const pool: Recommendation[] = [];

  // Transport
  if (inputs.transportType === 'car_petrol' || inputs.transportType === 'car_diesel') {
    pool.push({
      id: 'rec_transport_public',
      category: 'transport',
      title: 'Switch to public transport twice a week',
      description: 'Swapping two weekly car trips for bus or train cuts fuel use and tailpipe emissions directly.',
      estimatedImpact: 'Cuts roughly 28% of your transport emissions',
      difficulty: 'medium',
      potentialReductionKg: round(emissions.transport * 0.28),
    });
    pool.push({
      id: 'rec_transport_ev',
      category: 'transport',
      title: 'Consider an electric or hybrid vehicle',
      description: 'EVs running on an average grid emit roughly 70% less per km than petrol or diesel cars.',
      estimatedImpact: 'Could cut transport emissions by up to 70%',
      difficulty: 'hard',
      potentialReductionKg: round(emissions.transport * 0.7),
    });
  }
  if (inputs.transportType !== 'bike' && inputs.transportType !== 'walk' && inputs.dailyTravelDistanceKm <= 5) {
    pool.push({
      id: 'rec_transport_active',
      category: 'transport',
      title: 'Walk or cycle for trips under 5 km',
      description: 'Short trips are the easiest to convert to zero-emission active travel.',
      estimatedImpact: 'Removes nearly all emissions from short trips',
      difficulty: 'easy',
      potentialReductionKg: round(emissions.transport * 0.4),
    });
  }

  // Electricity
  if (inputs.monthlyElectricityKwh > 150) {
    pool.push({
      id: 'rec_electricity_efficiency',
      category: 'electricity',
      title: 'Switch to LED lighting & efficient appliances',
      description: 'LEDs use ~75% less energy than incandescent bulbs; efficient appliances compound the savings.',
      estimatedImpact: 'Reduces home electricity emissions by ~15%',
      difficulty: 'easy',
      potentialReductionKg: round(emissions.electricity * 0.15),
    });
  }
  if (inputs.monthlyElectricityKwh > 250) {
    pool.push({
      id: 'rec_electricity_solar',
      category: 'electricity',
      title: 'Explore rooftop solar or a green energy plan',
      description: 'Renewable-sourced electricity can offset most of your grid-based emissions over time.',
      estimatedImpact: 'Can cut electricity emissions by up to 60%',
      difficulty: 'hard',
      potentialReductionKg: round(emissions.electricity * 0.6),
    });
  }

  // Food
  if (inputs.foodPreference === 'meat_heavy' || inputs.foodPreference === 'meat_moderate') {
    pool.push({
      id: 'rec_food_plant',
      category: 'food',
      title: 'Add 2–3 plant-based meals per week',
      description: 'Plant-based meals have a much smaller land and emissions footprint than meat-heavy ones.',
      estimatedImpact: 'Cuts food emissions by roughly 20%',
      difficulty: 'easy',
      potentialReductionKg: round(emissions.food * 0.2),
    });
  }
  if (inputs.foodPreference === 'meat_heavy') {
    pool.push({
      id: 'rec_food_vegetarian',
      category: 'food',
      title: 'Try a fully vegetarian week once a month',
      description: 'Vegetarian diets emit roughly 47% less CO2e than meat-heavy diets on average.',
      estimatedImpact: 'Cuts food emissions by roughly 35% on those weeks',
      difficulty: 'medium',
      potentialReductionKg: round(emissions.food * 0.35),
    });
  }

  // Water
  if (inputs.dailyWaterUsageLiters > 150) {
    pool.push({
      id: 'rec_water_fixtures',
      category: 'water',
      title: 'Install low-flow showerheads and fix leaks',
      description: 'Low-flow fixtures cut household water use without sacrificing comfort.',
      estimatedImpact: 'Reduces water-related emissions by ~25%',
      difficulty: 'easy',
      potentialReductionKg: round(emissions.water * 0.25),
    });
  }
  pool.push({
    id: 'rec_water_habits',
    category: 'water',
    title: 'Shorten showers by 2 minutes',
    description: 'Less hot water means less energy spent heating and pumping it.',
    estimatedImpact: 'Saves roughly 10% of water emissions',
    difficulty: 'easy',
    potentialReductionKg: round(emissions.water * 0.1),
  });

  // Waste
  if (inputs.weeklyWasteKg !== 'low') {
    pool.push({
      id: 'rec_waste_compost',
      category: 'waste',
      title: 'Start composting food scraps',
      description: 'Composting diverts organic waste from landfill, where it would otherwise produce methane.',
      estimatedImpact: 'Cuts waste emissions by roughly 30%',
      difficulty: 'medium',
      potentialReductionKg: round(emissions.waste * 0.3),
    });
  }
  if (inputs.weeklyWasteKg === 'high') {
    pool.push({
      id: 'rec_waste_recycle',
      category: 'waste',
      title: 'Set up a simple recycling sort station',
      description: 'Separating recyclables at the source is the single biggest lever for high-waste households.',
      estimatedImpact: 'Cuts waste emissions by roughly 40%',
      difficulty: 'easy',
      potentialReductionKg: round(emissions.waste * 0.4),
    });
  }

  return pool.sort((a, b) => b.potentialReductionKg - a.potentialReductionKg).slice(0, 6);
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
