import { apiService } from "./apiService";

export const shoeService = {
  getAll() {
    return apiService.get("/shoe");
  },
  getById(id) {
    return apiService.get(`/shoe/${id}`);
  },
  create(shoe) {
    return apiService.post("/shoe", shoe);
  },
  update(id, shoe) {
    return apiService.put(`/shoe/${id}`, shoe);
  },
  delete(id) {
    return apiService.delete(`/shoe/${id}`);
  },
};

export default shoeService;
