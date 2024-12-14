# chusava

Local Development:

> Prerequisite: Supabase CLI

First time setup

```bash
supabase login
supabase link
supabase db push
```

To start supabase

```bash
supabase start
```

> Paste necessary keys in `.env.local`. Use `.env.example` for reference.

Start NextJS

```bash
npm run dev
```

Remember to stop the container when finished

```bash
supabase stop
```

> [!NOTE]
> Local data is backed up to docker volume
>
> ```bash
> docker volume ls --filter label=com.supabase.cli.project=chusava
> ```

***

- Suggest movies/tv-shows to your friends
- Maintain multiple lists with a friend
- Share a list to someone else
- Fork lists
- Remember who added which title
- Within a chat, add a title as the other person
  - These can be approved by them later then the ownership will be transferred

***
