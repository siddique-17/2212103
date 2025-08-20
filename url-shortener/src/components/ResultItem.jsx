import React from "react";
import { Paper, Grid, Typography, Chip, Link as MLink, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
const now = () => Date.now();
export default function ResultItem({ entry, copy, navigate }) {
  const short = `${window.location.origin}/${entry.code}`;
  const expired = entry.expiresAt <= now();
  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography noWrap title={entry.longUrl}>
            Long: <MLink href={entry.longUrl} target="_blank" rel="noreferrer">{entry.longUrl}</MLink>
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography>
            <Chip color={expired ? "default" : "success"} label={expired ? "Expired" : "Active"} size="small" sx={{ mr: 1 }} />
            Short:{" "}
            <MLink href={short} target="_blank" rel="noreferrer">{short}</MLink>
            <Tooltip title="Copy">
              <IconButton onClick={() => copy(short)} size="small" sx={{ ml: 1 }}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Open stats">
              <IconButton onClick={() => navigate(`/stats?focus=${entry.code}`)} size="small">
                <QueryStatsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">
            Created: {new Date(entry.createdAt).toLocaleString()} • Expires: {new Date(entry.expiresAt).toLocaleString()}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
