import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import ReferenceTablesPage from "./pages/ReferenceTablesPage";
import SidebarNav from "./components/Sections/SidebarNav";
import TopBar from "./components/Sections/TopBar";
import "./App.css";

function HomePage({ toggleTheme, theme }) {
  return (
    <div className="dashboard">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Strava-powered running analytics</p>
          <h2>Track every mile and train smarter.</h2>
          <p>
            Bring your runs, pace, mileage, and recovery trends into one calm
            dashboard built for performance analysis.
          </p>
          <div className="hero-actions">
            <Link to="/items" className="btn btn-primary">
              Open training log
            </Link>
            <button className="btn btn-secondary" onClick={toggleTheme}>
              Switch to {theme === "dark" ? "light" : "dark"} mode
            </button>
          </div>
        </div>
        <div className="hero-panel">
          <div className="metric-row">
            <span className="metric-label">Weekly mileage</span>
            <strong>42.6 km</strong>
          </div>
          <div className="metric-row">
            <span className="metric-label">Avg pace</span>
            <strong>5:03 /km</strong>
          </div>
          <div className="metric-row">
            <span className="metric-label">Longest run</span>
            <strong>18.2 km</strong>
          </div>
        </div>
      </section>

      <section className="card-grid">
        <article className="card">
          <p className="eyebrow">Recovery</p>
          <h3>Ready to train</h3>
          <p>Sleep and fatigue trend are looking balanced this week.</p>
        </article>
        <article className="card">
          <p className="eyebrow">Form</p>
          <h3>Tempo rhythm</h3>
          <p>Your recent sessions show improved consistency and pacing.</p>
        </article>
        <article className="card">
          <p className="eyebrow">Next step</p>
          <h3>Strava sync</h3>
          <p>Connect your Strava account to unlock live activity insights.</p>
        </article>
      </section>
    </div>
  );
}

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

  return (
    <Box className="app-shell" sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
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
            <Route
              path="/"
              element={<HomePage toggleTheme={toggleTheme} theme={theme} />}
            />
            <Route path="/items" element={<ReferenceTablesPage />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
