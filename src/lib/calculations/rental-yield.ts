import { RentalYieldInput, RentalYieldResult } from "@/types/calculator";

export function calculateRentalYield(input: RentalYieldInput): RentalYieldResult {
  if (input.propertyPrice <= 0 || input.monthlyRent <= 0) {
    return {
      annualRent: 0,
      yieldPercent: 0
    };
  }

  const annualRent = input.monthlyRent * 12;
  const yieldPercent = (annualRent / input.propertyPrice) * 100;

  return {
    annualRent,
    yieldPercent
  };
}
