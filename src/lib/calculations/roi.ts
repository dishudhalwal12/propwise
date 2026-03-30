import { RoiInput, RoiResult } from "@/types/calculator";

export function calculateRoi(input: RoiInput): RoiResult {
  if (input.purchasePrice <= 0 || input.holdingYears <= 0) {
    return {
      futureValue: 0,
      totalIncome: 0,
      profit: 0,
      roiPercent: 0
    };
  }

  const futureValue =
    input.purchasePrice *
    Math.pow(1 + Math.max(input.appreciationRate, -100) / 100, input.holdingYears);
  const totalIncome = input.annualIncome * input.holdingYears;
  const profit = futureValue + totalIncome - input.purchasePrice;
  const roiPercent = (profit / input.purchasePrice) * 100;

  return {
    futureValue,
    totalIncome,
    profit,
    roiPercent
  };
}
