"use server";

import base_axios from "axios";

const axios = base_axios.create({
  baseURL: "https://api.themoviedb.org/3/",
});

axios.defaults.headers.common[
  "Authorization"
] = `Bearer ${process.env.TMDB_ACCESS_TOKEN}`;
axios.defaults.headers.common["Accept"] = "application/json";

axios.interceptors.request.use(
  (request) => {
    // Edit request config
    return request;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    // Edit response config
    return response;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

export default axios;
