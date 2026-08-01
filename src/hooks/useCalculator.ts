import { useState } from 'react';
import { calculateScrapValue, ValuationParams } from '../data/valuationRates';

export function useCalculator() {
  const [params, setParams] = useState<ValuationParams>({
    category: 'hatchback',
    year: 2010,
    fuel: 'petrol',
    condition: 'complete',
  });

  const [result, setResult] = useState<{ min: number; max: number; co2Saved: string } | null>(null);

  const calculate = () => {
    const res = calculateScrapValue(params);
    setResult(res);
  };

  return {
    params,
    setParams,
    result,
    calculate,
  };
}
