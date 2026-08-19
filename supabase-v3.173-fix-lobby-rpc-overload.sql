-- PostgREST does not support overloaded RPC functions. Keep the two-argument
-- signature used by the client and remove the obsolete predecessor.
drop function if exists public.bura_list_rooms(text);

notify pgrst, 'reload schema';
