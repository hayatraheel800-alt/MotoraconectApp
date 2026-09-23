import type {ImportCalculationInput,ImportCalculationResult} from "@motoraconect/types";

const round=(value:number)=>Math.round((value+Number.EPSILON)*100)/100;

export function calculateImportCost(input:ImportCalculationInput):ImportCalculationResult{
  const purchasePricePkr=round(input.purchasePrice*input.fxRateToPkr);
  const cifPkr=round(purchasePricePkr+input.freightPkr+input.insurancePkr);
  const dutyPkr=round(cifPkr*(Math.max(0,input.dutyRatePercent)/100));
  const taxBasePkr=round(cifPkr+dutyPkr);
  const taxesPkr=round(taxBasePkr*(Math.max(0,input.taxRatePercent)/100));
  const additionalChargesPkr=round(
    Math.max(0,input.portChargesPkr)+
    Math.max(0,input.clearingChargesPkr)+
    Math.max(0,input.registrationPkr)+
    Math.max(0,input.otherChargesPkr)
  );
  const totalPkr=round(cifPkr+dutyPkr+taxesPkr+additionalChargesPkr);
  return {purchasePricePkr,cifPkr,dutyPkr,taxBasePkr,taxesPkr,additionalChargesPkr,totalPkr};
}
