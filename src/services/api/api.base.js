import axios from "axios";

export default {
  async get(url) {
    return axios.get(url);
  },

  async post(url, body) {
    return axios.post(url, body);
  },

  async put(url, body) {
    return axios.put(url, body);
  },

  async delete(url) {
    return axios.delete(url);
  },
};
