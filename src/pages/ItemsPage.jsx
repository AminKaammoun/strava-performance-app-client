import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Alert,
  Box,
  Chip,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Delete, Sync, TableRows } from "@mui/icons-material";
import { itemCollection } from "../stores/catalog/ItemCollection";
import ItemFormTabdef from "../components/ItemFormTabdef";
import stravaService from "../services/stravaService";

const referenceTables = ["items", "activities"];

const ItemsPage = observer(() => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState(referenceTables[0]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [stravaActivities, setStravaActivities] = useState([]);
  const [stravaLoading, setStravaLoading] = useState(false);
  const [stravaError, setStravaError] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    itemCollection.loadItems();
  }, []);

  useEffect(() => {
    if (selectedTable !== "activities") {
      return;
    }

    let isMounted = true;

    const loadActivities = async () => {
      setStravaLoading(true);
      setStravaError("");

      try {
        // Always reads from our own database — the sync button below is the only
        // action that reaches out to the Strava API itself.
        const [activitiesRes, statusRes] = await Promise.all([
          stravaService.getActivities(),
          stravaService.getSyncStatus(),
        ]);
        if (isMounted) {
          setStravaActivities(activitiesRes?.data ?? []);
          setLastSyncedAt(statusRes?.data?.lastSyncedAt ?? null);
        }
      } catch (error) {
        if (isMounted) {
          setStravaError(error.message || "Unable to load Strava activities.");
        }
      } finally {
        if (isMounted) {
          setStravaLoading(false);
        }
      }
    };

    loadActivities();
    return () => {
      isMounted = false;
    };
  }, [selectedTable]);

  const handleSync = async () => {
    setSyncing(true);
    setStravaError("");
    try {
      await stravaService.sync(); // the only call that hits the external Strava API
      const [activitiesRes, statusRes] = await Promise.all([
        stravaService.getActivities(),
        stravaService.getSyncStatus(),
      ]);
      setStravaActivities(activitiesRes?.data ?? []);
      setLastSyncedAt(statusRes?.data?.lastSyncedAt ?? null);
    } catch (error) {
      setStravaError(error.message || "Sync with Strava failed.");
    } finally {
      setSyncing(false);
    }
  };

  const isActivitiesView = selectedTable === "activities";

  const rows = useMemo(
    () =>
      isActivitiesView ? stravaActivities : itemCollection.itemsPage.items,
    [isActivitiesView, stravaActivities, itemCollection.itemsPage.items],
  );

  const filteredRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => {
      const haystack = [
        row.name ?? "",
        row.description ?? "",
        row.type ?? "",
        row.startDateLocal ?? "",
        row.distance ?? "",
        row.movingTime ?? "",
        row.averageHeartrate ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [query, rows]);

  const visibleRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  const toggleDone = (item) => {
    itemCollection.toggleDone(item);
  };

  const handleDelete = (id) => {
    itemCollection.deleteItem(id);
  };

  const handleChangePage = (_event, nextPage) => {
    setPage(nextPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectTable = (table) => {
    setSelectedTable(table);
    setPage(0);
    setQuery("");
  };

  return (
    <Box className="page-shell" sx={{ display: "grid", gap: 3, width: "100%" }}>
      <Paper className="panel" sx={{ p: 3, width: "100%", overflow: "hidden" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Box>
            <Typography variant="overline" color="text.secondary">
              Reference list
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {selectedTable}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Switch tables and inspect the matching data below.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {referenceTables.map((table) => (
              <Chip
                key={table}
                icon={<TableRows />}
                label={table}
                variant={selectedTable === table ? "filled" : "outlined"}
                color={selectedTable === table ? "primary" : "default"}
                onClick={() => handleSelectTable(table)}
              />
            ))}
          </Stack>
        </Stack>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          sx={{ mt: 3 }}
        >
          <Box>
            <Typography variant="overline" color="text.secondary">
              Data view
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {filteredRows.length} rows in {selectedTable}
            </Typography>
          </Box>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            alignItems="center"
            sx={{
              ml: "auto",
              width: { xs: "100%", sm: "auto" },
              justifyContent: { sm: "flex-end" },
            }}
          >
            <TextField
              size="small"
              label="Filter"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(0);
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="rows-per-page-label">Rows</InputLabel>
              <Select
                labelId="rows-per-page-label"
                value={rowsPerPage}
                label="Rows"
                onChange={handleChangeRowsPerPage}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            {!isActivitiesView && (
              <Fab
                color="primary"
                aria-label="add"
                size="small"
                onClick={() => setOpenDialog(true)}
                sx={{ ml: { sm: 1 } }}
              >
                <Add />
              </Fab>
            )}
            {isActivitiesView && (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ ml: { sm: 1 } }}
              >
                <Typography variant="caption" color="text.secondary">
                  Last synced:{" "}
                  {lastSyncedAt
                    ? new Date(lastSyncedAt).toLocaleString()
                    : "never"}
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
            )}
          </Stack>
        </Stack>

        {isActivitiesView ? (
          stravaError ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {stravaError}
            </Alert>
          ) : null
        ) : itemCollection.error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {itemCollection.error}
          </Alert>
        ) : null}

        {isActivitiesView ? (
          stravaLoading ? (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Loading your Strava activities...
            </Typography>
          ) : filteredRows.length === 0 ? (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              No rows match your filter for {selectedTable}.
            </Typography>
          ) : (
            <>
              <TableContainer
                sx={{ mt: 2, maxHeight: "calc(100vh - 320px)", width: "100%" }}
              >
                <Table
                  size="small"
                  stickyHeader
                  aria-label="activities table"
                  sx={{ minWidth: 900, width: "100%" }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Distance</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Avg HR</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visibleRows.map((activity) => (
                      <TableRow key={activity.id ?? activity.name} hover>
                        <TableCell>{activity.name}</TableCell>
                        <TableCell>{activity.type}</TableCell>
                        <TableCell>{activity.startDateLocal}</TableCell>
                        <TableCell>
                          {activity.distance != null
                            ? `${(activity.distance / 1000).toFixed(2)} km`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {activity.movingTime != null
                            ? `${Math.round(activity.movingTime / 60)} min`
                            : "-"}
                        </TableCell>
                        <TableCell>{activity.averageHeartrate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={filteredRows.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 50]}
              />
            </>
          )
        ) : itemCollection.loading ? (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Loading your table data...
          </Typography>
        ) : filteredRows.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            No rows match your filter for {selectedTable}.
          </Typography>
        ) : (
          <>
            <TableContainer
              sx={{ mt: 2, maxHeight: "calc(100vh - 320px)", width: "100%" }}
            >
              <Table
                size="small"
                stickyHeader
                aria-label="items table"
                sx={{ minWidth: 720, width: "100%" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Done</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleRows.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={item.done}
                          onChange={() => toggleDone(item)}
                        />
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell align="right">
                        <Fab
                          size="small"
                          color="error"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Delete fontSize="small" />
                        </Fab>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredRows.length}
              page={page}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[10, 25, 50]}
            />
          </>
        )}
      </Paper>

      {!isActivitiesView && (
        <ItemFormTabdef
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </Box>
  );
});

export default ItemsPage;
