import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { shoeCollection } from "../stores/catalog/ShoeCollection";
import ReferenceList from "../components/ReferenceList";
import EntityFormDialog from "../components/Utils/EntityFormDialog";
import { useSnackbar } from "../components/Utils/SnackbarProvider";

const fields = [
  { key: "name", label: "Name", required: true },
  { key: "brand", label: "Brand" },
  { key: "type", label: "Type" },
  { key: "purchaseDate", label: "Purchase date", type: "date" },
  { key: "totalDistanceKm", label: "Total distance (km)", type: "number" },
  { key: "retired", label: "Retired", type: "checkbox" },
  { key: "notes", label: "Notes", multiline: true },
];

const ShoePage = observer(() => {
  const { showSuccess, showError } = useSnackbar();
  const [formState, setFormState] = useState({
    open: false,
    mode: "create",
    row: null,
  });

  useEffect(() => {
    shoeCollection.loadShoe();
  }, []);

  const handleDelete = async (row) => {
    const ok = await shoeCollection.deleteShoe(row.id);
    if (ok) showSuccess("Shoe deleted.");
    else showError(shoeCollection.error);
  };

  const handleSubmit = async (values) => {
    const ok =
      formState.mode === "create"
        ? await shoeCollection.addShoe(values)
        : await shoeCollection.updateShoe(formState.row.id, values);

    if (ok) {
      showSuccess(
        formState.mode === "create" ? "Shoe added." : "Shoe updated.",
      );
      setFormState({ open: false, mode: "create", row: null });
    } else {
      showError(shoeCollection.error);
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "brand", label: "Brand" },
    { key: "type", label: "Type" },
    { key: "purchaseDate", label: "Purchased" },
    {
      key: "totalDistanceKm",
      label: "Distance",
      render: (row) =>
        row.totalDistanceKm != null ? `${row.totalDistanceKm} km` : "-",
    },
    {
      key: "retired",
      label: "Retired",
      render: (row) => (row.retired ? "Yes" : "No"),
      searchValue: (row) => (row.retired ? "yes retired" : "no active"),
    },
  ];

  return (
    <>
      <ReferenceList
        title="shoes"
        columns={columns}
        rows={shoeCollection.page.items}
        loading={shoeCollection.loading}
        error={shoeCollection.error}
        onAdd={() => setFormState({ open: true, mode: "create", row: null })}
        onEdit={(row) => setFormState({ open: true, mode: "edit", row })}
        onDelete={handleDelete}
        deleteMessage={(row) => `Delete "${row.name}"? This can't be undone.`}
      />
      <EntityFormDialog
        open={formState.open}
        onClose={() => setFormState({ open: false, mode: "create", row: null })}
        title={formState.mode === "create" ? "Add new shoe" : "Edit shoe"}
        fields={fields}
        initialValues={formState.row}
        onSubmit={handleSubmit}
        submitLabel={formState.mode === "create" ? "Add" : "Save"}
      />
    </>
  );
});

export default ShoePage;
