-- Shows the room identity only to its two authenticated-by-token participants.
-- Public lobby visitors can still see active-game names and status, but cannot join.
create or replace function public.bura_list_rooms(
  owner_token text default '',
  player_token text default ''
)
returns table (
  id uuid,
  code text,
  host_name text,
  guest_name text,
  settings jsonb,
  status text,
  created_at timestamptz,
  expires_at timestamptz,
  owned boolean
)
language sql
security definer
stable
set search_path = ''
as $$
  select
    case
      when room.status = 'waiting'
        or public.bura_room_role(room, player_token) is not null
      then room.id
      else null
    end,
    case
      when room.status = 'waiting'
        or public.bura_room_role(room, player_token) is not null
      then room.code
      else null
    end,
    room.host_name,
    room.guest_name,
    jsonb_build_object('matchTarget', coalesce((room.settings->>'matchTarget')::integer, 3)),
    room.status,
    room.created_at,
    room.expires_at,
    room.owner_token_hash = public.bura_token_hash(owner_token)
  from public.bura_rooms room
  where room.protocol_version = 2
    and room.status in ('waiting', 'playing')
    and room.expires_at > now()
  order by room.created_at desc
  limit 24;
$$;

grant execute on function public.bura_list_rooms(text, text) to anon, authenticated;
