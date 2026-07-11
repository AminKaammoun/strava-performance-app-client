import { apiService } from "./apiService";

export const analyticsService = {
  getSummary() {
    return apiService.get("/analytics/summary");
  },
  getTrends(weeks = 12) {
    return apiService.get(`/analytics/trends?weeks=${weeks}`);
  },
  getRecords() {
    return apiService.get("/analytics/records");
  },
  getShoeMileage() {
    return apiService.get("/analytics/shoes");
  },
  getTrainingLoad(weeks = 8) {
    return apiService.get(`/analytics/training-load?weeks=${weeks}`);
  },
};

export default analyticsService;
