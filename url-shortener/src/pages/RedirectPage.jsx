import React, { useEffect, useMemo } from "react";
import { Box, Link as MLink, Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { ShortService } from "../services/shortService";
import logger from "../logger";

const now = () => Date.now();

export default function RedirectPage() {
  const { code } = useParams();
  const entry = useMemo(() => ShortService.findByCode(code), [code]);

  useEffect(() => {
    if (!entry) return;
    if (entry.expiresAt <= now()) return;
    (async () => {
      await ShortService.recordClick(code, "redirect");
      window.location.replace(entry.longUrl);
    })();
  }, [code, entry]);

  if (!entry) {
    logger.warn("redirect_not_found", { code });
    return (
      <CenteredCard title="Short link not found">
        <Typography color="text.secondary">The shortcode “{code}” does not exist in this browser.</Typography>
      </CenteredCard>
    );
  }

  if (entry.expiresAt <= now()) {
    logger.info("redirect_expired", { code });
    return (
      <CenteredCard title="Link expired">
        <Typography color="text.secondary">
          The short link {window.location.origin}/{code} expired at {new Date(entry.expiresAt).toLocaleString()}.
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Go back to{" "}
          <MLink href="/" underline="hover">
            Shortener
          </MLink>
          .
        </Typography>
      </CenteredCard>
    );
  }

  return (
    <CenteredCard title="Redirecting...">
      <Typography>If not redirected, <MLink href={entry.longUrl}>click here</MLink>.</Typography>
    </CenteredCard>
  );
}

function CenteredCard({ title, children }) {
  return (
    <Box sx={{ display: "grid", placeItems: "center", minHeight: "100vh", p: 2 }}>
      <Paper variant="outlined" sx={{ p: 3, maxWidth: 600, textAlign: "center" }}>
        <Typography variant="h6" sx={{ mb: 1 }}>{title}</Typography>
        {children}
      </Paper>
    </Box>
  );
}
