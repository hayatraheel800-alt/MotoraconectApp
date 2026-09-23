create table if not exists public.import_calculations (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  input jsonb not null,
  result jsonb not null,
  total_pkr numeric(14,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.import_calculations enable row level security;

drop policy if exists "Import calculations owner select" on public.import_calculations;
create policy "Import calculations owner select" on public.import_calculations
for select to authenticated using ((select auth.uid()) = requester_id);

drop policy if exists "Import calculations owner insert" on public.import_calculations;
create policy "Import calculations owner insert" on public.import_calculations
for insert to authenticated with check ((select auth.uid()) = requester_id);

drop policy if exists "Import calculations owner delete" on public.import_calculations;
create policy "Import calculations owner delete" on public.import_calculations
for delete to authenticated using ((select auth.uid()) = requester_id);

create index if not exists import_calculations_requester_created_idx
on public.import_calculations(requester_id, created_at desc);

create table if not exists public.guide_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.guide_categories(id) on delete restrict,
  slug text unique not null,
  title text not null,
  summary text not null,
  body text not null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.guide_categories enable row level security;
alter table public.guides enable row level security;

drop policy if exists "Guide categories authenticated read" on public.guide_categories;
create policy "Guide categories authenticated read" on public.guide_categories
for select to authenticated using (true);

drop policy if exists "Guides authenticated read published" on public.guides;
create policy "Guides authenticated read published" on public.guides
for select to authenticated using (published = true);

insert into public.guide_categories(slug,name,description)
values
  ('import-basics','Import Basics','Core concepts for estimating landed vehicle cost.'),
  ('auction-sheets','Auction Sheets','How to understand auction-sheet fields and uncertainty.')
on conflict (slug) do nothing;

insert into public.guides(category_id,slug,title,summary,body,published)
select id,'landed-cost-estimate','How to read a landed-cost estimate','Understand the cost components shown by the Motoraconect calculator.','The estimate separates vehicle price conversion, freight, insurance, customs duty, taxes, port and clearing charges, registration, and other costs. Treat the result as an estimate, not an official customs assessment.','true'
from public.guide_categories where slug='import-basics'
on conflict (slug) do nothing;

insert into public.guides(category_id,slug,title,summary,body,published)
select id,'auction-sheet-uncertainty','How to use auction-sheet information','Separate detected information from interpretation and unverified values.','Auction-sheet reading should distinguish DETECTED, INTERPRETED, USER_PROVIDED, ESTIMATED, and UNVERIFIED values. Confirm important details against the original document or an appropriate expert before making a purchase decision.','true'
from public.guide_categories where slug='auction-sheets'
on conflict (slug) do nothing;