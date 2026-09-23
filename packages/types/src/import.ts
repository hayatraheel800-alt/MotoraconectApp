export type ImportCalculationInput = {
  purchasePrice: number;
  purchaseCurrency: string;
  fxRateToPkr: number;
  freightPkr: number;
  insurancePkr: number;
  dutyRatePercent: number;
  taxRatePercent: number;
  portChargesPkr: number;
  clearingChargesPkr: number;
  registrationPkr: number;
  otherChargesPkr: number;
};

export type ImportCalculationResult = {
  purchasePricePkr: number;
  cifPkr: number;
  dutyPkr: number;
  taxBasePkr: number;
  taxesPkr: number;
  additionalChargesPkr: number;
  totalPkr: number;
};

export type ImportCalculationRecord = {
  id: string;
  requester_id: string;
  vehicle_id: string | null;
  input: ImportCalculationInput;
  result: ImportCalculationResult;
  total_pkr: number;
  created_at: string;
  updated_at: string;
};

export type GuideCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type Guide = {
  id: string;
  category_id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};
