create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  avatar_url text,
  phone text,
  bio text,
  country_code text,
  city text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (name in ('USER','BUYER','SELLER','DEALER','CONSULTANT','MODERATOR','ADMIN','SUPER_ADMIN')),
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.user_roles enable row level security;

revoke all on table public.profiles, public.roles, public.user_roles from anon, authenticated;
grant select, insert, update on table public.profiles to authenticated;
grant select on table public.roles, public.user_roles to authenticated;

create policy "Users can read own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Users can insert own profile" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "Users can update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "Authenticated users can read roles" on public.roles for select to authenticated using (true);
create policy "Users can read own roles" on public.user_roles for select to authenticated using ((select auth.uid()) = user_id);

insert into public.roles (name, description) values
('USER','Default registered user'),('BUYER','Buyer capabilities'),('SELLER','Seller capabilities'),
('DEALER','Dealer capabilities'),('CONSULTANT','Consultant capabilities'),('MODERATOR','Moderation capabilities'),
('ADMIN','Administrator capabilities'),('SUPER_ADMIN','Full administrator capabilities')
on conflict (name) do nothing;

create or replace function public.handle_new_user()
returns trigger language plpgsql security invoker set search_path = public as $$
declare default_role_id uuid;
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', '')) on conflict (id) do nothing;
  select id into default_role_id from public.roles where name = 'USER' limit 1;
  if default_role_id is not null then
    insert into public.user_roles (user_id, role_id) values (new.id, default_role_id) on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();