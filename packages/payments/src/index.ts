export type PaymentStatus="PENDING"|"PROCESSING"|"SUCCEEDED"|"FAILED"|"CANCELLED"|"REFUNDED";

export type PaymentRequest={
  paymentId:string;
  amount:number;
  currency:string;
  purpose:string;
  idempotencyKey:string;
};

export type PaymentResult={
  status:PaymentStatus;
  provider:"MOCK";
  providerReference:string;
  message:string;
};

export interface PaymentProcessor{
  process(request:PaymentRequest):Promise<PaymentResult>;
}

export class MockPaymentProcessor implements PaymentProcessor{
  async process(request:PaymentRequest):Promise<PaymentResult>{
    return {
      status:"SUCCEEDED",
      provider:"MOCK",
      providerReference:`mock_${request.paymentId}`,
      message:"MOCKED FOR DEVELOPMENT: no real payment gateway is connected."
    };
  }
}