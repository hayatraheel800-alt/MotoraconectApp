drop policy if exists "Admins can view all parts" on public.parts;
create policy "Admins can view all parts"
on public.parts for select to authenticated
using ((select private.is_admin()));

drop policy if exists "Admins can moderate parts" on public.parts;
create policy "Admins can moderate parts"
on public.parts for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "Admins can view part images" on public.part_images;
create policy "Admins can view part images"
on public.part_images for select to authenticated
using ((select private.is_admin()));