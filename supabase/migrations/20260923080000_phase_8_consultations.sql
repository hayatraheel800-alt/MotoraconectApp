create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  consultant_id uuid references public.profiles(id) on delete set null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  service_type text not null,
  subject text not null,
  details text not null,
  status text not null default 'REQUESTED'
    check (status in ('REQUESTED','ACCEPTED','SCHEDULED','IN_PROGRESS','COMPLETED','CANCELLED')),
  scheduled_for timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.consultation_messages (
  id uuid primary key default gen_random_uuid(),
  consultation_id uuid not null references public.consultations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.consultations enable row level security;
alter table public.consultation_messages enable row level security;

drop policy if exists "Consultation requester or consultant can read" on public.consultations;
create policy "Consultation requester or consultant can read"
on public.consultations for select to authenticated
using ((select auth.uid())=requester_id or (select auth.uid())=consultant_id);

drop policy if exists "Users can request consultation" on public.consultations;
create policy "Users can request consultation"
on public.consultations for insert to authenticated
with check ((select auth.uid())=requester_id);

drop policy if exists "Participants can update consultation" on public.consultations;
drop policy if exists "Assigned consultants can update consultation" on public.consultations;
create policy "Assigned consultants can update consultation"
on public.consultations for update to authenticated
using ((select auth.uid())=consultant_id)
with check ((select auth.uid())=consultant_id);

drop policy if exists "Participants can read consultation messages" on public.consultation_messages;
create policy "Participants can read consultation messages"
on public.consultation_messages for select to authenticated
using (exists(
  select 1 from public.consultations c
  where c.id=consultation_id
    and ((select auth.uid())=c.requester_id or (select auth.uid())=c.consultant_id)
));

drop policy if exists "Participants can send consultation messages" on public.consultation_messages;
create policy "Participants can send consultation messages"
on public.consultation_messages for insert to authenticated
with check (
  (select auth.uid())=sender_id
  and exists(
    select 1 from public.consultations c
    where c.id=consultation_id
      and ((select auth.uid())=c.requester_id or (select auth.uid())=c.consultant_id)
  )
);

drop policy if exists "Senders can update own consultation messages" on public.consultation_messages;
create policy "Senders can update own consultation messages"
on public.consultation_messages for update to authenticated
using ((select auth.uid())=sender_id)
with check ((select auth.uid())=sender_id);

create index if not exists consultations_requester_created_idx
on public.consultations(requester_id,created_at desc);

create index if not exists consultations_consultant_created_idx
on public.consultations(consultant_id,created_at desc);

create index if not exists consultation_messages_consultation_created_idx
on public.consultation_messages(consultation_id,created_at);

create or replace function private.touch_consultation_on_message()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  update public.consultations set updated_at=now() where id=new.consultation_id;
  return new;
end;
$$;

revoke all on function private.touch_consultation_on_message() from public;

drop trigger if exists consultation_messages_touch on public.consultation_messages;
create trigger consultation_messages_touch
after insert on public.consultation_messages
for each row execute function private.touch_consultation_on_message();

do $$
begin
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='consultation_messages') then
    alter publication supabase_realtime add table public.consultation_messages;
  end if;
end $$;