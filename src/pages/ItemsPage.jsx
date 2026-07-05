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
import { Add, Delete, TableRows } from "@mui/icons-material";
import { itemCollection } from "../stores/catalog/ItemCollection";
import ItemFormTabdef from "../components/ItemFormTabdef";

const referenceTables = ["items", "activities", "runs", "athletes"];

const ItemsPage = observer(() => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState(referenceTables[0]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    itemCollection.loadItems();
  }, []);

  const rows = useMemo(
    () => itemCollection.itemsPage.items,
    [itemCollection.itemsPage.items],
  );

  const filteredRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((item) => {
      const haystack =
        `${item.name ?? ""} ${item.description ?? ""}`.toLowerCase();
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
                onClick={() => setSelectedTable(table)}
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
            <Fab
              color="primary"
              aria-label="add"
              size="small"
              onClick={() => setOpenDialog(true)}
              sx={{ ml: { sm: 1 } }}
            >
              <Add />
            </Fab>
          </Stack>
        </Stack>

        {itemCollection.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {itemCollection.error}
          </Alert>
        )}

        {itemCollection.loading ? (
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
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 25, 50]}
            />
          </>
        )}
      </Paper>

      <ItemFormTabdef open={openDialog} onClose={() => setOpenDialog(false)} />
    </Box>
  );
});

export default ItemsPage;
