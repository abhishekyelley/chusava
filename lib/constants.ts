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
};
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
