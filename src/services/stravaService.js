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
  getShoes() {
    return apiService.get("/strava/shoes");
  },
  getShoesSyncStatus() {
    return apiService.get("/strava/shoes/sync-status");
  },
  syncShoes() {
    return apiService.post("/strava/shoes/sync");
  },
};

export default stravaService;
