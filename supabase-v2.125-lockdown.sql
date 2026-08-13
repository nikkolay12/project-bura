-- Apply together with the v2.125b deployment. v2 rooms use token-validated RPCs only.
drop policy if exists "bura rooms readable" on public.bura_rooms;
drop policy if exists "bura rooms insertable" on public.bura_rooms;
drop policy if exists "bura rooms updatable" on public.bura_rooms;
drop policy if exists "bura rooms readable by everyone" on public.bura_rooms;
drop policy if exists "bura rooms insertable by everyone" on public.bura_rooms;
drop policy if exists "bura rooms updatable by everyone" on public.bura_rooms;

drop policy if exists "legacy bura rooms readable" on public.bura_rooms;
create policy "legacy bura rooms readable"
  on public.bura_rooms for select to anon, authenticated
  using (protocol_version = 1);
drop policy if exists "legacy bura rooms insertable" on public.bura_rooms;
create policy "legacy bura rooms insertable"
  on public.bura_rooms for insert to anon, authenticated
  with check (protocol_version = 1);
drop policy if exists "legacy bura rooms updatable" on public.bura_rooms;
create policy "legacy bura rooms updatable"
  on public.bura_rooms for update to anon, authenticated
  using (protocol_version = 1) with check (protocol_version = 1);

drop policy if exists "bura room actions readable" on public.bura_room_actions;
drop policy if exists "bura room actions insertable" on public.bura_room_actions;
drop policy if exists "legacy bura actions readable" on public.bura_room_actions;
create policy "legacy bura actions readable"
  on public.bura_room_actions for select to anon, authenticated
  using (protocol_version = 1);
drop policy if exists "legacy bura actions insertable" on public.bura_room_actions;
create policy "legacy bura actions insertable"
  on public.bura_room_actions for insert to anon, authenticated
  with check (protocol_version = 1);

revoke all on public.bura_rooms from anon, authenticated;
revoke all on public.bura_room_actions from anon, authenticated;
grant select, insert, update on public.bura_rooms to anon, authenticated;
grant select, insert on public.bura_room_actions to anon, authenticated;

revoke execute on function public.broadcast_bura_action() from public, anon, authenticated;
revoke execute on function public.broadcast_bura_room() from public, anon, authenticated;

drop index if exists public.bura_rooms_code_idx;
