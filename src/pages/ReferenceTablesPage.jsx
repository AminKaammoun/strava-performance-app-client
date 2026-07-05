import { useState } from "react";
import { Box, Chip, Stack } from "@mui/material";
import { TableRows } from "@mui/icons-material";
import ItemsPage from "./ItemsPage";
import ActivitiesPage from "./ActivitiesPage";
import CountryPage from "./CountryPage";
import CityPage from "./CityPage";
import RacePage from "./RacePage";
import ShoePage from "./ShoesPage";
import GoalPage from "./GoalPage";

// Each entry maps a chip to the page component that owns that table's
// collection/service. Adding a new reference table = add its page file
// and one line here.
const referenceTables = [
  { key: "items", label: "items", Component: ItemsPage },
  { key: "activities", label: "activities", Component: ActivitiesPage },
  { key: "countries", label: "countries", Component: CountryPage },
  { key: "cities", label: "cities", Component: CityPage },
  { key: "races", label: "races", Component: RacePage },
  { key: "shoes", label: "shoes", Component: ShoePage },
  { key: "goals", label: "goals", Component: GoalPage },
];

function ReferenceTablesPage() {
  const [selectedTable, setSelectedTable] = useState(referenceTables[0].key);

  const active =
    referenceTables.find((table) => table.key === selectedTable) ??
    referenceTables[0];
  const ActivePage = active.Component;

  return (
    <Box sx={{ display: "grid", gap: 3, width: "100%" }}>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {referenceTables.map((table) => (
          <Chip
            key={table.key}
            icon={<TableRows />}
            label={table.label}
            variant={selectedTable === table.key ? "filled" : "outlined"}
            color={selectedTable === table.key ? "primary" : "default"}
            onClick={() => setSelectedTable(table.key)}
          />
        ))}
      </Stack>

      <ActivePage />
    </Box>
  );
}

export default ReferenceTablesPage;
