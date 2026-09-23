export type PartCondition="NEW"|"USED"|"REFURBISHED"|"OEM"|"AFTERMARKET";
export type PartStatus="DRAFT"|"PENDING_REVIEW"|"ACTIVE"|"SOLD_OUT"|"EXPIRED"|"REJECTED"|"SUSPENDED";

export type Part={
  id:string;
  seller_id:string;
  title:string;
  part_number:string|null;
  make:string|null;
  model:string|null;
  description:string|null;
  condition:PartCondition;
  price_amount:number;
  currency_code:string;
  stock_quantity:number;
  city:string|null;
  status:PartStatus;
  created_at:string;
  updated_at:string;
  published_at:string|null;
};

export type PartImage={
  id:string;
  part_id:string;
  storage_path:string;
  sort_order:number;
  alt_text:string|null;
  created_at:string;
};