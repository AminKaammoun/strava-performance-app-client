import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import DashboardPage from "./pages/DashboardPage";
import ReferenceTablesPage from "./pages/ReferenceTablesPage";
import SidebarNav from "./components/Sections/SidebarNav";
import TopBar from "./components/Sections/TopBar";
import getTheme from "./theme";
import "./App.css";

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return window.localStorage.getItem("runpulse-theme") || "dark";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("runpulse-theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const muiTheme = useMemo(() => getTheme(theme), [theme]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box className="app-shell" sx={{ display: "flex", minHeight: "100vh" }}>
        <Box component="nav" sx={{ width: { sm: 260 }, flexShrink: { sm: 0 } }}>
          <SidebarNav
            mobileOpen={mobileOpen}
            onClose={() => setMobileOpen(false)}
            variant="permanent"
          />
          <SidebarNav
            mobileOpen={mobileOpen}
            onClose={() => setMobileOpen(false)}
            variant="temporary"
          />
        </Box>

        <Box
          component="main"
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <TopBar
            onMenuClick={() => setMobileOpen(!mobileOpen)}
            theme={theme}
            onThemeToggle={toggleTheme}
          />

          <Box className="content" sx={{ p: { xs: 2, sm: 3 } }}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/items" element={<ReferenceTablesPage />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
