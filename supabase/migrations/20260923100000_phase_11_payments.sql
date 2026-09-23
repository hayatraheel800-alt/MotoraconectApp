create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  payer_id uuid not null references public.profiles(id) on delete cascade,
  purpose text not null,
  amount numeric(14,2) not null check (amount >= 0),
  currency text not null,
  status text not null default 'PENDING'
    check (status in ('PENDING','PROCESSING','SUCCEEDED','FAILED','CANCELLED','REFUNDED')),
  provider text not null default 'MOCK',
  provider_reference text,
  idempotency_key text not null unique,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete cascade,
  transaction_type text not null check (transaction_type in ('CREATE','CAPTURE','REFUND','FAILURE')),
  amount numeric(14,2) not null check (amount >= 0),
  currency text not null,
  provider_reference text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references public.profiles(id) on delete cascade,
  plan_code text not null,
  status text not null default 'INACTIVE'
    check (status in ('INACTIVE','ACTIVE','PAUSED','CANCELLED')),
  provider text not null default 'MOCK',
  provider_reference text,
  started_at timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payments enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "Users can read own payments" on public.payments;
create policy "Users can read own payments"
on public.payments for select to authenticated using ((select auth.uid())=payer_id);

drop policy if exists "Users can create own payments" on public.payments;
create policy "Users can create own payments"
on public.payments for insert to authenticated with check ((select auth.uid())=payer_id);

drop policy if exists "Users can read own payment transactions" on public.payment_transactions;
create policy "Users can read own payment transactions"
on public.payment_transactions for select to authenticated
using (exists(select 1 from public.payments p where p.id=payment_id and p.payer_id=(select auth.uid())));

drop policy if exists "Users can read own subscriptions" on public.subscriptions;
create policy "Users can read own subscriptions"
on public.subscriptions for select to authenticated using ((select auth.uid())=subscriber_id);

create index if not exists payments_payer_created_idx on public.payments(payer_id,created_at desc);
create index if not exists payment_transactions_payment_created_idx on public.payment_transactions(payment_id,created_at);
create index if not exists subscriptions_subscriber_idx on public.subscriptions(subscriber_id);