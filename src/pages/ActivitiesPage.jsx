import { useEffect, useState } from "react";
import { Fab, Stack, Typography } from "@mui/material";
import { Sync } from "@mui/icons-material";
import stravaService from "../services/stravaService";
import ReferenceList from "../components/ReferenceList";

function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const loadActivities = async () => {
    setLoading(true);
    setError("");
    try {
      // Always reads from our own database — the sync button below is the
      // only action that reaches out to the Strava API itself.
      const [activitiesRes, statusRes] = await Promise.all([
        stravaService.getActivities(),
        stravaService.getSyncStatus(),
      ]);
      setActivities(activitiesRes?.data ?? []);
      setLastSyncedAt(statusRes?.data?.lastSyncedAt ?? null);
    } catch (err) {
      setError(err.message || "Unable to load Strava activities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setError("");
    try {
      await stravaService.sync(); // the only call that hits the external Strava API
      await loadActivities();
    } catch (err) {
      setError(err.message || "Sync with Strava failed.");
    } finally {
      setSyncing(false);
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "startDateLocal", label: "Date" },
    {
      key: "distance",
      label: "Distance",
      render: (row) =>
        row.distance != null ? `${(row.distance / 1000).toFixed(2)} km` : "-",
    },
    {
      key: "movingTime",
      label: "Duration",
      render: (row) =>
        row.movingTime != null ? `${Math.round(row.movingTime / 60)} min` : "-",
    },
    { key: "averageHeartrate", label: "Avg HR" },
  ];

  const headerActions = (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="caption" color="text.secondary">
        Last synced: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : "never"}
      </Typography>
      <Fab
        color="primary"
        aria-label="sync"
        size="small"
        disabled={syncing}
        onClick={handleSync}
      >
        <Sync className={syncing ? "spin-icon" : ""} />
      </Fab>
    </Stack>
  );

  return (
    <ReferenceList
      title="activities"
      columns={columns}
      rows={activities}
      loading={loading}
      error={error}
      headerActions={headerActions}
    />
  );
}

export default ActivitiesPage;
