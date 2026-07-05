import {
  AppBar,
  Box,
  Chip,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { DarkMode, LightMode, Menu } from "@mui/icons-material";

function TopBar({ onMenuClick, theme, onThemeToggle }) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ background: "transparent", color: "inherit", boxShadow: "none" }}
    >
      <Toolbar className="topbar" sx={{ borderRadius: 4, mt: 2, mx: 2, px: 2 }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 1, display: { sm: "none" } }}
        >
          <Menu />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Development version
          </Typography>
          <Typography variant="body2" color="text.secondary">
            v0.1 • Strava Performance Application
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip label="V0.1" color="primary" variant="outlined" />
          <IconButton onClick={onThemeToggle} color="inherit">
            {theme === "dark" ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
