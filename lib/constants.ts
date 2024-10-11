const paths = {
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
    messages: function (
      strings: TemplateStringsArray,
      listId: string
    ) {
      return `${this.lists}/${listId}/messages`;
    },
    conversationsId: function (
      strings: TemplateStringsArray,
      conversationId: string
    ) {
      return `${this.conversations}/${conversationId}`;
    },
    conversationUsers: function (
      strings: TemplateStringsArray,
      conversationId: string
    ) {
      return `${this.conversations}/${conversationId}/users`;
    },
    listsUpdate: (strings: TemplateStringsArray, listId: string) =>
      `/api/chats/lists/${listId}`,
  },
} as const;
Object.freeze(paths);

const brand = {
  name: "chusava",
  description: "Keep track of your movie suggestions.",
};
Object.freeze(brand);

const tmdb_base = {
  home: "https://www.themoviedb.org",
  image: "https://image.tmdb.org/t/p",
};
Object.freeze(tmdb_base);

export { paths, brand, tmdb_base };
