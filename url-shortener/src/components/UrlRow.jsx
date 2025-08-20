import React from "react";
import { Grid, TextField, IconButton, Tooltip } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
export default function UrlRow({ idx, value, onChange, onRemove }) {
  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label={`Original URL #${idx + 1}`}
          value={value.longUrl}
          onChange={(e) => onChange({ ...value, longUrl: e.target.value })}
          placeholder="https://example.com/page"
          error={value.touched && !!value.errors.longUrl}
          helperText={value.touched ? value.errors.longUrl : ""}
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          fullWidth
          label="Validity (mins)"
          type="number"
          value={value.validityMins}
          onChange={(e) => onChange({ ...value, validityMins: e.target.value })}
          InputProps={{ inputProps: { min: 1, max: 10080 } }}
          helperText="Defaults to 30"
        />
      </Grid>
      <Grid item xs={6} md={2}>
        <TextField
          fullWidth
          label="Custom shortcode"
          value={value.customCode}
          onChange={(e) => onChange({ ...value, customCode: e.target.value })}
          placeholder="my-short"
          error={value.touched && !!value.errors.customCode}
          helperText={value.touched ? value.errors.customCode : "3-20 chars a-zA-Z0-9_-"}
        />
      </Grid>
      <Grid item xs={12} md={1}>
        <Tooltip title="Remove">
          <span>
            <IconButton color="error" onClick={onRemove} disabled={!onRemove}>
              <DeleteOutlineIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Grid>
    </Grid>
  );
}
