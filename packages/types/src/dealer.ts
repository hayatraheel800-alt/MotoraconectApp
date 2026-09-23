export type DealerStatus="DRAFT"|"PENDING_REVIEW"|"ACTIVE"|"SUSPENDED"|"REJECTED";

export type Dealer={
  id:string;
  owner_id:string;
  business_name:string;
  description:string|null;
  phone:string|null;
  email:string|null;
  city:string|null;
  country_code:string;
  website:string|null;
  status:DealerStatus;
  created_at:string;
  updated_at:string;
};

export type DealerInventory={
  id:string;
  dealer_id:string;
  vehicle_id:string;
  created_at:string;
};