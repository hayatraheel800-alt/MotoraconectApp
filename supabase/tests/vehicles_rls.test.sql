begin;

select plan(8);

select has_table_privilege('authenticated','public.vehicles','select,insert,update,delete');
select has_table_privilege('authenticated','public.vehicle_images','select,insert,update,delete');
select (select relrowsecurity from pg_class where oid='public.vehicles'::regclass);
select (select relrowsecurity from pg_class where oid='public.vehicle_images'::regclass);
select count(*) = 4 from pg_policies where schemaname='public' and tablename='vehicles';
select count(*) = 4 from pg_policies where schemaname='public' and tablename='vehicle_images';
select exists(select 1 from storage.buckets where id='vehicle-images' and public = false);
select count(*) = 4 from pg_policies where schemaname='storage' and tablename='objects' and policyname like 'Vehicle %';

select * from finish();
rollback;
