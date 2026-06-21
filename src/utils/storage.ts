import type { AppData, CalculationResult, Goal } from '../types';

const STORAGE_KEY = 'carbonlens_data_v1';

const EMPTY_DATA: AppData = { calculations: [], goals: [] };

/** Reads the full app dataset from LocalStorage, falling back to an empty shape. */
export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_DATA;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return EMPTY_DATA;

    const rawCalculations = Array.isArray(parsed.calculations) ? parsed.calculations : [];
    const rawGoals = Array.isArray(parsed.goals) ? parsed.goals : [];

    const calculations: CalculationResult[] = rawCalculations.filter((c: unknown): c is CalculationResult => {
      if (!c || typeof c !== 'object') return false;
      const item = c as Record<string, unknown>;
      const inputs = item.inputs as Record<string, unknown> | undefined;
      const emissions = item.emissions as Record<string, unknown> | undefined;

      return (
        typeof item.id === 'string' &&
        typeof item.date === 'string' &&
        !!inputs &&
        typeof inputs === 'object' &&
        typeof inputs.dailyTravelDistanceKm === 'number' &&
        typeof inputs.transportType === 'string' &&
        typeof inputs.monthlyElectricityKwh === 'number' &&
        typeof inputs.foodPreference === 'string' &&
        typeof inputs.dailyWaterUsageLiters === 'number' &&
        typeof inputs.weeklyWasteKg === 'string' &&
        !!emissions &&
        typeof emissions === 'object' &&
        typeof emissions.transport === 'number' &&
        typeof emissions.electricity === 'number' &&
        typeof emissions.food === 'number' &&
        typeof emissions.water === 'number' &&
        typeof emissions.waste === 'number' &&
        typeof item.totalMonthlyKg === 'number' &&
        typeof item.sustainabilityScore === 'number'
      );
    });

    const goals: Goal[] = rawGoals.filter((g: unknown): g is Goal => {
      if (!g || typeof g !== 'object') return false;
      const item = g as Record<string, unknown>;
      return (
        typeof item.id === 'string' &&
        typeof item.createdAt === 'string' &&
        typeof item.targetReductionPercent === 'number' &&
        typeof item.baselineKg === 'number' &&
        typeof item.deadline === 'string'
      );
    });

    return { calculations, goals };
  } catch (error) {
    console.error('Failed to read CarbonLens data from LocalStorage:', error);
    return EMPTY_DATA;
  }
}

function persist(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save CarbonLens data to LocalStorage:', error);
  }
}

export function saveCalculation(result: CalculationResult): AppData {
  const data = loadData();
  const updated: AppData = { ...data, calculations: [result, ...data.calculations].slice(0, 50) };
  persist(updated);
  return updated;
}

export function deleteCalculation(id: string): AppData {
  const data = loadData();
  const updated: AppData = { ...data, calculations: data.calculations.filter((c) => c.id !== id) };
  persist(updated);
  return updated;
}

export function saveGoal(goal: Goal): AppData {
  const data = loadData();
  // only one active goal at a time for simplicity
  const updated: AppData = { ...data, goals: [goal] };
  persist(updated);
  return updated;
}

export function clearGoal(): AppData {
  const data = loadData();
  const updated: AppData = { ...data, goals: [] };
  persist(updated);
  return updated;
}

export function clearAllData(): AppData {
  persist(EMPTY_DATA);
  return EMPTY_DATA;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
