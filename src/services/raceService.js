import { apiService } from "./apiService";

export const raceService = {
  getAll() {
    return apiService.get("/races");
  },
  getById(id) {
    return apiService.get(`/races/${id}`);
  },
  create(race) {
    return apiService.post("/races", race);
  },
  update(id, race) {
    return apiService.put(`/races/${id}`, race);
  },
  delete(id) {
    return apiService.delete(`/races/${id}`);
  },
};

export default raceService;
