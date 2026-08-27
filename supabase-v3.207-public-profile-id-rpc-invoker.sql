-- Follow-up for the originally deployed v3.207 migration: the self-read RPC
-- can rely on the existing owner-read RLS policy and needs no elevated rights.

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

revoke all on function public.club_get_my_profile_public_id() from public, anon;
grant execute on function public.club_get_my_profile_public_id() to authenticated;
