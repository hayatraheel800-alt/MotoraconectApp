create extension if not exists pgcrypto;\n\ncreate table if not exists public.auction_reports (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  vehicle_id uuid null references public.vehicles(id) on delete set null,
  document_path text not null,
  document_name text not null,
  status text not null default 'UPLOADED' check (status in ('UPLOADED','ANALYZING','READY','FAILED')),
  summary text,
  result jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.auction_report_items (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.auction_reports(id) on delete cascade,
  field_name text not null,
  value_text text,
  source text not null check (source in ('DETECTED','INTERPRETED','USER_PROVIDED','ESTIMATED','UNVERIFIED')),
  confidence text not null check (confidence in ('HIGH','MEDIUM','LOW')),
  note text,
  created_at timestamptz not null default now()
);
alter table public.auction_reports enable row level security;
alter table public.auction_report_items enable row level security;
create policy "Auction reports owner select" on public.auction_reports for select to authenticated using (requester_id = auth.uid());
create policy "Auction reports owner insert" on public.auction_reports for insert to authenticated with check (requester_id = auth.uid());
create policy "Auction reports owner update" on public.auction_reports for update to authenticated using (requester_id = auth.uid()) with check (requester_id = auth.uid());
create policy "Auction reports owner delete" on public.auction_reports for delete to authenticated using (requester_id = auth.uid());
create policy "Auction report items owner select" on public.auction_report_items for select to authenticated using (exists (select 1 from public.auction_reports r where r.id = report_id and r.requester_id = auth.uid()));
create policy "Auction report items owner insert" on public.auction_report_items for insert to authenticated with check (exists (select 1 from public.auction_reports r where r.id = report_id and r.requester_id = auth.uid()));
create policy "Auction report items owner update" on public.auction_report_items for update to authenticated using (exists (select 1 from public.auction_reports r where r.id = report_id and r.requester_id = auth.uid())) with check (exists (select 1 from public.auction_reports r where r.id = report_id and r.requester_id = auth.uid()));
create policy "Auction report items owner delete" on public.auction_report_items for delete to authenticated using (exists (select 1 from public.auction_reports r where r.id = report_id and r.requester_id = auth.uid()));
create index if not exists auction_reports_requester_idx on public.auction_reports(requester_id, created_at desc);
create index if not exists auction_report_items_report_idx on public.auction_report_items(report_id);
\n