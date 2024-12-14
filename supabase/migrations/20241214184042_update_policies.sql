create schema if not exists "hidden";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION hidden.is_owner_of_list(_user_id uuid, list_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $$
DECLARE
  is_exists bool;
BEGIN
  SELECT 1 INTO is_exists
   FROM public.lists l
   WHERE
    l.owner_id = _user_id
    AND
      l.id = list_id;
  RETURN is_exists;
END;
$$
;


drop policy "allow conversation owner to add lists" on "public"."conversation_lists";

drop policy "allow all to select" on "public"."conversation_lists";

drop policy "allow authenticated users to select their conversations" on "public"."conversations";

drop policy "allow users to select list they are part of" on "public"."lists";

drop policy "allow users to see messages from their lists" on "public"."messages";

drop policy "allow users to send messages in their lists" on "public"."messages";

create policy "allow users to insert lists they can see in convos they can see"
on "public"."conversation_lists"
as permissive
for insert
to authenticated
with check ((hidden.is_owner_of_list(auth.uid(), list_id) AND (conversation_id IN ( SELECT c.id
   FROM conversations c))));


create policy "allow all to select"
on "public"."conversation_lists"
as permissive
for select
to authenticated
using ((conversation_id IN ( SELECT c.id
   FROM conversations c)));


create policy "allow authenticated users to select their conversations"
on "public"."conversations"
as permissive
for select
to authenticated
using (((id IN ( SELECT cp.conversation_id
   FROM conversation_participants cp)) OR (friendship_id IN ( SELECT f.id
   FROM friends f))));


create policy "allow users to select list they are part of"
on "public"."lists"
as permissive
for select
to authenticated
using (((owner_id = ( SELECT auth.uid() AS uid)) OR (id IN ( SELECT cl.list_id
   FROM conversation_lists cl))));


create policy "allow users to see messages from their lists"
on "public"."messages"
as permissive
for select
to authenticated
using ((list_id IN ( SELECT cl.list_id
   FROM conversation_lists cl)));


create policy "allow users to send messages in their lists"
on "public"."messages"
as permissive
for insert
to authenticated
with check ((list_id IN ( SELECT cl.list_id
   FROM conversation_lists cl)));