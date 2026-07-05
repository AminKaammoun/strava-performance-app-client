import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { goalCollection } from "../stores/catalog/GoalCollection";
import ReferenceList from "../components/ReferenceList";
import EntityFormDialog from "../components/Utils/EntityFormDialog";
import { useSnackbar } from "../components/Utils/SnackbarProvider";

const fields = [
  { key: "title", label: "Title", required: true },
  { key: "description", label: "Description", multiline: true },
  { key: "type", label: "Type" },
  { key: "targetValue", label: "Target value", type: "number" },
  { key: "currentValue", label: "Current value", type: "number" },
  { key: "targetDate", label: "Target date", type: "date" },
  { key: "achieved", label: "Achieved", type: "checkbox" },
  { key: "relatedRaceId", label: "Related race ID", type: "number" },
];

const GoalPage = observer(() => {
  const { showSuccess, showError } = useSnackbar();
  const [formState, setFormState] = useState({
    open: false,
    mode: "create",
    row: null,
  });

  useEffect(() => {
    goalCollection.loadGoals();
  }, []);

  const handleDelete = async (row) => {
    const ok = await goalCollection.deleteGoal(row.id);
    if (ok) showSuccess("Goal deleted.");
    else showError(goalCollection.error);
  };

  const handleSubmit = async (values) => {
    const ok =
      formState.mode === "create"
        ? await goalCollection.addGoal(values)
        : await goalCollection.updateGoal(formState.row.id, values);

    if (ok) {
      showSuccess(
        formState.mode === "create" ? "Goal added." : "Goal updated.",
      );
      setFormState({ open: false, mode: "create", row: null });
    } else {
      showError(goalCollection.error);
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "type", label: "Type" },
    {
      key: "progress",
      label: "Progress",
      render: (row) =>
        row.targetValue != null
          ? `${row.currentValue ?? 0} / ${row.targetValue}`
          : "-",
      searchValue: (row) =>
        `${row.currentValue ?? ""} ${row.targetValue ?? ""}`,
    },
    { key: "targetDate", label: "Target date" },
    {
      key: "achieved",
      label: "Achieved",
      render: (row) => (row.achieved ? "Yes" : "No"),
      searchValue: (row) => (row.achieved ? "yes achieved" : "no pending"),
    },
  ];

  return (
    <>
      <ReferenceList
        title="goals"
        columns={columns}
        rows={goalCollection.page.items}
        loading={goalCollection.loading}
        error={goalCollection.error}
        onAdd={() => setFormState({ open: true, mode: "create", row: null })}
        onEdit={(row) => setFormState({ open: true, mode: "edit", row })}
        onDelete={handleDelete}
        deleteMessage={(row) => `Delete "${row.title}"? This can't be undone.`}
      />
      <EntityFormDialog
        open={formState.open}
        onClose={() => setFormState({ open: false, mode: "create", row: null })}
        title={formState.mode === "create" ? "Add a new goal" : "Edit goal"}
        fields={fields}
        initialValues={formState.row}
        onSubmit={handleSubmit}
        submitLabel={formState.mode === "create" ? "Add" : "Save"}
      />
    </>
  );
});

export default GoalPage;
