-- Additive online protocol for v2.125b. Safe to apply while v2.124b is public.
create extension if not exists pgcrypto with schema extensions;

alter table public.bura_rooms
  add column if not exists protocol_version integer not null default 1,
  add column if not exists revision bigint not null default 0,
  add column if not exists host_token_hash text,
  add column if not exists guest_token_hash text,
  add column if not exists owner_token_hash text,
  add column if not exists channel_secret text,
  add column if not exists last_lead_at timestamptz;

alter table public.bura_room_actions
  add column if not exists client_action_id text,
  add column if not exists actor_role text,
  add column if not exists room_sequence bigint,
  add column if not exists protocol_version integer not null default 1;

create unique index if not exists bura_room_actions_idempotency_idx
  on public.bura_room_actions (room_id, kind, client_action_id)
  where client_action_id is not null;

create unique index if not exists bura_room_actions_sequence_idx
  on public.bura_room_actions (room_id, room_sequence)
  where room_sequence is not null;

create or replace function public.bura_token_hash(token text)
returns text
language sql
immutable
set search_path = ''
as $$
  select encode(extensions.digest(coalesce(token, ''), 'sha256'), 'hex');
$$;

create or replace function public.bura_server_time()
returns timestamptz
language sql
stable
set search_path = ''
as $$
  select clock_timestamp();
$$;

create or replace function public.bura_room_role(room public.bura_rooms, token text)
returns text
language sql
stable
set search_path = ''
as $$
  select case
    when room.host_token_hash = public.bura_token_hash(token) then 'host'
    when room.guest_token_hash = public.bura_token_hash(token) then 'guest'
    else null
  end;
$$;

create or replace function public.bura_private_room(room public.bura_rooms)
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'id', room.id,
    'code', room.code,
    'host_name', room.host_name,
    'guest_name', room.guest_name,
    'settings', room.settings,
    'game_state', room.game_state,
    'status', room.status,
    'host_rematch', room.host_rematch,
    'guest_rematch', room.guest_rematch,
    'rematch_deadline', room.rematch_deadline,
    'created_at', room.created_at,
    'updated_at', room.updated_at,
    'expires_at', room.expires_at,
    'protocol_version', room.protocol_version,
    'revision', room.revision,
    'channel_secret', room.channel_secret
  );
$$;

