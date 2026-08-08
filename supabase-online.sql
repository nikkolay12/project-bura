-- Online room schema for Project Bura.
-- Run this once in the Supabase SQL editor for a fresh project.
create extension if not exists pg_cron with schema pg_catalog;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

create table if not exists public.bura_rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9]{6}$'),
  host_name text not null,
  guest_name text,
  settings jsonb not null default '{}'::jsonb,
  game_state jsonb,
  status text not null default 'waiting' check (status in ('waiting', 'playing', 'finished', 'rematch_waiting', 'expired')),
  host_rematch boolean not null default false,
  guest_rematch boolean not null default false,
  rematch_deadline timestamptz,
  action_seq bigint not null default 0,
  action jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '5 minutes')
);

alter table public.bura_rooms enable row level security;

drop policy if exists "bura rooms readable" on public.bura_rooms;
create policy "bura rooms readable" on public.bura_rooms for select to anon, authenticated using (true);

drop policy if exists "bura rooms insertable" on public.bura_rooms;
create policy "bura rooms insertable" on public.bura_rooms for insert to anon, authenticated with check (true);

drop policy if exists "bura rooms updatable" on public.bura_rooms;
create policy "bura rooms updatable" on public.bura_rooms for update to anon, authenticated using (true) with check (true);

create or replace function public.set_bura_rooms_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  if new.status <> 'expired' then
    new.expires_at = now() + interval '5 minutes';
  end if;
  return new;
end;
$$;

drop trigger if exists bura_rooms_updated_at on public.bura_rooms;
create trigger bura_rooms_updated_at
before update on public.bura_rooms
for each row execute function public.set_bura_rooms_updated_at();

do $$
begin
  alter publication supabase_realtime add table public.bura_rooms;
exception when duplicate_object then null;
end $$;

create index if not exists bura_rooms_expiry_open_idx
  on public.bura_rooms (expires_at)
  where status <> 'expired';

select cron.schedule(
  'expire-inactive-bura-rooms',
  '* * * * *',
  $job$
    update public.bura_rooms
    set status = 'expired', action = null
    where status <> 'expired'
      and expires_at <= now();
  $job$
);
