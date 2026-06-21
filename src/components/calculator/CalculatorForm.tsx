import { useState } from 'react';
import type { CalculatorInputs, TransportType, FoodPreference, WasteLevel } from '../../types';
import { TRANSPORT_LABELS, FOOD_LABELS, WASTE_LABELS } from '../../data/emissionFactors';

interface CalculatorFormProps {
  onSubmit: (inputs: CalculatorInputs) => void;
  isSubmitting?: boolean;
}

const DEFAULTS: CalculatorInputs = {
  dailyTravelDistanceKm: 12,
  transportType: 'car_petrol',
  monthlyElectricityKwh: 200,
  foodPreference: 'meat_moderate',
  dailyWaterUsageLiters: 140,
  weeklyWasteKg: 'medium',
};

type Errors = Partial<Record<keyof CalculatorInputs, string>>;

export default function CalculatorForm({ onSubmit, isSubmitting }: CalculatorFormProps) {
  const [form, setForm] = useState<CalculatorInputs>(DEFAULTS);
  const [errors, setErrors] = useState<Errors>({});

  function validate(values: CalculatorInputs): Errors {
    const next: Errors = {};
    if (values.dailyTravelDistanceKm < 0 || values.dailyTravelDistanceKm > 500)
      next.dailyTravelDistanceKm = 'Enter a distance between 0 and 500 km';
    if (values.monthlyElectricityKwh < 0 || values.monthlyElectricityKwh > 3000)
      next.monthlyElectricityKwh = 'Enter a value between 0 and 3000 kWh';
    if (values.dailyWaterUsageLiters < 0 || values.dailyWaterUsageLiters > 1000)
      next.dailyWaterUsageLiters = 'Enter a value between 0 and 1000 liters';
    return next;
  }

  function handleNumberChange(field: keyof CalculatorInputs, value: string) {
    const num = value === '' ? 0 : Number(value);
    setForm((prev) => ({ ...prev, [field]: num }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(form);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Transport section */}
      <fieldset className="space-y-4">
        <legend className="label-eyebrow mb-2">Travel</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="distance" className="block text-sm font-medium text-ink/80 mb-1.5">
              Daily travel distance (km)
            </label>
            <input
              id="distance"
              type="number"
              min={0}
              step={0.5}
              className="input-field"
              value={form.dailyTravelDistanceKm}
              onChange={(e) => handleNumberChange('dailyTravelDistanceKm', e.target.value)}
            />
            {errors.dailyTravelDistanceKm && <p className="text-xs text-coral mt-1">{errors.dailyTravelDistanceKm}</p>}
          </div>
          <div>
            <label htmlFor="transport" className="block text-sm font-medium text-ink/80 mb-1.5">
              Primary transport type
            </label>
            <select
              id="transport"
              className="input-field"
              value={form.transportType}
              onChange={(e) => setForm((prev) => ({ ...prev, transportType: e.target.value as TransportType }))}
            >
              {(Object.keys(TRANSPORT_LABELS) as TransportType[]).map((key) => (
                <option key={key} value={key}>
                  {TRANSPORT_LABELS[key]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {/* Electricity section */}
      <fieldset>
        <legend className="label-eyebrow mb-2">Energy</legend>
        <label htmlFor="electricity" className="block text-sm font-medium text-ink/80 mb-1.5">
          Monthly electricity usage (kWh)
        </label>
        <input
          id="electricity"
          type="number"
          min={0}
          className="input-field"
          value={form.monthlyElectricityKwh}
          onChange={(e) => handleNumberChange('monthlyElectricityKwh', e.target.value)}
        />
        {errors.monthlyElectricityKwh && <p className="text-xs text-coral mt-1">{errors.monthlyElectricityKwh}</p>}
        <p className="text-xs text-ink/40 mt-1">Check your latest electricity bill for an accurate figure.</p>
      </fieldset>

      {/* Food section */}
      <fieldset>
        <legend className="label-eyebrow mb-2">Food</legend>
        <label htmlFor="food" className="block text-sm font-medium text-ink/80 mb-1.5">
          Dietary preference
        </label>
        <select
          id="food"
          className="input-field"
          value={form.foodPreference}
          onChange={(e) => setForm((prev) => ({ ...prev, foodPreference: e.target.value as FoodPreference }))}
        >
          {(Object.keys(FOOD_LABELS) as FoodPreference[]).map((key) => (
            <option key={key} value={key}>
              {FOOD_LABELS[key]}
            </option>
          ))}
        </select>
      </fieldset>

      {/* Water & waste */}
      <div className="grid sm:grid-cols-2 gap-6">
        <fieldset className="space-y-4">
          <legend className="label-eyebrow mb-2">Water</legend>
          <label htmlFor="water" className="block text-sm font-medium text-ink/80 mb-1.5">
            Daily water usage (liters)
          </label>
          <input
            id="water"
            type="number"
            min={0}
            className="input-field"
            value={form.dailyWaterUsageLiters}
            onChange={(e) => handleNumberChange('dailyWaterUsageLiters', e.target.value)}
          />
          {errors.dailyWaterUsageLiters && <p className="text-xs text-coral mt-1">{errors.dailyWaterUsageLiters}</p>}
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="label-eyebrow mb-2">Waste</legend>
          <label htmlFor="waste" className="block text-sm font-medium text-ink/80 mb-1.5">
            Weekly waste generation
          </label>
          <select
            id="waste"
            className="input-field"
            value={form.weeklyWasteKg}
            onChange={(e) => setForm((prev) => ({ ...prev, weeklyWasteKg: e.target.value as WasteLevel }))}
          >
            {(Object.keys(WASTE_LABELS) as WasteLevel[]).map((key) => (
              <option key={key} value={key}>
                {WASTE_LABELS[key]}
              </option>
            ))}
          </select>
        </fieldset>
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? 'Calculating…' : 'Calculate My Footprint'}
      </button>
    </form>
  );
}
