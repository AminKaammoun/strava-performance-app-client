import axios from "axios";

const api = axios.create({
  baseURL: "/api/",
});

const normalizeEndpoint = (endpoint = "") => {
  return `/${endpoint.replace(/^\/+/, "")}`;
};

export const apiService = {
  get(endpoint) {
    return api.get(normalizeEndpoint(endpoint));
  },
  post(endpoint, payload) {
    return api.post(normalizeEndpoint(endpoint), payload);
  },
  put(endpoint, payload) {
    return api.put(normalizeEndpoint(endpoint), payload);
  },
  delete(endpoint) {
    return api.delete(normalizeEndpoint(endpoint));
  },
};

export default apiService;
