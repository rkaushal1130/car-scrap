export interface ValuationParams {
  category: 'hatchback' | 'sedan' | 'suv' | 'twowheeler' | 'commercial';
  year: number;
  fuel: 'petrol' | 'diesel' | 'cng' | 'electric';
  condition: 'complete' | 'accidental' | 'junk';
}

export function calculateScrapValue({ category, condition }: ValuationParams): { min: number; max: number; co2Saved: string } {
  let baseMin = 25000;
  let baseMax = 32000;
  let co2Saved = "1.2 Tons CO2 emissions!";

  if (category === 'hatchback') {
    baseMin = 28000; baseMax = 36000; co2Saved = "1.1 Tons CO2";
  } else if (category === 'sedan') {
    baseMin = 38000; baseMax = 48000; co2Saved = "1.5 Tons CO2";
  } else if (category === 'suv') {
    baseMin = 55000; baseMax = 72000; co2Saved = "2.1 Tons CO2";
  } else if (category === 'twowheeler') {
    baseMin = 4500; baseMax = 8500; co2Saved = "0.4 Tons CO2";
  } else if (category === 'commercial') {
    baseMin = 120000; baseMax = 180000; co2Saved = "4.5 Tons CO2";
  }

  if (condition === 'accidental') {
    baseMin *= 0.85;
    baseMax *= 0.85;
  } else if (condition === 'junk') {
    baseMin *= 0.70;
    baseMax *= 0.70;
  }

  return {
    min: Math.round(baseMin),
    max: Math.round(baseMax),
    co2Saved
  };
}
