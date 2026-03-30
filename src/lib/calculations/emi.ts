import { EmiInput, EmiResult } from "@/types/calculator";

export function calculateEmi(input: EmiInput): EmiResult {
  const loanAmount = Math.max(input.propertyPrice - input.downPayment, 0);
  const monthlyRate = input.annualRate / 12 / 100;
  const installments = input.tenureYears * 12;

  if (loanAmount <= 0 || monthlyRate <= 0 || installments <= 0) {
    return {
      loanAmount,
      emi: 0,
      totalInterest: 0,
      totalPayment: 0
    };
  }

  const emi =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, installments)) /
    (Math.pow(1 + monthlyRate, installments) - 1);
  const totalPayment = emi * installments;
  const totalInterest = totalPayment - loanAmount;

  return {
    loanAmount,
    emi,
    totalInterest,
    totalPayment
  };
}
