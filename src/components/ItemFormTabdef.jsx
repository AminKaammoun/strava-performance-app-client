import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import ItemFormTab from "./ItemFormTab";

function ItemFormTabdef({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add a new workout</DialogTitle>
      <DialogContent>
        <ItemFormTab onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

export default ItemFormTabdef;
