drop policy if exists "Owners can edit own parts" on public.parts;
create policy "Owners can edit own parts"
on public.parts for update to authenticated
using ((select auth.uid())=seller_id and status in ('DRAFT','PENDING_REVIEW'))
with check ((select auth.uid())=seller_id and status in ('DRAFT','PENDING_REVIEW'));

drop policy if exists "Owners can edit own dealer profile" on public.dealers;
create policy "Owners can edit own dealer profile"
on public.dealers for update to authenticated
using ((select auth.uid())=owner_id and status in ('DRAFT','PENDING_REVIEW'))
with check ((select auth.uid())=owner_id and status in ('DRAFT','PENDING_REVIEW'));

drop policy if exists "Users can create own payments" on public.payments;
create policy "Users can create own payments"
on public.payments for insert to authenticated
with check ((select auth.uid())=payer_id and provider='MOCK' and status='PENDING');

drop policy if exists "Users can advance own mock payment" on public.payments;
create policy "Users can advance own mock payment"
on public.payments for update to authenticated
using ((select auth.uid())=payer_id and status in ('PENDING','PROCESSING'))
with check ((select auth.uid())=payer_id and provider='MOCK' and status in ('PROCESSING','SUCCEEDED','FAILED','CANCELLED','REFUNDED'));

drop policy if exists "Users can create own mock payment transactions" on public.payment_transactions;
create policy "Users can create own mock payment transactions"
on public.payment_transactions for insert to authenticated
with check (exists(select 1 from public.payments p where p.id=payment_id and p.payer_id=(select auth.uid()) and p.provider='MOCK'));