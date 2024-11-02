

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."conversation_type" AS ENUM (
    'group',
    'friend'
);


ALTER TYPE "public"."conversation_type" OWNER TO "postgres";


CREATE TYPE "public"."conversation_with_user" AS (
	"conversation_id" "uuid",
	"conversation_type" "public"."conversation_type",
	"conversation_created_at" timestamp with time zone,
	"friendship_id" "uuid",
	"user_id" "uuid",
	"first_name" "text",
	"last_name" "text",
	"username" "text",
	"bio" "text",
	"urls" "text"[]
);


ALTER TYPE "public"."conversation_with_user" OWNER TO "postgres";


CREATE TYPE "public"."tmdb_type_enum" AS ENUM (
    'movie',
    'tv'
);


ALTER TYPE "public"."tmdb_type_enum" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "username" "text",
    "bio" "text",
    "urls" "text"[]
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON COLUMN "public"."users"."bio" IS 'user bio';



COMMENT ON COLUMN "public"."users"."urls" IS 'array of links to social urls';



CREATE OR REPLACE FUNCTION "public"."full_name"("public"."users") RETURNS "text"
    LANGUAGE "sql"
    SET "search_path" TO ''
    AS $_$
  SELECT $1.first_name || ' ' || $1.last_name;
$_$;


ALTER FUNCTION "public"."full_name"("public"."users") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_conversation_id_for_duo"("requester_id" "text", "requesting_id" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
DECLARE
  cid text;
BEGIN
  SELECT
    DISTINCT(c.id)::text INTO cid::text
  FROM
    public.conversations c
  WHERE
    c.id IN (
      SELECT
        cp1.conversation_id
        FROM
          public.conversation_participants cp1
        JOIN
          public.conversation_participants cp2 
        ON
          cp1.conversation_id = cp2.conversation_id
        WHERE
          cp1.user_id::text = requester_id
        AND
          cp2.user_id::text = requesting_id
        GROUP BY
          cp1.conversation_id
        HAVING
          COUNT(*) = 2
    )
  AND
    c.type = 'duo'
  LIMIT 1;
  RETURN cid;
END;
$$;


ALTER FUNCTION "public"."get_conversation_id_for_duo"("requester_id" "text", "requesting_id" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_conversations"() RETURNS SETOF "public"."conversation_with_user"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
begin
  return query
  SELECT
    c.id as conversation_id,
    c.type as conversation_type,
    c.created_at as conversation_created_at,
    c.friendship_id as friendship_id,
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
$$;


ALTER FUNCTION "public"."get_conversations"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_users_in_conversation"("p_conversation_id" "uuid") RETURNS TABLE("id" "uuid", "first_name" "text", "last_name" "text", "username" "text", "bio" "text", "urls" "text"[])
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
BEGIN
  RETURN QUERY
  select distinct
    u.id,
    u.first_name,
    u.last_name,
    u.username,
    u.bio,
    u.urls
  from
    public.conversations c
    left join public.friends f on f.id = c.friendship_id
    left join public.conversation_participants cp on c.id = cp.conversation_id
    left join public.users u on (
      (u.id = f.sender)
      or
      (u.id = f.receiver)
      or
      (u.id = cp.user_id)
    )
  where c.id = p_conversation_id;
END;
$$;


ALTER FUNCTION "public"."get_users_in_conversation"("p_conversation_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_friend_request"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
begin
  IF EXISTS (
    SELECT 1
    FROM public.friends
    WHERE
    (sender = (select auth.uid() as uid) AND receiver = new.receiver)
    OR
    (receiver = (select auth.uid() as uid) AND sender = new.receiver)
  ) THEN
    RAISE EXCEPTION 'Friend request already made!';
  END IF;

  IF ((select auth.uid() as uid) = new.receiver) THEN
    RAISE EXCEPTION 'Friend request cannot be made to self!';
  END IF;

  NEW.created_at := current_timestamp;
  NEW.sender := (select auth.uid() as uid);
  NEW.accepted := false;

  return NEW;
end;
$$;


ALTER FUNCTION "public"."handle_friend_request"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_friend_request_update"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
begin
  IF ((select auth.uid() as uid) <> new.receiver) THEN
    RAISE EXCEPTION 'Only receiver can accept a friend request!';
  END IF;
  IF not ((OLD.accepted = false) and (NEW.accepted = true)) THEN
    RAISE EXCEPTION 'Updates are only to accept a request!';
  END IF;
  IF (OLD.id <> NEW.id) THEN
    RAISE EXCEPTION 'Cannot change id';
  END IF;
  insert into public.conversations
    (type, friendship_id)
  values
    ('friend', OLD.id);
  return NEW;
end;
$$;


ALTER FUNCTION "public"."handle_friend_request_update"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
IF EXISTS (
    SELECT 1
    FROM public.users
    WHERE username = new.raw_user_meta_data->>'username' 

) THEN
    RAISE EXCEPTION 'User with username % already exists!', new.raw_user_meta_data->>'username';
END IF;
  insert into public.users (id, first_name, last_name, username)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'username'
  );
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."conversation_lists" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "conversation_id" "uuid",
    "list_id" "uuid",
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."conversation_lists" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."conversation_participants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "conversation_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."conversation_participants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."conversations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "public"."conversation_type" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "friendship_id" "uuid",
    "owner_id" "uuid"
);


