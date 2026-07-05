import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { countryCollection } from "../stores/catalog/CountryCollection";
import ReferenceList from "../components/ReferenceList";
import EntityFormDialog from "../components/Utils/EntityFormDialog";
import { useSnackbar } from "../components/Utils/SnackbarProvider";

const fields = [
  { key: "name", label: "Name", required: true },
  { key: "isoCode", label: "ISO code", required: true },
];

const CountryPage = observer(() => {
  const { showSuccess, showError } = useSnackbar();
  const [formState, setFormState] = useState({
    open: false,
    mode: "create",
    row: null,
  });

  useEffect(() => {
    countryCollection.loadCountries();
  }, []);

  const handleDelete = async (row) => {
    const ok = await countryCollection.deleteCountry(row.id);
    if (ok) showSuccess("Country deleted.");
    else showError(countryCollection.error);
  };

  const handleSubmit = async (values) => {
    const ok =
      formState.mode === "create"
        ? await countryCollection.addCountry(values)
        : await countryCollection.updateCountry(formState.row.id, values);

    if (ok) {
      showSuccess(
        formState.mode === "create" ? "Country added." : "Country updated.",
      );
      setFormState({ open: false, mode: "create", row: null });
    } else {
      showError(countryCollection.error);
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "isoCode", label: "ISO code" },
  ];

  return (
    <>
      <ReferenceList
        title="countries"
        columns={columns}
        rows={countryCollection.page.items}
        loading={countryCollection.loading}
        error={countryCollection.error}
        onAdd={() => setFormState({ open: true, mode: "create", row: null })}
        onEdit={(row) => setFormState({ open: true, mode: "edit", row })}
        onDelete={handleDelete}
        deleteMessage={(row) => `Delete "${row.name}"? This can't be undone.`}
      />
      <EntityFormDialog
        open={formState.open}
        onClose={() => setFormState({ open: false, mode: "create", row: null })}
        title={
          formState.mode === "create" ? "Add a new country" : "Edit country"
        }
        fields={fields}
        initialValues={formState.row}
        onSubmit={handleSubmit}
        submitLabel={formState.mode === "create" ? "Add" : "Save"}
      />
    </>
  );
});

export default CountryPage;
