export interface PricingInput {
  filamentWeightGram: number;
  filamentPricePerKg: number;
  printHours: number;
  machineWattage: number;
  electricityPricePerKwh: number;
  machinePrice: number;
  machineLifetimeHours: number;
  otherCost: number;
  commissionCost: number;
  marginPercent: number;
}

export interface PricingBreakdown {
  materialCost: number;
  electricityCost: number;
  depreciationCost: number;
  generalProductionCost: number;
  otherCost: number;
  commissionCost: number;
  totalCost: number;
  suggestedPrice: number;
}

// VND has no subunit, so every currency amount here is rounded to the nearest đồng.
export function calculatePricing(input: PricingInput): PricingBreakdown {
  const materialCost =
    (input.filamentWeightGram / 1000) * input.filamentPricePerKg;

  const electricityCost =
    (input.machineWattage / 1000) * input.printHours * input.electricityPricePerKwh;

  const depreciationPerHour =
    input.machineLifetimeHours > 0 ? input.machinePrice / input.machineLifetimeHours : 0;
  const depreciationCost = depreciationPerHour * input.printHours;

  const generalProductionCost = electricityCost + depreciationCost;

  const totalCost =
    materialCost + generalProductionCost + input.otherCost + input.commissionCost;

  const suggestedPrice = totalCost * (1 + input.marginPercent / 100);

  return {
    materialCost: Math.round(materialCost),
    electricityCost: Math.round(electricityCost),
    depreciationCost: Math.round(depreciationCost),
    generalProductionCost: Math.round(generalProductionCost),
    otherCost: Math.round(input.otherCost),
    commissionCost: Math.round(input.commissionCost),
    totalCost: Math.round(totalCost),
    suggestedPrice: Math.round(suggestedPrice),
  };
}
