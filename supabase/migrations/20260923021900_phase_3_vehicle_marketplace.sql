create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'DRAFT' check (status in ('DRAFT','PENDING_REVIEW','ACTIVE','RESERVED','SOLD','EXPIRED','REJECTED','SUSPENDED')),
  title text not null check (char_length(trim(title)) between 5 and 160),
  make text not null check (char_length(trim(make)) between 1 and 80),
  model text not null check (char_length(trim(model)) between 1 and 80),
  variant text,
  year integer not null check (year between 1886 and 2100),
  mileage_km integer check (mileage_km is null or mileage_km between 0 and 5000000),
  price_amount numeric(14,2) not null check (price_amount >= 0),
  currency_code text not null default 'PKR' check (currency_code ~ '^[A-Z]{3}$'),
  country_code text not null default 'PK' check (country_code ~ '^[A-Z]{2}$'),
  city text,
  body_type text,
  fuel_type text,
  transmission text,
  drivetrain text,
  engine_cc integer check (engine_cc is null or engine_cc between 0 and 20000),
  engine_power_kw numeric(8,2) check (engine_power_kw is null or engine_power_kw >= 0),
  registration_year integer check (registration_year is null or registration_year between 1886 and 2100),
  description text,
  vin_last6 text check (vin_last6 is null or vin_last6 ~ '^[A-HJ-NPR-Z0-9]{6}$'),
  is_negotiable boolean not null default true,
  search_document tsvector generated always as (
    to_tsvector('simple'::regconfig, coalesce(title,'') || ' ' || coalesce(make,'') || ' ' || coalesce(model,'') || ' ' || coalesce(variant,'') || ' ' || coalesce(description,''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table public.vehicle_images (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  storage_path text not null unique,
  sort_order integer not null default 0 check (sort_order between 0 and 99),
  alt_text text,
  created_at timestamptz not null default now(),
  unique (vehicle_id, sort_order)
);

create index vehicles_seller_id_idx on public.vehicles(seller_id);
create index vehicles_status_idx on public.vehicles(status);
create index vehicles_make_model_idx on public.vehicles(make, model);
create index vehicles_year_idx on public.vehicles(year);
create index vehicles_price_idx on public.vehicles(price_amount);
create index vehicles_city_idx on public.vehicles(city);
create index vehicles_search_document_idx on public.vehicles using gin(search_document);
create index vehicle_images_vehicle_id_idx on public.vehicle_images(vehicle_id);

create trigger vehicles_set_updated_at
before update on public.vehicles
for each row execute function public.set_updated_at();

alter table public.vehicles enable row level security;
alter table public.vehicle_images enable row level security;

revoke all on table public.vehicles from anon, authenticated;
revoke all on table public.vehicle_images from anon, authenticated;
grant select, insert, update, delete on table public.vehicles to authenticated;
grant select, insert, update, delete on table public.vehicle_images to authenticated;

create policy "Authenticated users can view active vehicles or own listings"
on public.vehicles for select to authenticated
using ((select auth.uid()) = seller_id or status = 'ACTIVE');

create policy "Users can create their own draft vehicles"
on public.vehicles for insert to authenticated
with check ((select auth.uid()) = seller_id and status in ('DRAFT','PENDING_REVIEW'));

create policy "Owners can edit their marketplace drafts"
on public.vehicles for update to authenticated
using ((select auth.uid()) = seller_id)
with check ((select auth.uid()) = seller_id and status in ('DRAFT','PENDING_REVIEW'));

create policy "Owners can delete their marketplace drafts"
on public.vehicles for delete to authenticated
using ((select auth.uid()) = seller_id and status in ('DRAFT','PENDING_REVIEW'));

create policy "Authenticated users can view eligible vehicle images"
on public.vehicle_images for select to authenticated
using (exists (select 1 from public.vehicles v where v.id = vehicle_images.vehicle_id and ((select auth.uid()) = v.seller_id or v.status = 'ACTIVE')));

create policy "Owners can add images to their vehicles"
on public.vehicle_images for insert to authenticated
with check (exists (select 1 from public.vehicles v where v.id = vehicle_images.vehicle_id and (select auth.uid()) = v.seller_id and v.status in ('DRAFT','PENDING_REVIEW')));

create policy "Owners can update their vehicle images"
on public.vehicle_images for update to authenticated
using (exists (select 1 from public.vehicles v where v.id = vehicle_images.vehicle_id and (select auth.uid()) = v.seller_id))
with check (exists (select 1 from public.vehicles v where v.id = vehicle_images.vehicle_id and (select auth.uid()) = v.seller_id and v.status in ('DRAFT','PENDING_REVIEW')));

create policy "Owners can delete their vehicle images"
on public.vehicle_images for delete to authenticated
using (exists (select 1 from public.vehicles v where v.id = vehicle_images.vehicle_id and (select auth.uid()) = v.seller_id));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vehicle-images','vehicle-images',false,10485760,array['image/jpeg','image/png','image/webp','image/heic'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Vehicle owners can upload listing images"
on storage.objects for insert to authenticated
with check (bucket_id = 'vehicle-images' and (storage.foldername(name))[1] is not null and exists (select 1 from public.vehicles v where v.id::text = (storage.foldername(name))[1] and v.seller_id = (select auth.uid()) and v.status in ('DRAFT','PENDING_REVIEW')));

create policy "Vehicle owners can read listing images"
on storage.objects for select to authenticated
using (bucket_id = 'vehicle-images' and exists (select 1 from public.vehicles v where v.id::text = (storage.foldername(name))[1] and (v.seller_id = (select auth.uid()) or v.status = 'ACTIVE')));

create policy "Vehicle owners can update listing images"
on storage.objects for update to authenticated
using (bucket_id = 'vehicle-images' and owner_id = (select auth.uid()::text))
with check (bucket_id = 'vehicle-images' and owner_id = (select auth.uid()::text));

create policy "Vehicle owners can delete listing images"
on storage.objects for delete to authenticated
using (bucket_id = 'vehicle-images' and owner_id = (select auth.uid()::text));
