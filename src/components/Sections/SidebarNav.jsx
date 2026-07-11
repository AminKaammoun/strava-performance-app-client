import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { DirectionsRun, Dashboard, Storage } from "@mui/icons-material";
import { NavLink } from "react-router-dom";

const drawerWidth = 260;

const navItems = [
  { label: "Dashboard", path: "/", icon: <Dashboard /> },
  { label: "Reference tables", path: "/items", icon: <Storage /> },
];

function SidebarNav({ mobileOpen, onClose, variant = "permanent" }) {
  const drawer = (
    <Box
      className="sidebar"
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box
        className="sidebar-brand"
        sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5 }}
      >
        <Box className="brand-mark">
          <DirectionsRun fontSize="large" />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            SPA
          </Typography>
        </Box>
      </Box>

      <List sx={{ px: 1.5 }}>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              className="sidebar-link"
              onClick={onClose}
              sx={{ borderRadius: 3, py: 1.2 }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: "auto", p: 2.5 }}>
        <Box className="sidebar-card">
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Reference tables
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Select a table to inspect and manage your data.
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={mobileOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: {
          xs: variant === "temporary" ? "block" : "none",
          sm: variant === "temporary" ? "none" : "block",
        },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: drawerWidth,
          border: "none",
        },
      }}
    >
      {drawer}
    </Drawer>
  );
}

export default SidebarNav;
