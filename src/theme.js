import { createTheme } from "@mui/material/styles";

// Mirrors the CSS custom properties in index.css so the hand-styled
// elements (.panel, .hero-card, .sidebar...) and MUI's own components
// (Table, Typography, Chip, AppBar, LinearProgress...) agree on colors
// instead of MUI silently staying on its light-mode defaults.
const palettes = {
  light: {
    mode: "light",
    background: { default: "#f4f7fb", paper: "#ffffff" },
    text: { primary: "#0f172a", secondary: "#64748b" },
    divider: "rgba(15, 23, 42, 0.1)",
    primary: { main: "#4f46e5", dark: "#4338ca" },
    secondary: { main: "#2dd4bf" },
    error: { main: "#ef4444" },
  },
  dark: {
    mode: "dark",
    background: { default: "#020617", paper: "#111827" },
    text: { primary: "#f8fafc", secondary: "#cbd5e1" },
    divider: "rgba(148, 163, 184, 0.22)",
    primary: { main: "#818cf8", dark: "#6366f1" },
    secondary: { main: "#34d399" },
    error: { main: "#f87171" },
  },
};

export function getTheme(mode) {
  return createTheme({
    palette: palettes[mode] ?? palettes.light,
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: [
        "Inter",
        '"Segoe UI"',
        "system-ui",
        "-apple-system",
        "sans-serif",
      ].join(","),
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          // index.css already paints the body (gradient + --bg); don't let
          // CssBaseline's own background win the fight in dark mode.
          body: { backgroundColor: "transparent" },
        },
      },
      MuiPaper: {
        styleOverrides: {
          // Turns off MUI's dark-mode tonal overlay so our own --surface /
          // --surface-strong backgrounds render as intended.
          root: { backgroundImage: "none" },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
    },
  });
}

export default getTheme;
