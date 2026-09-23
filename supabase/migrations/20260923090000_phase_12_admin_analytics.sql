create table if not exists public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.profiles(id) on delete cascade,
  action_type text not null,
  entity_type text not null,
  entity_id uuid not null,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.admin_actions enable row level security;
alter table public.audit_logs enable row level security;

create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
security definer
set search_path = ''
as $$
  select exists(
    select 1
    from public.user_roles ur
    join public.roles r on r.id=ur.role_id
    where ur.user_id=(select auth.uid())
      and r.name in ('ADMIN','SUPER_ADMIN')
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

drop policy if exists "Admins can read admin actions" on public.admin_actions;
create policy "Admins can read admin actions"
on public.admin_actions for select to authenticated
using ((select private.is_admin()));

drop policy if exists "Admins can insert admin actions" on public.admin_actions;
create policy "Admins can insert admin actions"
on public.admin_actions for insert to authenticated
with check ((select private.is_admin()) and actor_id=(select auth.uid()));

drop policy if exists "Admins can read audit logs" on public.audit_logs;
create policy "Admins can read audit logs"
on public.audit_logs for select to authenticated
using ((select private.is_admin()));

drop policy if exists "Admins can insert audit logs" on public.audit_logs;
create policy "Admins can insert audit logs"
on public.audit_logs for insert to authenticated
with check ((select private.is_admin()) and actor_id=(select auth.uid()));

drop policy if exists "Admins can view all vehicles" on public.vehicles;
create policy "Admins can view all vehicles"
on public.vehicles for select to authenticated
using ((select private.is_admin()));

drop policy if exists "Admins can moderate vehicles" on public.vehicles;
create policy "Admins can moderate vehicles"
on public.vehicles for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "Admins can view consultations" on public.consultations;
create policy "Admins can view consultations"
on public.consultations for select to authenticated
using ((select private.is_admin()));

drop policy if exists "Admins can manage consultations" on public.consultations;
create policy "Admins can manage consultations"
on public.consultations for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "Admins can read profiles for operations" on public.profiles;
create policy "Admins can read profiles for operations"
on public.profiles for select to authenticated
using ((select private.is_admin()));

create index if not exists admin_actions_created_idx on public.admin_actions(created_at desc);
create index if not exists audit_logs_created_idx on public.audit_logs(created_at desc);