import { apiService } from "./apiService";

export const stravaService = {
  getActivities() {
    return apiService.get("/strava/activities");
  },
  getSyncStatus() {
    return apiService.get("/strava/sync-status");
  },
  sync() {
    return apiService.post("/strava/sync");
  },
};

export default stravaService;