ALTER TABLE "public"."conversations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."friends" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sender" "uuid" NOT NULL,
    "receiver" "uuid" NOT NULL,
    "accepted" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."friends" OWNER TO "postgres";


COMMENT ON TABLE "public"."friends" IS 'stores requests and states i.e. accept or pending';



CREATE TABLE IF NOT EXISTS "public"."lists" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "owner_id" "uuid"
);


ALTER TABLE "public"."lists" OWNER TO "postgres";


COMMENT ON COLUMN "public"."lists"."owner_id" IS 'user id of the one who created the list';



CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tmdb_type" "public"."tmdb_type_enum" NOT NULL,
    "tmdb_id" bigint NOT NULL,
    "sender" "uuid",
    "list_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."messages" OWNER TO "postgres";


COMMENT ON TABLE "public"."messages" IS 'store all messages. each message bound to a list and sender';



CREATE TABLE IF NOT EXISTS "public"."watched" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "tmdb_id" bigint NOT NULL,
    "tmdb_type" "public"."tmdb_type_enum" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."watched" OWNER TO "postgres";


COMMENT ON TABLE "public"."watched" IS 'tmdb ids watched by users';



CREATE OR REPLACE VIEW "public"."messages_with_watched" WITH ("security_invoker"='on') AS
 SELECT "m"."id",
    "m"."tmdb_type",
    "m"."tmdb_id",
    "m"."sender",
    "m"."list_id",
    "m"."created_at",
        CASE
            WHEN ("w"."id" IS NOT NULL) THEN true
            ELSE false
        END AS "watched"
   FROM ("public"."messages" "m"
     LEFT JOIN "public"."watched" "w" ON ((("w"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("w"."tmdb_id" = "m"."tmdb_id") AND ("w"."tmdb_type" = "m"."tmdb_type"))));


ALTER TABLE "public"."messages_with_watched" OWNER TO "postgres";


ALTER TABLE ONLY "public"."conversation_lists"
    ADD CONSTRAINT "conversation_lists_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."conversation_lists"
    ADD CONSTRAINT "conversation_lists_unique_conversation_name" UNIQUE ("conversation_id", "name");



ALTER TABLE ONLY "public"."conversation_participants"
    ADD CONSTRAINT "conversation_participants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lists"
    ADD CONSTRAINT "lists_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_unique_tmdb_type_id_list_id" UNIQUE ("tmdb_type", "tmdb_id", "list_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."watched"
    ADD CONSTRAINT "watched_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."watched"
    ADD CONSTRAINT "watched_unique_user_tmdb" UNIQUE ("user_id", "tmdb_id", "tmdb_type");



CREATE OR REPLACE TRIGGER "on_friend_request_created" BEFORE INSERT ON "public"."friends" FOR EACH ROW EXECUTE FUNCTION "public"."handle_friend_request"();



CREATE OR REPLACE TRIGGER "on_friend_request_update" BEFORE UPDATE ON "public"."friends" FOR EACH ROW EXECUTE FUNCTION "public"."handle_friend_request_update"();



ALTER TABLE ONLY "public"."conversation_lists"
    ADD CONSTRAINT "conversation_lists_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conversation_lists"
    ADD CONSTRAINT "conversation_lists_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "public"."lists"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conversation_participants"
    ADD CONSTRAINT "conversation_participants_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conversation_participants"
    ADD CONSTRAINT "conversation_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_friendship_id_fkey" FOREIGN KEY ("friendship_id") REFERENCES "public"."friends"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_receiver_fkey" FOREIGN KEY ("receiver") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_sender_fkey" FOREIGN KEY ("sender") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lists"
    ADD CONSTRAINT "lists_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "public"."lists"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_sender_fkey" FOREIGN KEY ("sender") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."watched"
    ADD CONSTRAINT "watched_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



CREATE POLICY "allow all authenticated users to insert" ON "public"."conversation_participants" FOR INSERT TO "authenticated" WITH CHECK (("conversation_id" IN ( SELECT "c"."id"
   FROM "public"."conversations" "c"
  WHERE ("c"."owner_id" = ( SELECT "auth"."uid"() AS "uid")))));



CREATE POLICY "allow all to read users" ON "public"."users" FOR SELECT USING (true);



CREATE POLICY "allow all to select" ON "public"."conversation_lists" FOR SELECT TO "authenticated" USING (("conversation_id" IN ( SELECT "c"."id"
   FROM "public"."conversations" "c"
  WHERE ((("c"."type" = 'group'::"public"."conversation_type") AND ("c"."id" = ( SELECT "cp"."conversation_id"
           FROM "public"."conversation_participants" "cp"
          WHERE ("cp"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) OR (("c"."type" = 'friend'::"public"."conversation_type") AND ("c"."friendship_id" IN ( SELECT "f"."id"
           FROM "public"."friends" "f"
          WHERE (("f"."sender" = ( SELECT "auth"."uid"() AS "uid")) OR ("f"."receiver" = ( SELECT "auth"."uid"() AS "uid"))))))))));



CREATE POLICY "allow authenticated users to accept a request" ON "public"."friends" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "receiver")) WITH CHECK (("accepted" = true));



CREATE POLICY "allow authenticated users to create a conversation" ON "public"."conversations" FOR INSERT TO "authenticated" WITH CHECK (((("type" = 'group'::"public"."conversation_type") AND ("owner_id" = ( SELECT "auth"."uid"() AS "uid"))) OR (("type" = 'friend'::"public"."conversation_type") AND ("friendship_id" IN ( SELECT "friends"."id"
   FROM "public"."friends"
  WHERE ("friends"."receiver" = ( SELECT "auth"."uid"() AS "uid")))))));



CREATE POLICY "allow authenticated users to see if they sent or received a req" ON "public"."friends" FOR SELECT TO "authenticated" USING (((( SELECT "auth"."uid"() AS "uid") = "sender") OR (( SELECT "auth"."uid"() AS "uid") = "receiver")));



CREATE POLICY "allow authenticated users to select conversations they are part" ON "public"."conversation_participants" FOR SELECT TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "allow authenticated users to select their conversations" ON "public"."conversations" FOR SELECT TO "authenticated" USING ((("id" IN ( SELECT "conversation_participants"."conversation_id"
   FROM "public"."conversation_participants"
  WHERE ("conversation_participants"."user_id" = ( SELECT "auth"."uid"() AS "uid")))) OR ("friendship_id" IN ( SELECT "f"."id"
   FROM "public"."friends" "f"
  WHERE (("f"."sender" = ( SELECT "auth"."uid"() AS "uid")) OR ("f"."receiver" = ( SELECT "auth"."uid"() AS "uid")))))));



CREATE POLICY "allow authenticated users to send requests" ON "public"."friends" FOR INSERT TO "authenticated" WITH CHECK (((( SELECT "auth"."uid"() AS "uid") = "sender") AND (( SELECT "auth"."uid"() AS "uid") <> "receiver") AND ("accepted" = false)));



CREATE POLICY "allow conversation owner to add lists" ON "public"."conversation_lists" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "allow current user to create list as owner" ON "public"."lists" FOR INSERT TO "authenticated" WITH CHECK (("owner_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "allow members to update list" ON "public"."lists" FOR UPDATE TO "authenticated" USING (("id" IN ( SELECT "cl"."list_id"
   FROM ("public"."conversation_lists" "cl"
     JOIN "public"."conversations" "c" ON (("cl"."conversation_id" = "c"."id")))
  WHERE ((("c"."type" = 'friend'::"public"."conversation_type") AND ("c"."friendship_id" IN ( SELECT "f"."id"
           FROM "public"."friends" "f"
          WHERE (("f"."sender" = ( SELECT "auth"."uid"() AS "uid")) OR ("f"."receiver" = ( SELECT "auth"."uid"() AS "uid")))))) OR (("c"."type" = 'group'::"public"."conversation_type") AND ("c"."id" = ( SELECT "cp"."conversation_id"
           FROM "public"."conversation_participants" "cp"
          WHERE ("cp"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))))));



CREATE POLICY "allow sender to delete their request" ON "public"."friends" FOR DELETE TO "authenticated" USING (((( SELECT "auth"."uid"() AS "uid") = "sender") OR (( SELECT "auth"."uid"() AS "uid") = "receiver")));



CREATE POLICY "allow users to delete their own messages" ON "public"."messages" FOR DELETE TO "authenticated" USING (("sender" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "allow users to delete their own watched status" ON "public"."watched" FOR DELETE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "allow users to insert a watched entry" ON "public"."watched" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "allow users to see messages from their lists" ON "public"."messages" FOR SELECT TO "authenticated" USING (("list_id" IN ( SELECT "cl"."list_id"
   FROM ((("public"."conversation_lists" "cl"
     JOIN "public"."conversations" "c" ON (("c"."id" = "cl"."conversation_id")))
     LEFT JOIN "public"."friends" "f" ON (("f"."id" = "c"."friendship_id")))
     LEFT JOIN "public"."conversation_participants" "cp" ON (("cp"."conversation_id" = "c"."id")))
  WHERE (("f"."sender" = ( SELECT "auth"."uid"() AS "uid")) OR ("f"."receiver" = ( SELECT "auth"."uid"() AS "uid")) OR ("cp"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "allow users to see what they watched" ON "public"."watched" FOR SELECT TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "allow users to select list they are part of" ON "public"."lists" FOR SELECT TO "authenticated" USING ((("owner_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("id" IN ( SELECT "cl"."list_id"
   FROM ("public"."conversation_lists" "cl"
     JOIN "public"."conversations" "c" ON (("cl"."conversation_id" = "c"."id")))
  WHERE ((("c"."type" = 'friend'::"public"."conversation_type") AND ("c"."friendship_id" IN ( SELECT "f"."id"
           FROM "public"."friends" "f"
          WHERE (("f"."sender" = ( SELECT "auth"."uid"() AS "uid")) OR ("f"."receiver" = ( SELECT "auth"."uid"() AS "uid")))))) OR (("c"."type" = 'group'::"public"."conversation_type") AND ("c"."id" = ( SELECT "cp"."conversation_id"
           FROM "public"."conversation_participants" "cp"
          WHERE ("cp"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))))))));



CREATE POLICY "allow users to send messages in their lists" ON "public"."messages" FOR INSERT TO "authenticated" WITH CHECK ((("list_id" IN ( SELECT "cl"."list_id"
   FROM ((("public"."conversation_lists" "cl"
     JOIN "public"."conversations" "c" ON (("c"."id" = "cl"."conversation_id")))
     LEFT JOIN "public"."friends" "f" ON (("f"."id" = "c"."friendship_id")))
     LEFT JOIN "public"."conversation_participants" "cp" ON (("cp"."conversation_id" = "c"."id")))
  WHERE (("f"."sender" = ( SELECT "auth"."uid"() AS "uid")) OR ("f"."receiver" = ( SELECT "auth"."uid"() AS "uid")) OR ("cp"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) AND ("sender" = ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "allow users to update their own row" ON "public"."users" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



ALTER TABLE "public"."conversation_lists" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."conversation_participants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."conversations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."friends" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lists" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."watched" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
































































































































































































GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON FUNCTION "public"."full_name"("public"."users") TO "anon";
GRANT ALL ON FUNCTION "public"."full_name"("public"."users") TO "authenticated";
GRANT ALL ON FUNCTION "public"."full_name"("public"."users") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_conversation_id_for_duo"("requester_id" "text", "requesting_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_conversation_id_for_duo"("requester_id" "text", "requesting_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_conversation_id_for_duo"("requester_id" "text", "requesting_id" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_conversations"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_conversations"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_conversations"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_users_in_conversation"("p_conversation_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_users_in_conversation"("p_conversation_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_users_in_conversation"("p_conversation_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_friend_request"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_friend_request"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_friend_request"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_friend_request_update"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_friend_request_update"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_friend_request_update"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";





















GRANT ALL ON TABLE "public"."conversation_lists" TO "anon";
GRANT ALL ON TABLE "public"."conversation_lists" TO "authenticated";
GRANT ALL ON TABLE "public"."conversation_lists" TO "service_role";



GRANT ALL ON TABLE "public"."conversation_participants" TO "anon";
GRANT ALL ON TABLE "public"."conversation_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."conversation_participants" TO "service_role";



GRANT ALL ON TABLE "public"."conversations" TO "anon";
GRANT ALL ON TABLE "public"."conversations" TO "authenticated";
GRANT ALL ON TABLE "public"."conversations" TO "service_role";



GRANT ALL ON TABLE "public"."friends" TO "anon";
GRANT ALL ON TABLE "public"."friends" TO "authenticated";
GRANT ALL ON TABLE "public"."friends" TO "service_role";



GRANT ALL ON TABLE "public"."lists" TO "anon";
GRANT ALL ON TABLE "public"."lists" TO "authenticated";
GRANT ALL ON TABLE "public"."lists" TO "service_role";



GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT ALL ON TABLE "public"."watched" TO "anon";
GRANT ALL ON TABLE "public"."watched" TO "authenticated";
GRANT ALL ON TABLE "public"."watched" TO "service_role";



GRANT ALL ON TABLE "public"."messages_with_watched" TO "anon";
GRANT ALL ON TABLE "public"."messages_with_watched" TO "authenticated";
GRANT ALL ON TABLE "public"."messages_with_watched" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
