-- Phase 14 performance hardening: FK indexes for frequent parent lookups.
create index if not exists admin_actions_actor_idx on public.admin_actions(actor_id);
create index if not exists auction_reports_vehicle_idx on public.auction_reports(vehicle_id);
create index if not exists audit_logs_actor_idx on public.audit_logs(actor_id);
create index if not exists consultation_messages_sender_idx on public.consultation_messages(sender_id);
create index if not exists consultations_vehicle_idx on public.consultations(vehicle_id);
create index if not exists conversations_created_by_idx on public.conversations(created_by);
create index if not exists conversations_vehicle_idx on public.conversations(vehicle_id);
create index if not exists guides_category_idx on public.guides(category_id);
create index if not exists import_calculations_vehicle_idx on public.import_calculations(vehicle_id);
create index if not exists messages_sender_idx on public.messages(sender_id);
create index if not exists user_roles_role_idx on public.user_roles(role_id);

-- Phase 14 performance hardening: cache auth.uid() once per policy evaluation.
drop policy if exists "Auction reports owner select" on public.auction_reports;
create policy "Auction reports owner select" on public.auction_reports
for select to authenticated using (requester_id = (select auth.uid()));

drop policy if exists "Auction reports owner insert" on public.auction_reports;
create policy "Auction reports owner insert" on public.auction_reports
for insert to authenticated with check (requester_id = (select auth.uid()));

drop policy if exists "Auction reports owner update" on public.auction_reports;
create policy "Auction reports owner update" on public.auction_reports
for update to authenticated
using (requester_id = (select auth.uid()))
with check (requester_id = (select auth.uid()));

drop policy if exists "Auction reports owner delete" on public.auction_reports;
create policy "Auction reports owner delete" on public.auction_reports
for delete to authenticated using (requester_id = (select auth.uid()));

drop policy if exists "Auction report items owner select" on public.auction_report_items;
create policy "Auction report items owner select" on public.auction_report_items
for select to authenticated using (exists (
  select 1 from public.auction_reports r
  where r.id=report_id and r.requester_id=(select auth.uid())
));

drop policy if exists "Auction report items owner insert" on public.auction_report_items;
create policy "Auction report items owner insert" on public.auction_report_items
for insert to authenticated with check (exists (
  select 1 from public.auction_reports r
  where r.id=report_id and r.requester_id=(select auth.uid())
));

drop policy if exists "Auction report items owner update" on public.auction_report_items;
create policy "Auction report items owner update" on public.auction_report_items
for update to authenticated
using (exists (
  select 1 from public.auction_reports r
  where r.id=report_id and r.requester_id=(select auth.uid())
))
with check (exists (
  select 1 from public.auction_reports r
  where r.id=report_id and r.requester_id=(select auth.uid())
));

drop policy if exists "Auction report items owner delete" on public.auction_report_items;
create policy "Auction report items owner delete" on public.auction_report_items
for delete to authenticated using (exists (
  select 1 from public.auction_reports r
  where r.id=report_id and r.requester_id=(select auth.uid())
));