create table if not exists public.parts (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  part_number text,
  make text,
  model text,
  description text,
  condition text not null default 'USED'
    check (condition in ('NEW','USED','REFURBISHED','OEM','AFTERMARKET')),
  price_amount numeric(14,2) not null check (price_amount >= 0),
  currency_code text not null default 'PKR',
  stock_quantity integer not null default 1 check (stock_quantity >= 0),
  city text,
  status text not null default 'DRAFT'
    check (status in ('DRAFT','PENDING_REVIEW','ACTIVE','SOLD_OUT','EXPIRED','REJECTED','SUSPENDED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.part_images (
  id uuid primary key default gen_random_uuid(),
  part_id uuid not null references public.parts(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0,
  alt_text text,
  created_at timestamptz not null default now()
);

alter table public.parts enable row level security;
alter table public.part_images enable row level security;

drop policy if exists "Authenticated users can view active parts" on public.parts;
create policy "Authenticated users can view active parts"
on public.parts for select to authenticated
using (status='ACTIVE' or seller_id=(select auth.uid()));

drop policy if exists "Users can create own parts" on public.parts;
create policy "Users can create own parts"
on public.parts for insert to authenticated
with check ((select auth.uid())=seller_id);

drop policy if exists "Owners can edit own parts" on public.parts;
create policy "Owners can edit own parts"
on public.parts for update to authenticated
using ((select auth.uid())=seller_id and status in ('DRAFT','PENDING_REVIEW'))
with check ((select auth.uid())=seller_id);

drop policy if exists "Owners can delete draft parts" on public.parts;
create policy "Owners can delete draft parts"
on public.parts for delete to authenticated
using ((select auth.uid())=seller_id and status='DRAFT');

drop policy if exists "Users can view part images" on public.part_images;
create policy "Users can view part images"
on public.part_images for select to authenticated
using (exists(select 1 from public.parts p where p.id=part_id and (p.status='ACTIVE' or p.seller_id=(select auth.uid()))));

drop policy if exists "Owners can manage part images" on public.part_images;
create policy "Owners can manage part images"
on public.part_images for all to authenticated
using (exists(select 1 from public.parts p where p.id=part_id and p.seller_id=(select auth.uid())))
with check (exists(select 1 from public.parts p where p.id=part_id and p.seller_id=(select auth.uid())));

create index if not exists parts_status_created_idx on public.parts(status,created_at desc);
create index if not exists parts_seller_created_idx on public.parts(seller_id,created_at desc);
create index if not exists parts_search_idx on public.parts using gin (to_tsvector('simple',coalesce(title,'')||' '||coalesce(part_number,'')||' '||coalesce(make,'')||' '||coalesce(model,'')));
create index if not exists part_images_part_sort_idx on public.part_images(part_id,sort_order);