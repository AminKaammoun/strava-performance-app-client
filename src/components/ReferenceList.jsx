import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Fab,
  FormControl,
  IconButton,
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
import { Add, Delete, Edit } from "@mui/icons-material";
import ConfirmDialog from "./Utils/ConfirmDialog";

/**
 * Base table shell shared by every reference table page (items, shoe,
 * goals, cities, countries, races, activities...). Each page passes in
 * its own `columns` + `rows` (sourced from its own collection/service)
 * and this component takes care of search, pagination, rendering, and
 * (when onEdit/onDelete are supplied) an actions column with a built-in
 * delete-confirmation dialog.
 *
 * columns: [{ key, label, align?, render?(row), searchValue?(row) }]
 * onDelete(row) should return true/false (or a promise resolving to one)
 * indicating success — ReferenceList only closes the confirm dialog either way.
 */
function ReferenceList({
  title,
  columns,
  rows,
  loading = false,
  error = null,
  onAdd,
  onEdit,
  onDelete,
  deleteMessage,
  emptyMessage,
  headerActions,
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const allColumns = useMemo(() => {
    if (!onEdit && !onDelete) return columns;
    return [
      ...columns,
      {
        key: "__actions",
        label: "Actions",
        align: "right",
        searchValue: () => "",
        render: (row) => (
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            {onEdit && (
              <IconButton
                size="small"
                onClick={() => onEdit(row)}
                aria-label="edit"
              >
                <Edit fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                size="small"
                color="error"
                onClick={() => setPendingDelete(row)}
                aria-label="delete"
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Stack>
        ),
      },
    ];
  }, [columns, onEdit, onDelete]);

  const filteredRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) =>
      allColumns
        .map(
          (col) =>
            (col.searchValue ? col.searchValue(row) : row[col.key]) ?? "",
        )
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [query, rows, allColumns]);

  const visibleRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  const handleChangePage = (_event, nextPage) => setPage(nextPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete || !onDelete) return;
    setDeleting(true);
    try {
      await onDelete(pendingDelete);
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  return (
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
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {filteredRows.length} rows in {title}
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
            <InputLabel id={`${title}-rows-per-page-label`}>Rows</InputLabel>
            <Select
              labelId={`${title}-rows-per-page-label`}
              value={rowsPerPage}
              label="Rows"
              onChange={handleChangeRowsPerPage}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
          {headerActions}
          {onAdd && (
            <Fab
              color="primary"
              aria-label="add"
              size="small"
              onClick={onAdd}
              sx={{ ml: { sm: 1 } }}
            >
              <Add />
            </Fab>
          )}
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Loading your table data...
        </Typography>
      ) : filteredRows.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          {emptyMessage || `No rows match your filter for ${title}.`}
        </Typography>
      ) : (
        <>
          <TableContainer
            sx={{ mt: 2, maxHeight: "calc(100vh - 320px)", width: "100%" }}
          >
            <Table
              size="small"
              stickyHeader
              aria-label={`${title} table`}
              sx={{ minWidth: 720, width: "100%" }}
            >
              <TableHead>
                <TableRow>
                  {allColumns.map((col) => (
                    <TableCell key={col.key} align={col.align || "left"}>
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map((row) => (
                  <TableRow key={row.id ?? JSON.stringify(row)} hover>
                    {allColumns.map((col) => (
                      <TableCell key={col.key} align={col.align || "left"}>
                        {col.render ? col.render(row) : row[col.key]}
                      </TableCell>
                    ))}
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

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this row?"
        message={
          pendingDelete
            ? deleteMessage
              ? deleteMessage(pendingDelete)
              : `This will permanently delete this ${title.replace(/s$/, "")}. This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
        loading={deleting}
      />
    </Paper>
  );
}

export default ReferenceList;
