import { apiService } from "./apiService";

export const itemService = {
  getAll() {
    return apiService.get("/items");
  },
  getById(id) {
    return apiService.get(`/items/${id}`);
  },
  create(item) {
    return apiService.post("/items", item);
  },
  update(id, item) {
    return apiService.put(`/items/${id}`, item);
  },
  delete(id) {
    return apiService.delete(`/items/${id}`);
  },
  getCount(params = {}) {
    return apiService.get(
      `/items/count${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ""}`,
    );
  },
};

export default itemService;
