export type PaymentStatus="PENDING"|"PROCESSING"|"SUCCEEDED"|"FAILED"|"CANCELLED"|"REFUNDED";

export type Payment = {
  id:string;
  payer_id:string;
  purpose:string;
  amount:number;
  currency:string;
  status:PaymentStatus;
  provider:string;
  provider_reference:string|null;
  idempotency_key:string;
  metadata:Record<string,unknown>;
  created_at:string;
  updated_at:string;
};

export type PaymentTransaction = {
  id:string;
  payment_id:string;
  transaction_type:"CREATE"|"CAPTURE"|"REFUND"|"FAILURE";
  amount:number;
  currency:string;
  provider_reference:string|null;
  metadata:Record<string,unknown>;
  created_at:string;
};

export type Subscription = {
  id:string;
  subscriber_id:string;
  plan_code:string;
  status:"INACTIVE"|"ACTIVE"|"PAUSED"|"CANCELLED";
  provider:string;
  provider_reference:string|null;
  started_at:string|null;
  current_period_end:string|null;
  created_at:string;
  updated_at:string;
};