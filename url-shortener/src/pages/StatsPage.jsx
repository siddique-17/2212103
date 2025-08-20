import React, { useEffect, useMemo, useState } from "react";
import { Alert, Badge, Box, Button, Chip, Divider, Grid, IconButton, Link as MLink, Paper, Stack, TextField, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { ShortService } from "../services/shortService";
import logger from "../logger";
import { useNavigate } from "react-router-dom";

const now = () => Date.now();
const shortBase = () => `${window.location.protocol}//${window.location.host}`;

export default function StatsPage() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const refresh = () => setItems(ShortService.all());
  useEffect(() => { refresh(); logger.info("page_view", { page: "stats" }); }, []);

  const handleDelete = (code) => { ShortService.delete(code); refresh(); };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Shortener Statistics</Typography>
      <Stack spacing={2}>
        {items.length === 0 && <Alert severity="info">No shortened URLs yet. Create some first.</Alert>}
        {items.map((item) => {
          const short = `${shortBase()}/${item.code}`;
          const active = item.expiresAt > now();
          return (
            <Paper id={`stat-${item.code}`} key={item.code} variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} md={7}>
                  <Typography noWrap title={item.longUrl}>
                    <Chip size="small" color={active ? "success" : "default"} label={active ? "Active" : "Expired"} />{" "}
                    <strong style={{ marginLeft: 8 }}>{item.code}</strong> →{" "}
                    <MLink href={item.longUrl} target="_blank" rel="noreferrer">{item.longUrl}</MLink>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created: {new Date(item.createdAt).toLocaleString()} • Expires: {new Date(item.expiresAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                    <Badge color="primary" badgeContent={item.clicks.length} showZero>
                      <Chip label="Clicks" />
                    </Badge>
                    <TextField
                      value={short}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <IconButton href={short} target="_blank" rel="noreferrer">
                            <OpenInNewIcon fontSize="small" />
                          </IconButton>
                        )
                      }}
                    />
                    <IconButton color="error" onClick={() => handleDelete(item.code)}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Detailed Clicks</Typography>
                  {item.clicks.length === 0 ? (
                    <Typography color="text.secondary">No clicks yet.</Typography>
                  ) : (
                    <Stack spacing={1}>
                      {item.clicks.slice().reverse().map((c, idx) => (
                        <Paper key={idx} variant="outlined" sx={{ p: 1 }}>
                          <Grid container spacing={1}>
                            <Grid item xs={12} md={4}><Typography variant="body2">Time: {new Date(c.at).toLocaleString()}</Typography></Grid>
                            <Grid item xs={12} md={3}><Typography variant="body2">Source: {c.source}</Typography></Grid>
                            <Grid item xs={12} md={5}><Typography variant="body2">Geo: {c.geo}</Typography></Grid>
                            {c.referrer && (
                              <Grid item xs={12}>
                                <Typography variant="caption" color="text.secondary">Referrer: {c.referrer}</Typography>
                              </Grid>
                            )}
                          </Grid>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </Grid>
              </Grid>
            </Paper>
          );
        })}
      </Stack>
      <Box sx={{ mt: 2 }}>
        <Button color="secondary" onClick={() => navigate("/")}>Back to Shortener</Button>
      </Box>
    </Box>
  );
}
