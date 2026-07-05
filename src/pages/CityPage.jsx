import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { cityCollection } from "../stores/catalog/CityCollection";
import { countryCollection } from "../stores/catalog/CountryCollection";
import ReferenceList from "../components/ReferenceList";
import EntityFormDialog from "../components/Utils/EntityFormDialog";
import { useSnackbar } from "../components/Utils/SnackbarProvider";

const CityPage = observer(() => {
  const { showSuccess, showError } = useSnackbar();
  const [formState, setFormState] = useState({
    open: false,
    mode: "create",
    row: null,
  });

  useEffect(() => {
    cityCollection.loadCities();
    countryCollection.loadCountries();
  }, []);

  const countryOptions = useMemo(
    () =>
      countryCollection.page.items.map((c) => ({ value: c.id, label: c.name })),
    [countryCollection.page.items],
  );

  const fields = [
    { key: "name", label: "Name", required: true },
    {
      key: "countryId",
      label: "Country",
      type: "select",
      required: true,
      options: countryOptions,
    },
  ];

  const handleDelete = async (row) => {
    const ok = await cityCollection.deleteCity(row.id);
    if (ok) showSuccess("City deleted.");
    else showError(cityCollection.error);
  };

  const handleSubmit = async (values) => {
    const ok =
      formState.mode === "create"
        ? await cityCollection.addCity(values)
        : await cityCollection.updateCity(formState.row.id, values);

    if (ok) {
      showSuccess(
        formState.mode === "create" ? "City added." : "City updated.",
      );
      setFormState({ open: false, mode: "create", row: null });
    } else {
      showError(cityCollection.error);
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "countryName", label: "Country" },
  ];

  return (
    <>
      <ReferenceList
        title="cities"
        columns={columns}
        rows={cityCollection.page.items}
        loading={cityCollection.loading}
        error={cityCollection.error}
        onAdd={() => setFormState({ open: true, mode: "create", row: null })}
        onEdit={(row) => setFormState({ open: true, mode: "edit", row })}
        onDelete={handleDelete}
        deleteMessage={(row) => `Delete "${row.name}"? This can't be undone.`}
      />
      <EntityFormDialog
        open={formState.open}
        onClose={() => setFormState({ open: false, mode: "create", row: null })}
        title={formState.mode === "create" ? "Add a new city" : "Edit city"}
        fields={fields}
        initialValues={formState.row}
        onSubmit={handleSubmit}
        submitLabel={formState.mode === "create" ? "Add" : "Save"}
      />
    </>
  );
});

export default CityPage;
