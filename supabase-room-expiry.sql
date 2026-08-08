-- Applied to project jchwubvlaexheequcvim on 2026-08-08.
-- Keeps an online room reconnectable for five minutes after its last update.
create extension if not exists pg_cron with schema pg_catalog;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

alter table public.bura_rooms
  add column if not exists expires_at timestamptz;

update public.bura_rooms
set expires_at = coalesce(updated_at, created_at, now()) + interval '5 minutes'
where expires_at is null;

alter table public.bura_rooms
  alter column expires_at set default (now() + interval '5 minutes'),
  alter column expires_at set not null;

alter table public.bura_rooms
  drop constraint if exists bura_rooms_status_check;

alter table public.bura_rooms
  add constraint bura_rooms_status_check
  check (status in ('waiting', 'playing', 'finished', 'rematch_waiting', 'expired'));

create index if not exists bura_rooms_expiry_open_idx
  on public.bura_rooms (expires_at)
  where status <> 'expired';

create or replace function public.set_bura_rooms_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter function public.touch_bura_rooms_updated_at() set search_path to '';

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
