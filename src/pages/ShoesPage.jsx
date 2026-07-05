import { useEffect, useState } from "react";
import { Fab, Stack, Typography } from "@mui/material";
import { Sync } from "@mui/icons-material";
import stravaService from "../services/stravaService";
import { shoeCollection } from "../stores/catalog/ShoeCollection";
import ReferenceList from "../components/ReferenceList";
import EntityFormDialog from "../components/Utils/EntityFormDialog";
import { useSnackbar } from "../components/Utils/SnackbarProvider";

// Only the manual/local-only fields are editable — name, primary, and
// distance come from Strava and get overwritten on every sync.
const fields = [
  { key: "brand", label: "Brand" },
  { key: "type", label: "Type" },
  { key: "purchaseDate", label: "Purchase date", type: "date" },
  { key: "retired", label: "Retired", type: "checkbox" },
  { key: "notes", label: "Notes", multiline: true },
];

function ShoesPage() {
  const { showSuccess, showError } = useSnackbar();
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [formState, setFormState] = useState({
    open: false,
    row: null,
  });

  const loadShoes = async () => {
    setLoading(true);
    setError("");
    try {
      // Always reads from our own database — the sync button below is the
      // only action that reaches out to the Strava API itself.
      const [shoesRes, statusRes] = await Promise.all([
        stravaService.getShoes(),
        stravaService.getShoesSyncStatus(),
      ]);
      setShoes(shoesRes?.data ?? []);
      setLastSyncedAt(statusRes?.data?.lastSyncedAt ?? null);
    } catch (err) {
      setError(err.message || "Unable to load shoes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShoes();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setError("");
    try {
      await stravaService.syncShoes(); // the only call that hits the external Strava API
      await loadShoes();
    } catch (err) {
      setError(err.message || "Sync with Strava failed.");
    } finally {
      setSyncing(false);
    }
  };

  const handleSubmit = async (values) => {
    const ok = await shoeCollection.updateShoe(formState.row.id, values);
    if (ok) {
      showSuccess("Shoe updated.");
      setFormState({ open: false, row: null });
      await loadShoes();
    } else {
      showError(shoeCollection.error);
    }
  };

  const columns = [
    { key: "name", label: "Name (Strava)" },
    { key: "brand", label: "Brand" },
    { key: "type", label: "Type" },
    {
      key: "distanceMeters",
      label: "Distance",
      render: (row) =>
        row.distanceMeters != null
          ? `${(row.distanceMeters / 1000).toFixed(1)} km`
          : "-",
    },
    {
      key: "primary",
      label: "Primary",
      render: (row) => (row.primary ? "Yes" : "No"),
    },
    { key: "purchaseDate", label: "Purchased" },
    {
      key: "retired",
      label: "Retired",
      render: (row) => (row.retired ? "Yes" : "No"),
      searchValue: (row) => (row.retired ? "yes retired" : "no active"),
    },
  ];

  const headerActions = (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="caption" color="text.secondary">
        Last synced:{" "}
        {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : "never"}
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
    <>
      <ReferenceList
        title="shoes"
        columns={columns}
        rows={shoes}
        loading={loading}
        error={error}
        headerActions={headerActions}
        onEdit={(row) => setFormState({ open: true, row })}
        emptyMessage="No shoes yet — hit sync to pull your gear from Strava."
      />
      <EntityFormDialog
        open={formState.open}
        onClose={() => setFormState({ open: false, row: null })}
        title={formState.row ? `Edit "${formState.row.name}"` : "Edit shoe"}
        fields={fields}
        initialValues={formState.row}
        onSubmit={handleSubmit}
        submitLabel="Save"
      />
    </>
  );
}

export default ShoesPage;
