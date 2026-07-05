import { apiService } from "./apiService";

export const goalService = {
  getAll() {
    return apiService.get("/goals");
  },
  getById(id) {
    return apiService.get(`/goals/${id}`);
  },
  create(goal) {
    return apiService.post("/goals", goal);
  },
  update(id, goal) {
    return apiService.put(`/goals/${id}`, goal);
  },
  delete(id) {
    return apiService.delete(`/goals/${id}`);
  },
};

export default goalService;
