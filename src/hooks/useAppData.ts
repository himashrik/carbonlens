import { useCallback, useEffect, useState } from 'react';
import type { AppData, CalculationResult, Goal } from '../types';
import { loadData, saveCalculation as persistCalculation, saveGoal as persistGoal, clearGoal as persistClearGoal, deleteCalculation as persistDelete } from '../utils/storage';

/** Central hook that keeps React state in sync with the LocalStorage-backed dataset. */
export function useAppData() {
  const [data, setData] = useState<AppData>({ calculations: [], goals: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a brief load so the loading state is demonstrably wired up
    const timer = setTimeout(() => {
      setData(loadData());
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  const addCalculation = useCallback((result: CalculationResult) => {
    setData(persistCalculation(result));
  }, []);

  const removeCalculation = useCallback((id: string) => {
    setData(persistDelete(id));
  }, []);

  const setGoal = useCallback((goal: Goal) => {
    setData(persistGoal(goal));
  }, []);

  const clearGoal = useCallback(() => {
    setData(persistClearGoal());
  }, []);

  const loadMock = useCallback((mock: CalculationResult[]) => {
    setData((prev) => {
      const merged = { ...prev, calculations: mock };
      try {
        localStorage.setItem('carbonlens_data_v1', JSON.stringify(merged));
      } catch (e) {
        console.error(e);
      }
      return merged;
    });
  }, []);

  return { data, isLoading, addCalculation, removeCalculation, setGoal, clearGoal, loadMock };
}
