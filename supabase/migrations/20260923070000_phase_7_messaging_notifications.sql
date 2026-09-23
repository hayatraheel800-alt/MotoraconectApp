create schema if not exists private;

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversation_participants (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique(conversation_id,user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "Conversation participants can read conversations" on public.conversations;
create policy "Conversation participants can read conversations"
on public.conversations for select to authenticated
using (exists(select 1 from public.conversation_participants cp where cp.conversation_id=id and cp.user_id=(select auth.uid())));

drop policy if exists "Users can create conversations" on public.conversations;
create policy "Users can create conversations"
on public.conversations for insert to authenticated
with check ((select auth.uid())=created_by);

drop policy if exists "Conversation creators can delete conversations" on public.conversations;
create policy "Conversation creators can delete conversations"
on public.conversations for delete to authenticated
using ((select auth.uid())=created_by);

drop policy if exists "Participants can update conversations" on public.conversations;
create policy "Participants can update conversations"
on public.conversations for update to authenticated
using (exists(select 1 from public.conversation_participants cp where cp.conversation_id=id and cp.user_id=(select auth.uid())))
with check (exists(select 1 from public.conversation_participants cp where cp.conversation_id=id and cp.user_id=(select auth.uid())));

drop policy if exists "Conversation creators can add participants" on public.conversation_participants;
create policy "Conversation creators can add participants"
on public.conversation_participants for insert to authenticated
with check (exists(select 1 from public.conversations c where c.id=conversation_id and c.created_by=(select auth.uid())));

drop policy if exists "Participants can read participants" on public.conversation_participants;
create policy "Participants can read participants"
on public.conversation_participants for select to authenticated
using (exists(select 1 from public.conversation_participants me where me.conversation_id=conversation_id and me.user_id=(select auth.uid())));

drop policy if exists "Participants can read messages" on public.messages;
create policy "Participants can read messages"
on public.messages for select to authenticated
using (exists(select 1 from public.conversation_participants cp where cp.conversation_id=messages.conversation_id and cp.user_id=(select auth.uid())));

drop policy if exists "Participants can send messages" on public.messages;
create policy "Participants can send messages"
on public.messages for insert to authenticated
with check ((select auth.uid())=sender_id and exists(select 1 from public.conversation_participants cp where cp.conversation_id=messages.conversation_id and cp.user_id=(select auth.uid())));

drop policy if exists "Senders can update own messages" on public.messages;
create policy "Senders can update own messages"
on public.messages for update to authenticated
using ((select auth.uid())=sender_id)
with check ((select auth.uid())=sender_id);

drop policy if exists "Users can read own notifications" on public.notifications;
create policy "Users can read own notifications"
on public.notifications for select to authenticated
using ((select auth.uid())=recipient_id);

drop policy if exists "Users can update own notifications" on public.notifications;
create policy "Users can update own notifications"
on public.notifications for update to authenticated
using ((select auth.uid())=recipient_id)
with check ((select auth.uid())=recipient_id);

create index if not exists conversation_participants_user_idx on public.conversation_participants(user_id,conversation_id);
create index if not exists messages_conversation_created_idx on public.messages(conversation_id,created_at);
create index if not exists notifications_recipient_created_idx on public.notifications(recipient_id,created_at desc);

create or replace function private.notify_message_recipient()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  recipient uuid;
begin
  for recipient in
    select cp.user_id
    from public.conversation_participants cp
    where cp.conversation_id = new.conversation_id
      and cp.user_id <> new.sender_id
  loop
    insert into public.notifications(recipient_id,type,title,body,data)
    values (
      recipient,
      'NEW_MESSAGE',
      'New message',
      left(new.body,120),
      jsonb_build_object('conversation_id',new.conversation_id,'message_id',new.id)
    );
  end loop;
  return new;
end;
$$;

revoke all on function private.notify_message_recipient() from public;

drop trigger if exists messages_create_notification on public.messages;
create trigger messages_create_notification
after insert on public.messages
for each row execute function private.notify_message_recipient();

create or replace function private.touch_conversation_on_message()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $
begin
  update public.conversations set updated_at=now() where id=new.conversation_id;
  return new;
end;
$;

revoke all on function private.touch_conversation_on_message() from public;

drop trigger if exists messages_touch_conversation on public.messages;
create trigger messages_touch_conversation
after insert on public.messages
for each row execute function private.touch_conversation_on_message();

do $$
begin
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='messages') then
    alter publication supabase_realtime add table public.messages;
  end if;
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='notifications') then
    alter publication supabase_realtime add table public.notifications;
  end if;
end $$;