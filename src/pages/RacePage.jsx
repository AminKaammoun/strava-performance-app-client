import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { raceCollection } from "../stores/catalog/RaceCollection";
import { cityCollection } from "../stores/catalog/CityCollection";
import { shoeCollection } from "../stores/catalog/ShoeCollection";
import ReferenceList from "../components/ReferenceList";
import EntityFormDialog from "../components/Utils/EntityFormDialog";
import { useSnackbar } from "../components/Utils/SnackbarProvider";

function formatTime(totalSeconds) {
  if (totalSeconds == null) return "-";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h > 0 ? `${h}:` : ""}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const RacePage = observer(() => {
  const { showSuccess, showError } = useSnackbar();
  const [formState, setFormState] = useState({
    open: false,
    mode: "create",
    row: null,
  });

  useEffect(() => {
    raceCollection.loadRaces();
    cityCollection.loadCities();
    shoeCollection.loadShoe();
  }, []);

  const cityOptions = useMemo(
    () =>
      cityCollection.page.items.map((c) => ({ value: c.id, label: c.name })),
    [cityCollection.page.items],
  );

  const shoeOptions = useMemo(
    () =>
      shoeCollection.page.items.map((g) => ({ value: g.id, label: g.name })),
    [shoeCollection.page.items],
  );

  const fields = [
    { key: "name", label: "Name", required: true },
    { key: "raceDate", label: "Date", type: "date" },
    { key: "distanceKm", label: "Distance (km)", type: "number" },
    { key: "cityId", label: "City", type: "select", options: cityOptions },
    { key: "shoeId", label: "Shoe", type: "select", options: shoeOptions },
    { key: "targetTimeSeconds", label: "Target time (s)", type: "number" },
    { key: "actualTimeSeconds", label: "Actual time (s)", type: "number" },
    { key: "overallPlacement", label: "Overall placement", type: "number" },
    { key: "categoryPlacement", label: "Category placement", type: "number" },
    { key: "bibNumber", label: "Bib number" },
    { key: "notes", label: "Notes", multiline: true },
  ];

  const handleDelete = async (row) => {
    const ok = await raceCollection.deleteRace(row.id);
    if (ok) showSuccess("Race deleted.");
    else showError(raceCollection.error);
  };

  const handleSubmit = async (values) => {
    const ok =
      formState.mode === "create"
        ? await raceCollection.addRace(values)
        : await raceCollection.updateRace(formState.row.id, values);

    if (ok) {
      showSuccess(
        formState.mode === "create" ? "Race added." : "Race updated.",
      );
      setFormState({ open: false, mode: "create", row: null });
    } else {
      showError(raceCollection.error);
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "raceDate", label: "Date" },
    {
      key: "distanceKm",
      label: "Distance",
      render: (row) => (row.distanceKm != null ? `${row.distanceKm} km` : "-"),
    },
    { key: "cityName", label: "City" },
    { key: "countryName", label: "Country" },
    {
      key: "actualTimeSeconds",
      label: "Time",
      render: (row) => formatTime(row.actualTimeSeconds),
    },
    { key: "overallPlacement", label: "Placement" },
  ];

  return (
    <>
      <ReferenceList
        title="races"
        columns={columns}
        rows={raceCollection.page.items}
        loading={raceCollection.loading}
        error={raceCollection.error}
        onAdd={() => setFormState({ open: true, mode: "create", row: null })}
        onEdit={(row) => setFormState({ open: true, mode: "edit", row })}
        onDelete={handleDelete}
        deleteMessage={(row) => `Delete "${row.name}"? This can't be undone.`}
      />
      <EntityFormDialog
        open={formState.open}
        onClose={() => setFormState({ open: false, mode: "create", row: null })}
        title={formState.mode === "create" ? "Add a new race" : "Edit race"}
        fields={fields}
        initialValues={formState.row}
        onSubmit={handleSubmit}
        submitLabel={formState.mode === "create" ? "Add" : "Save"}
      />
    </>
  );
});

export default RacePage;