create or replace function public.bura_create_room(
  room_code text,
  player_name text,
  room_settings jsonb,
  player_token text,
  owner_token text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  created_room public.bura_rooms;
begin
  if room_code !~ '^[A-Z0-9]{6}$' or length(player_token) < 24 or length(owner_token) < 24 then
    raise exception 'invalid_room_request';
  end if;

  if (
    select count(*) from public.bura_rooms
    where status = 'waiting'
      and guest_name is null
      and protocol_version = 2
      and owner_token_hash = public.bura_token_hash(owner_token)
      and expires_at > now()
  ) >= 3 then
    raise exception 'room_limit_reached';
  end if;

  insert into public.bura_rooms (
    code, host_name, settings, status, expires_at, protocol_version,
    host_token_hash, owner_token_hash, channel_secret, last_lead_at
  ) values (
    room_code,
    left(coalesce(nullif(trim(player_name), ''), 'Player 1'), 18),
    coalesce(room_settings, '{}'::jsonb) || jsonb_build_object('protocolVersion', 2),
    'waiting',
    now() + interval '5 minutes',
    2,
    public.bura_token_hash(player_token),
    public.bura_token_hash(owner_token),
    encode(extensions.gen_random_bytes(24), 'hex'),
    now()
  ) returning * into created_room;

  return public.bura_private_room(created_room);
end;
$$;

create or replace function public.bura_list_rooms(owner_token text default '')
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
    case when room.status = 'waiting' then room.id else null end,
    case when room.status = 'waiting' then room.code else null end,
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

create or replace function public.bura_join_room(
  room_code text,
  player_name text,
  easy_play boolean,
  player_token text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  joined_room public.bura_rooms;
begin
  if length(player_token) < 24 then raise exception 'invalid_player_token'; end if;

  update public.bura_rooms room
  set guest_name = left(coalesce(nullif(trim(player_name), ''), 'Player 2'), 18),
      guest_token_hash = public.bura_token_hash(player_token),
      settings = room.settings || jsonb_build_object('guestEasyPlay', coalesce(easy_play, true)),
      expires_at = now() + interval '5 minutes',
      revision = room.revision + 1
  where room.code = upper(room_code)
    and room.protocol_version = 2
    and room.status = 'waiting'
    and room.guest_name is null
    and room.expires_at > now()
  returning room.* into joined_room;

  if joined_room.id is null then raise exception 'room_unavailable'; end if;

  update public.bura_rooms room
  set status = 'finished'
  where room.id <> joined_room.id
    and room.status = 'waiting'
    and room.guest_name is null
    and room.owner_token_hash = joined_room.owner_token_hash;

  return public.bura_private_room(joined_room);
end;
$$;

create or replace function public.bura_get_room(room_id uuid, player_token text)
returns jsonb
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  found_room public.bura_rooms;
begin
  select * into found_room
  from public.bura_rooms
  where public.bura_rooms.id = bura_get_room.room_id;
  if found_room.id is null or public.bura_room_role(found_room, player_token) is null then
    raise exception 'room_forbidden';
  end if;
  return public.bura_private_room(found_room);
end;
$$;

create or replace function public.bura_update_room(
  room_id uuid,
  player_token text,
  room_patch jsonb,
  expected_revision bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_room public.bura_rooms;
  updated_room public.bura_rooms;
begin
  select * into current_room
  from public.bura_rooms
  where public.bura_rooms.id = bura_update_room.room_id
  for update;
  if current_room.id is null or public.bura_room_role(current_room, player_token) is distinct from 'host' then
    raise exception 'room_forbidden';
  end if;
  if expected_revision is not null and current_room.revision <> expected_revision then
    raise exception 'revision_conflict';
  end if;
  if exists (
    select 1
    from jsonb_object_keys(coalesce(room_patch, '{}'::jsonb)) key
    where key not in (
      'settings', 'game_state', 'status', 'host_rematch', 'guest_rematch',
      'rematch_deadline', 'extend_lead'
    )
  ) then
    raise exception 'invalid_room_patch';
  end if;
  if room_patch ? 'status' and room_patch->>'status' not in (
    'waiting', 'playing', 'rematch_waiting', 'finished', 'expired'
  ) then
    raise exception 'invalid_room_status';
  end if;
  if room_patch ? 'game_state' and pg_column_size(room_patch->'game_state') > 32768 then
    raise exception 'payload_too_large';
  end if;

  update public.bura_rooms room set
    settings = case when room_patch ? 'settings' then room_patch->'settings' else room.settings end,
    game_state = case when room_patch ? 'game_state' then room_patch->'game_state' else room.game_state end,
    status = case when room_patch ? 'status' then room_patch->>'status' else room.status end,
    host_rematch = case when room_patch ? 'host_rematch' then (room_patch->>'host_rematch')::boolean else room.host_rematch end,
    guest_rematch = case when room_patch ? 'guest_rematch' then (room_patch->>'guest_rematch')::boolean else room.guest_rematch end,
    rematch_deadline = case when room_patch ? 'rematch_deadline' then (room_patch->>'rematch_deadline')::timestamptz else room.rematch_deadline end,
    expires_at = case when room_patch ? 'extend_lead' and (room_patch->>'extend_lead')::boolean
      then now() + interval '5 minutes' else room.expires_at end,
    last_lead_at = case when room_patch ? 'extend_lead' and (room_patch->>'extend_lead')::boolean
      then now() else room.last_lead_at end,
    revision = room.revision + 1
  where room.id = bura_update_room.room_id
  returning room.* into updated_room;

  return public.bura_private_room(updated_room);
end;
$$;

create or replace function public.bura_submit_action(
  room_id uuid,
  player_token text,
  action_kind text,
  action_payload jsonb,
  action_client_id text,
  checkpoint jsonb default null,
  extend_lead boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_room public.bura_rooms;
  actor text;
  actor_player_index integer;
  action_player_index integer;
  action_type text;
  next_room_sequence bigint;
  saved_action public.bura_room_actions;
  next_state jsonb;
begin
  select * into current_room
  from public.bura_rooms
  where public.bura_rooms.id = bura_submit_action.room_id
  for update;
  actor := public.bura_room_role(current_room, player_token);
  if actor is null then raise exception 'room_forbidden'; end if;
  actor_player_index := case
    when actor = 'host' then coalesce((current_room.settings->'assignment'->>'hostIndex')::integer, 0)
    else coalesce((current_room.settings->'assignment'->>'guestIndex')::integer, 1)
  end;
  action_player_index := coalesce((action_payload->>'playerIndex')::integer, -1);
  action_type := action_payload->>'type';
  if action_kind = 'resolved'
    and action_payload->>'type' <> 'timeout'
    and action_player_index <> actor_player_index then
    raise exception 'invalid_actor';
  end if;
  if action_type not in (
    'play', 'continue', 'claim', 'bura', 'maliutka', 'maliutka-continue',
    'offer', 'accept-offer', 'decline-offer', 'timeout'
  ) then
    raise exception 'invalid_action_type';
  end if;
  if action_type = 'play' and (
    jsonb_typeof(action_payload->'cardIds') <> 'array'
    or jsonb_array_length(action_payload->'cardIds') not between 1 and 5
    or exists (
      select 1
      from jsonb_array_elements_text(action_payload->'cardIds') card(value)
      where card.value !~ '^[csdh][6789ajqk1]$'
    )
  ) then
    raise exception 'invalid_cards';
  end if;
  if pg_column_size(action_payload) > 4096 or (checkpoint is not null and pg_column_size(checkpoint) > 32768) then
    raise exception 'payload_too_large';
  end if;
  if action_kind <> 'resolved' or length(action_client_id) < 8 then
    raise exception 'invalid_action';
  end if;

  select coalesce(max(event.room_sequence), 0) + 1 into next_room_sequence
  from public.bura_room_actions event
  where event.room_id = bura_submit_action.room_id;

  insert into public.bura_room_actions (
    room_id, kind, action, client_action_id, actor_role, room_sequence, protocol_version
  ) values (
    bura_submit_action.room_id, action_kind, action_payload, action_client_id, actor, next_room_sequence, 2
  )
  on conflict do nothing
  returning * into saved_action;

  if saved_action.id is null then
    select * into saved_action
    from public.bura_room_actions event
    where event.room_id = bura_submit_action.room_id
      and event.kind = action_kind
      and event.client_action_id = action_client_id;
  end if;

  if checkpoint is not null and actor = 'host' then
    next_state := jsonb_set(
      jsonb_set(
        jsonb_set(checkpoint, '{eventCursor}', to_jsonb(saved_action.id), true),
        '{eventSequence}', to_jsonb(saved_action.room_sequence), true
      ),
      '{revision}', to_jsonb(current_room.revision + 1), true
    );
    update public.bura_rooms room set
      game_state = next_state,
      status = case
        when next_state->>'phase' = 'gameOver' then 'finished'
        else 'playing'
      end,
      revision = room.revision + 1,
      expires_at = case when extend_lead then now() + interval '5 minutes' else room.expires_at end,
      last_lead_at = case when extend_lead then now() else room.last_lead_at end
    where room.id = bura_submit_action.room_id;
  elsif extend_lead then
    update public.bura_rooms room set
      expires_at = now() + interval '5 minutes',
      last_lead_at = now()
    where room.id = bura_submit_action.room_id;
  end if;

  return jsonb_build_object(
    'id', saved_action.id,
    'kind', saved_action.kind,
    'action', saved_action.action,
    'client_action_id', saved_action.client_action_id,
    'sequence', saved_action.room_sequence,
    'revision', (
      select room.revision
      from public.bura_rooms room
      where room.id = bura_submit_action.room_id
    )
  );
end;
$$;

drop function if exists public.bura_fetch_actions(uuid,text,bigint);
create function public.bura_fetch_actions(room_id uuid, player_token text, after_id bigint default 0)
returns table (id bigint, kind text, action jsonb, client_action_id text, sequence bigint)
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  current_room public.bura_rooms;
begin
  select * into current_room from public.bura_rooms where public.bura_rooms.id = room_id;
  if current_room.id is null or public.bura_room_role(current_room, player_token) is null then
    raise exception 'room_forbidden';
  end if;
  return query
    select event.id, event.kind, event.action, event.client_action_id, event.room_sequence
    from public.bura_room_actions event
    where event.room_id = bura_fetch_actions.room_id and event.id > after_id
    order by event.room_sequence nulls last, event.id;
end;
$$;

create or replace function public.bura_request_rematch(
  room_id uuid,
  player_token text,
  deadline timestamptz
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_room public.bura_rooms;
  actor text;
begin
  select * into current_room
  from public.bura_rooms
  where public.bura_rooms.id = bura_request_rematch.room_id
  for update;
  actor := public.bura_room_role(current_room, player_token);
  if actor is null then raise exception 'room_forbidden'; end if;
  update public.bura_rooms room set
    host_rematch = case when actor = 'host' then true else room.host_rematch end,
    guest_rematch = case when actor = 'guest' then true else room.guest_rematch end,
    status = 'rematch_waiting',
    rematch_deadline = coalesce(room.rematch_deadline, deadline),
    revision = room.revision + 1
  where room.id = bura_request_rematch.room_id
  returning * into current_room;
  return public.bura_private_room(current_room);
end;
$$;

create or replace function public.bura_cancel_room(room_id uuid, player_token text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_room public.bura_rooms;
begin
  select * into current_room
  from public.bura_rooms
  where public.bura_rooms.id = bura_cancel_room.room_id
  for update;
  if public.bura_room_role(current_room, player_token) is distinct from 'host' then raise exception 'room_forbidden'; end if;
  update public.bura_rooms
  set status = 'finished'
  where public.bura_rooms.id = bura_cancel_room.room_id and status = 'waiting';
  return found;
end;
$$;

create or replace function public.broadcast_bura_action()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare room_channel text;
begin
  select channel_secret into room_channel from public.bura_rooms where id = new.room_id;
  if room_channel is not null then
    perform realtime.send(
      jsonb_build_object(
        'id', new.id,
        'kind', new.kind,
        'action', new.action,
        'client_action_id', new.client_action_id,
        'sequence', new.room_sequence
      ),
      'action', 'bura:' || room_channel, false
    );
  end if;
  return new;
end;
$$;

drop trigger if exists broadcast_bura_action on public.bura_room_actions;
create trigger broadcast_bura_action
after insert on public.bura_room_actions
for each row execute function public.broadcast_bura_action();

create or replace function public.broadcast_bura_room()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.channel_secret is not null then
    perform realtime.send(public.bura_private_room(new), 'room', 'bura:' || new.channel_secret, false);
  end if;
  return new;
end;
$$;

drop trigger if exists broadcast_bura_room on public.bura_rooms;
create trigger broadcast_bura_room
after update on public.bura_rooms
for each row execute function public.broadcast_bura_room();

grant execute on function public.bura_create_room(text,text,jsonb,text,text) to anon, authenticated;
grant execute on function public.bura_server_time() to anon, authenticated;
grant execute on function public.bura_list_rooms(text) to anon, authenticated;
grant execute on function public.bura_join_room(text,text,boolean,text) to anon, authenticated;
grant execute on function public.bura_get_room(uuid,text) to anon, authenticated;
grant execute on function public.bura_update_room(uuid,text,jsonb,bigint) to anon, authenticated;
grant execute on function public.bura_submit_action(uuid,text,text,jsonb,text,jsonb,boolean) to anon, authenticated;
grant execute on function public.bura_fetch_actions(uuid,text,bigint) to anon, authenticated;
grant execute on function public.bura_request_rematch(uuid,text,timestamptz) to anon, authenticated;
grant execute on function public.bura_cancel_room(uuid,text) to anon, authenticated;
