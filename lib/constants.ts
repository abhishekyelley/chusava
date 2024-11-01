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
      return `${this.lists}/${listId}/messages`;
    },
    conversationsId(
      strings: TemplateStringsArray,
      conversationId: string
    ) {
      return `${this.conversations}/${conversationId}`;
    },
    conversationUsers(
      strings: TemplateStringsArray,
      conversationId: string
    ) {
      return `${this.conversations}/${conversationId}/users`;
    },
    listsUpdate(strings: TemplateStringsArray, listId: string) {
      return `/api/chats/lists/${listId}`;
    },
    messagesId(strings: TemplateStringsArray, messageId: string) {
      return `/api/chats/messages/${messageId}`;
    },
    tmdb: {
      root(
        strings: TemplateStringsArray,
        tmdb_type: string,
        tmdb_id: number
      ) {
        return `/api/tmdb/${tmdb_type}/${tmdb_id}`;
      },
      watched(
        strings: TemplateStringsArray,
        tmdb_type: string,
        tmdb_id: number
      ) {
        return this.root`${tmdb_type}${tmdb_id}` + "/watched";
      },
      images(
        strings: TemplateStringsArray,
        tmdb_type: string,
        tmdb_id: number
      ) {
        return this.root`${tmdb_type}${tmdb_id}` + "/images";
      },
    },
  },
});

const brand = Object.freeze({
  name: "chusava",
  description: "Keep track of your movie suggestions.",
});

const tmdb_base = Object.freeze({
  home: "https://www.themoviedb.org",
  image: "https://image.tmdb.org/t/p",
});

export { paths, brand, tmdb_base };
