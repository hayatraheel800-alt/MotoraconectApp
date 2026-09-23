begin;

select plan(11);

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

-- Authenticated owner/non-owner fixture smoke test. The transaction rolls back all fixture rows.
do $$
declare
  seller uuid := gen_random_uuid();
  other_user uuid := gen_random_uuid();
  vehicle uuid;
begin
  insert into auth.users(id,aud,role,email,encrypted_password,created_at,updated_at)
  values
    (seller,'authenticated','authenticated',seller||'@fixture.local','fixture',now(),now()),
    (other_user,'authenticated','authenticated',other_user||'@fixture.local','fixture',now(),now());

  perform set_config('request.jwt.claim.sub', seller::text, true);
  perform set_config('request.jwt.claim.role', 'authenticated', true);
  set local role authenticated;

  insert into public.vehicles(seller_id,title,make,model,year,price_amount,status)
    values (seller,'Fixture Vehicle','Toyota','Corolla',2024,1000000,'DRAFT')
    returning id into vehicle;

  if not exists(select 1 from public.vehicles where id = vehicle) then
    raise exception 'owner cannot read own draft';
  end if;

  perform set_config('request.jwt.claim.sub', other_user::text, true);
  update public.vehicles set title='Hacked Fixture' where id=vehicle;
  delete from public.vehicles where id=vehicle;

  perform set_config('request.jwt.claim.sub', seller::text, true);
  if not exists(select 1 from public.vehicles where id=vehicle and title='Fixture Vehicle' and status='DRAFT') then
    raise exception 'unauthorized update/delete altered listing';
  end if;

  perform set_config('request.jwt.claim.sub', other_user::text, true);
  if exists(select 1 from public.vehicles where id=vehicle) then
    raise exception 'other user can read private draft';
  end if;

  perform set_config('request.jwt.claim.sub', seller::text, true);
  update public.vehicles set status='PENDING_REVIEW' where id=vehicle;
  if not exists(select 1 from public.vehicles where id=vehicle and status='PENDING_REVIEW') then
    raise exception 'owner cannot submit draft';
  end if;
end $$;

select 1 as owner_can_create_and_manage_draft;
select 1 as non_owner_cannot_read_or_modify_draft;
select 1 as owner_can_submit_for_review;
