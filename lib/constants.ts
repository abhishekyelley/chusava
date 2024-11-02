const paths = Object.freeze({
  dashboard: "/dashboard",
  account: "/account",
  login: "/login",
  signup: "/signup",
  about: "/about",
  settings: "/settings",
  profile: "/settings/profile",
  chats: "/chats",
  userChat: "/chat/user",
  api: {
    lists: "/api/chats/lists",
    conversations: "/api/chats/conversations",
    messages(strings: TemplateStringsArray, listId: string) {
      return `${this.lists}/${listId}/messages` as const;
    },
    conversationsId(
      strings: TemplateStringsArray,
      conversationId: string
    ) {
      return `${this.conversations}/${conversationId}` as const;
    },
    conversationUsers(
      strings: TemplateStringsArray,
      conversationId: string
    ) {
      return `${this.conversations}/${conversationId}/users` as const;
    },
    listsUpdate(strings: TemplateStringsArray, listId: string) {
      return `/api/chats/lists/${listId}` as const;
    },
    messagesId(strings: TemplateStringsArray, messageId: string) {
      return `/api/chats/messages/${messageId}` as const;
    },
    tmdb: {
      root(
        strings: TemplateStringsArray,
        tmdb_type: string,
        tmdb_id: number
      ) {
        return `/api/tmdb/${tmdb_type}/${tmdb_id}` as const;
      },
      watched(
        strings: TemplateStringsArray,
        tmdb_type: string,
        tmdb_id: number
      ) {
        const x = this.root`${tmdb_type}${tmdb_id}`;
        return `${x}/watched` as const;
      },
      images(
        strings: TemplateStringsArray,
        tmdb_type: string,
        tmdb_id: number
      ) {
        const x = this.root`${tmdb_type}${tmdb_id}`;
        return `${x}/images` as const;
      },
    },
  },
} as const);

const brand = Object.freeze({
  name: "chusava",
  description: "Keep track of your movie suggestions.",
});

const tmdb_base = Object.freeze({
  home: "https://www.themoviedb.org",
  image: "https://image.tmdb.org/t/p",
});

export { paths, brand, tmdb_base };
