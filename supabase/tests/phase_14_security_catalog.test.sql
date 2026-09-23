set local search_path = public, extensions;

select plan(10);

select ok((select relrowsecurity from pg_class where oid='public.auction_reports'::regclass), 'auction_reports RLS enabled');
select ok((select relrowsecurity from pg_class where oid='public.parts'::regclass), 'parts RLS enabled');
select ok((select relrowsecurity from pg_class where oid='public.dealers'::regclass), 'dealers RLS enabled');
select ok((select relrowsecurity from pg_class where oid='public.payments'::regclass), 'payments RLS enabled');
select ok((select relrowsecurity from pg_class where oid='public.consultations'::regclass), 'consultations RLS enabled');
select ok((select public from storage.buckets where id='auction-sheets') = false, 'auction-sheets private');
select ok((select public from storage.buckets where id='part-images') = false, 'part-images private');
select ok(has_function_privilege('authenticated','private.is_admin()','EXECUTE'), 'authenticated can use private admin helper');
select ok(not has_function_privilege('anon','public.rls_auto_enable()','EXECUTE'), 'anonymous cannot execute rls_auto_enable');
select ok(not has_function_privilege('authenticated','public.rls_auto_enable()','EXECUTE'), 'authenticated cannot execute rls_auto_enable');

select * from finish();
