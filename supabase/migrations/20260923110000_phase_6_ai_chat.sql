create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  sender_type text not null check (sender_type in ('USER','ASSISTANT')),
  body text not null check (char_length(trim(body)) between 1 and 8000),
  mocked boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;

drop policy if exists "Users can read own AI conversations" on public.ai_conversations;
create policy "Users can read own AI conversations"
on public.ai_conversations for select to authenticated
using ((select auth.uid())=requester_id);

drop policy if exists "Users can create own AI conversations" on public.ai_conversations;
create policy "Users can create own AI conversations"
on public.ai_conversations for insert to authenticated
with check ((select auth.uid())=requester_id);

drop policy if exists "Users can update own AI conversations" on public.ai_conversations;
create policy "Users can update own AI conversations"
on public.ai_conversations for update to authenticated
using ((select auth.uid())=requester_id)
with check ((select auth.uid())=requester_id);

drop policy if exists "Users can read own AI messages" on public.ai_messages;
create policy "Users can read own AI messages"
on public.ai_messages for select to authenticated
using (exists(
  select 1 from public.ai_conversations c
  where c.id=conversation_id and c.requester_id=(select auth.uid())
));

drop policy if exists "Users can create own AI messages" on public.ai_messages;
create policy "Users can create own AI messages"
on public.ai_messages for insert to authenticated
with check (exists(
  select 1 from public.ai_conversations c
  where c.id=conversation_id and c.requester_id=(select auth.uid())
));

create index if not exists ai_conversations_requester_created_idx
on public.ai_conversations(requester_id,created_at desc);

create index if not exists ai_messages_conversation_created_idx
on public.ai_messages(conversation_id,created_at);

do $$
begin
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='ai_messages') then
    alter publication supabase_realtime add table public.ai_messages;
  end if;
end $$;