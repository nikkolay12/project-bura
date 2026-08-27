-- Permanent, human-shareable identifiers for registered Club profiles.
-- Auth UUIDs stay private and remain the primary key for every relationship.

alter table public.club_profiles
  add column if not exists public_id char(7);

create or replace function public.club_assign_profile_public_id()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  candidate char(7);
  attempts integer := 0;
begin
  if new.public_id is not null then
    return new;
  end if;

  -- Serialize short-ID allocation so the existence check and insert cannot race.
  perform pg_advisory_xact_lock(375434126);
  loop
    candidate := floor(1000000 + random() * 9000000)::bigint::text::char(7);
    exit when not exists (
      select 1
      from public.club_profiles
      where public_id = candidate
    );

    attempts := attempts + 1;
    if attempts >= 20 then
      raise exception 'public_id_allocation_failed';
    end if;
  end loop;

  new.public_id := candidate;
  return new;
end;
$$;

drop trigger if exists club_assign_profile_public_id on public.club_profiles;
create trigger club_assign_profile_public_id
  before insert on public.club_profiles
  for each row execute procedure public.club_assign_profile_public_id();

do $$
declare
  profile_row record;
  candidate char(7);
  attempts integer;
begin
  perform pg_advisory_xact_lock(375434126);

  for profile_row in
    select id
    from public.club_profiles
    where public_id is null
    order by created_at, id
  loop
    attempts := 0;
    loop
      candidate := floor(1000000 + random() * 9000000)::bigint::text::char(7);
      exit when not exists (
        select 1
        from public.club_profiles
        where public_id = candidate
      );

      attempts := attempts + 1;
      if attempts >= 20 then
        raise exception 'public_id_backfill_failed';
      end if;
    end loop;

    update public.club_profiles
    set public_id = candidate
    where id = profile_row.id;
  end loop;
end;
$$;

alter table public.club_profiles
  alter column public_id set not null;

create unique index if not exists club_profiles_public_id_unique_idx
  on public.club_profiles (public_id);

alter table public.club_profiles
  add constraint club_profiles_public_id_format_check
  check (public_id ~ '^[1-9][0-9]{6}$');

create or replace function public.club_get_my_profile_public_id()
returns text
language sql
stable
security invoker
set search_path = ''
as $$
  select profile.public_id::text
  from public.club_profiles profile
  where profile.id = auth.uid()
    and not coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false);
$$;

revoke all on function public.club_assign_profile_public_id() from public, anon, authenticated;
revoke all on function public.club_get_my_profile_public_id() from public, anon;
grant execute on function public.club_get_my_profile_public_id() to authenticated;
