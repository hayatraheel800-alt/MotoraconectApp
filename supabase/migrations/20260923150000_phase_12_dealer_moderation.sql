drop policy if exists "Admins can view all dealers" on public.dealers;
create policy "Admins can view all dealers"
on public.dealers for select to authenticated
using ((select private.is_admin()));

drop policy if exists "Admins can moderate dealers" on public.dealers;
create policy "Admins can moderate dealers"
on public.dealers for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "Admins can view dealer inventory" on public.dealer_inventory;
create policy "Admins can view dealer inventory"
on public.dealer_inventory for select to authenticated
using ((select private.is_admin()));