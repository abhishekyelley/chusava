set check_function_bodies = off;

CREATE OR REPLACE FUNCTION hidden.is_participant(_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $$
DECLARE
  is_exists bool;
BEGIN
  SELECT 1 INTO is_exists
   FROM public.conversation_participants cp
   WHERE
      cp.conversation_id IN (SELECT cp2.conversation_id FROM public.conversation_participants cp2 WHERE cp2.user_id = _user_id);
  RETURN is_exists;
END;
$$
;


drop policy "allow authenticated users to select conversations they are part" on "public"."conversation_participants";

drop function if exists public.get_conversations ();

drop type "public"."conversation_with_user";

alter table "public"."conversations" add column "group_name" text;

alter table "public"."conversations" add constraint "name_required" CHECK ((((type = 'group'::conversation_type) AND (group_name IS NOT NULL)) OR ((type = 'friend'::conversation_type) AND (group_name IS NULL)))) not valid;

alter table "public"."conversations" validate constraint "name_required";

set check_function_bodies = off;

create type "public"."conversation_with_user" as ("conversation_id" uuid, "conversation_type" conversation_type, "conversation_created_at" timestamp with time zone, "friendship_id" uuid, "group_name" text, "user_id" uuid, "first_name" text, "last_name" text, "username" text, "bio" text, "urls" text[]);

CREATE OR REPLACE FUNCTION public.get_conversations()
 RETURNS SETOF conversation_with_user
 LANGUAGE plpgsql
 SET search_path TO ''
AS $$
begin
  return query
  SELECT
    c.id as conversation_id,
    c.type as conversation_type,
    c.created_at as conversation_created_at,
    c.friendship_id as friendship_id,
    c.group_name as group_name,
    u.id as user_id,
    u.first_name as first_name,
    u.last_name as last_name,
    u.username as username,
    u.bio as bio,
    u.urls as urls
  FROM
    public.conversations c
    LEFT JOIN public.conversation_participants cp ON c.id = cp.conversation_id
    LEFT JOIN public.friends f ON c.friendship_id = f.id
    LEFT JOIN public.users u 
      ON u.id = (
        CASE
          WHEN f.sender = (select auth.uid () as uid) THEN f.receiver 
          WHEN f.receiver = (select auth.uid () as uid) THEN f.sender 
        END
      )
  WHERE
    (
      c.type = 'group'
      AND cp.user_id = (
        select
          auth.uid () as uid
      )
    )
    OR (
      c.type = 'friend'
      AND (
        f.sender = (
          select
            auth.uid () as uid
        )
        OR f.receiver = (
          select
            auth.uid () as uid
        )
      )
    );
end;
$$
;

ALTER FUNCTION "public"."get_conversations"() OWNER TO "postgres";

GRANT ALL ON FUNCTION "public"."get_conversations"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_conversations"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_conversations"() TO "service_role";

create policy "allow authenticated users to select conversations they are part"
on "public"."conversation_participants"
as permissive
for select
to authenticated
using (( SELECT hidden.is_participant(auth.uid()) AS is_participant));



