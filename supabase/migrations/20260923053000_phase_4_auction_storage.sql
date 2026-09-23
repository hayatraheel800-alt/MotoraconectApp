insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('auction-sheets','auction-sheets',false,10485760,ARRAY['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do update set public=false,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "Auction sheets owner insert" on storage.objects;
create policy "Auction sheets owner insert" on storage.objects
for insert to authenticated
with check (bucket_id='auction-sheets' and (storage.foldername(name))[1]=(select auth.uid()::text));

drop policy if exists "Auction sheets owner select" on storage.objects;
create policy "Auction sheets owner select" on storage.objects
for select to authenticated
using (bucket_id='auction-sheets' and owner_id=(select auth.uid()::text));

drop policy if exists "Auction sheets owner delete" on storage.objects;
create policy "Auction sheets owner delete" on storage.objects
for delete to authenticated
using (bucket_id='auction-sheets' and owner_id=(select auth.uid()::text));