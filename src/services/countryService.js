import { apiService } from "./apiService";

export const countryService = {
  getAll() {
    return apiService.get("/countries");
  },
  getById(id) {
    return apiService.get(`/countries/${id}`);
  },
  create(country) {
    return apiService.post("/countries", country);
  },
  update(id, country) {
    return apiService.put(`/countries/${id}`, country);
  },
  delete(id) {
    return apiService.delete(`/countries/${id}`);
  },
};

export default countryService;
