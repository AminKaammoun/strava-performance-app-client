import { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { itemCollection } from "../stores/catalog/ItemCollection";

const ItemFormTab = observer(({ onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    await itemCollection.addItem({ name, description, done: false });
    setName("");
    setDescription("");
    onClose?.();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "grid", gap: 2 }}
    >
      <Typography variant="h6">Add a workout</Typography>
      <TextField
        label="Session name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />
      <TextField
        label="Notes or stats"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        multiline
        minRows={3}
      />
      <Stack direction="row" spacing={1.5} justifyContent="flex-end">
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="contained">
          Save
        </Button>
      </Stack>
    </Box>
  );
});

export default ItemFormTab;
