export type EmiInput = {
  propertyPrice: number;
  downPayment: number;
  annualRate: number;
  tenureYears: number;
};

export type EmiResult = {
  loanAmount: number;
  emi: number;
  totalInterest: number;
  totalPayment: number;
};

export type RoiInput = {
  purchasePrice: number;
  appreciationRate: number;
  holdingYears: number;
  annualIncome: number;
};

export type RoiResult = {
  futureValue: number;
  totalIncome: number;
  profit: number;
  roiPercent: number;
};

export type RentalYieldInput = {
  propertyPrice: number;
  monthlyRent: number;
};

export type RentalYieldResult = {
  annualRent: number;
  yieldPercent: number;
};
