// First we need to import axios.js
import base_axios from "axios";
// Next we make an 'instance' of it
const axios = base_axios.create({
  // .. where we make our configurations
  // baseURL: 'https://api.example.com'
});

// Where you would set stuff like your 'Authorization' header, etc ...
// instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';

// Also add/ configure interceptors && all the other cool stuff

axios.interceptors.request.use(request => {
  // Edit request config
  return request;
}, error => {
  console.error(error);
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  // Edit response config
  return response;
}, error => {
  console.error(error);
  return Promise.reject(error);
});

export default axios;