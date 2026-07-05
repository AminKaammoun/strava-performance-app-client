import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

function buildValues(fields, initialValues) {
  const values = {};
  fields.forEach((field) => {
    if (initialValues && Object.prototype.hasOwnProperty.call(initialValues, field.key)) {
      values[field.key] = initialValues[field.key];
    } else {
      values[field.key] = field.defaultValue ?? (field.type === "checkbox" ? false : "");
    }
  });
  return values;
}

/**
 * fields: [{ key, label, type: "text"|"number"|"date"|"checkbox"|"select",
 *            required, multiline, options: [{value,label}] }]
 */
function EntityFormDialog({
  open,
  onClose,
  title,
  fields,
  initialValues,
  onSubmit,
  submitLabel = "Save",
}) {
  const [values, setValues] = useState(() => buildValues(fields, initialValues));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(buildValues(fields, initialValues));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues]);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {fields.map((field) => {
              if (field.type === "checkbox") {
                return (
                  <FormControlLabel
                    key={field.key}
                    control={
                      <Checkbox
                        checked={Boolean(values[field.key])}
                        onChange={(event) =>
                          handleChange(field.key, event.target.checked)
                        }
                      />
                    }
                    label={field.label}
                  />
                );
              }

              if (field.type === "select") {
                return (
                  <TextField
                    key={field.key}
                    select
                    label={field.label}
                    value={values[field.key] ?? ""}
                    onChange={(event) => handleChange(field.key, event.target.value)}
                    required={field.required}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {(field.options || []).map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                );
              }

              return (
                <TextField
                  key={field.key}
                  label={field.label}
                  type={field.type === "number" ? "number" : field.type || "text"}
                  value={values[field.key] ?? ""}
                  onChange={(event) => {
                    const raw = event.target.value;
                    handleChange(
                      field.key,
                      field.type === "number" ? (raw === "" ? "" : Number(raw)) : raw,
                    );
                  }}
                  required={field.required}
                  multiline={field.multiline}
                  minRows={field.multiline ? 3 : undefined}
                  InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
                />
              );
            })}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitLabel}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default EntityFormDialog;
