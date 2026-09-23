create table if not exists public.dealers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  business_name text not null,
  description text,
  phone text,
  email text,
  city text,
  country_code text not null default 'PK',
  website text,
  status text not null default 'PENDING_REVIEW'
    check (status in ('DRAFT','PENDING_REVIEW','ACTIVE','SUSPENDED','REJECTED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dealer_inventory (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  vehicle_id uuid not null unique references public.vehicles(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.dealers enable row level security;
alter table public.dealer_inventory enable row level security;

drop policy if exists "Users can read active dealers or own dealer" on public.dealers;
create policy "Users can read active dealers or own dealer"
on public.dealers for select to authenticated
using (status='ACTIVE' or owner_id=(select auth.uid()));

drop policy if exists "Users can create own dealer profile" on public.dealers;
create policy "Users can create own dealer profile"
on public.dealers for insert to authenticated
with check ((select auth.uid())=owner_id);

drop policy if exists "Owners can edit own dealer profile" on public.dealers;
create policy "Owners can edit own dealer profile"
on public.dealers for update to authenticated
using ((select auth.uid())=owner_id and status in ('DRAFT','PENDING_REVIEW'))
with check ((select auth.uid())=owner_id);

drop policy if exists "Owners can read own dealer inventory" on public.dealer_inventory;
create policy "Owners can read own dealer inventory"
on public.dealer_inventory for select to authenticated
using (exists(select 1 from public.dealers d where d.id=dealer_id and d.owner_id=(select auth.uid())));

drop policy if exists "Active dealer inventory is readable" on public.dealer_inventory;
create policy "Active dealer inventory is readable"
on public.dealer_inventory for select to authenticated
using (exists(select 1 from public.dealers d where d.id=dealer_id and d.status='ACTIVE'));

drop policy if exists "Owners can manage dealer inventory" on public.dealer_inventory;
create policy "Owners can manage dealer inventory"
on public.dealer_inventory for insert to authenticated
with check (exists(select 1 from public.dealers d where d.id=dealer_id and d.owner_id=(select auth.uid())));

drop policy if exists "Owners can delete dealer inventory" on public.dealer_inventory;
create policy "Owners can delete dealer inventory"
on public.dealer_inventory for delete to authenticated
using (exists(select 1 from public.dealers d where d.id=dealer_id and d.owner_id=(select auth.uid())));

create index if not exists dealers_status_created_idx on public.dealers(status,created_at desc);
create index if not exists dealers_owner_created_idx on public.dealers(owner_id,created_at desc);
create index if not exists dealer_inventory_dealer_idx on public.dealer_inventory(dealer_id,created_at desc);