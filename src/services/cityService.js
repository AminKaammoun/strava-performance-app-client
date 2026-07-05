import { apiService } from "./apiService";

export const cityService = {
  getAll() {
    return apiService.get("/cities");
  },
  getById(id) {
    return apiService.get(`/cities/${id}`);
  },
  create(city) {
    return apiService.post("/cities", city);
  },
  update(id, city) {
    return apiService.put(`/cities/${id}`, city);
  },
  delete(id) {
    return apiService.delete(`/cities/${id}`);
  },
};

export default cityService;
