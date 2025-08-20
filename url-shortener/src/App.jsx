import React from "react";
import { Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function App({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const tab = location.pathname.startsWith("/stats") ? 1 : 0;

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          URL Shortener
        </Typography>
        <Tabs value={tab} onChange={(_, v) => navigate(v === 0 ? "/" : "/stats")}>
          <Tab label="Shorten" />
          <Tab label="Statistics" />
        </Tabs>
        <Divider sx={{ mt: 1 }} />
      </Box>
      {children}
      <Box sx={{ mt: 6, color: "text.secondary" }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="caption">
          Runs entirely on the client. Data stored in localStorage. Logging via custom middleware.
        </Typography>
      </Box>
    </Box>
  );
}
