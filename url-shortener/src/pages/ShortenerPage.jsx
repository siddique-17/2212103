import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Paper, Snackbar, Stack, Typography } from "@mui/material";
import UrlRow from "../components/UrlRow";
import ResultItem from "../components/ResultItem";
import { ShortService } from "../services/shortService";
import logger from "../logger";
import { useNavigate } from "react-router-dom";

export default function ShortenerPage() {
  const [rows, setRows] = useState([{ longUrl: "", validityMins: "", customCode: "", touched: false, errors: {} }]);
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [snack, setSnack] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
    
  useEffect(() => { logger.info("page_view", { page: "shortener" }); }, []);

  const canAdd = rows.length < 5;
  const addRow = () => setRows(r => [...r, { longUrl: "", validityMins: "", customCode: "", touched: false, errors: {} }]);
  const updateRow = (i, v) => setRows(r => r.map((row, idx) => (idx === i ? v : row)));
  const removeRow = (i) => setRows(r => r.filter((_, idx) => idx !== i));

  const validateRow = (row) => {
    const errors = {};
    try { new URL(row.longUrl); } catch { errors.longUrl = "Enter a valid http(s) URL"; }
    if (row.customCode && !/^[A-Za-z0-9_-]{3,20}$/.test(row.customCode)) errors.customCode = "Invalid shortcode";
    return errors;
  };

  const validateAll = () => {
    let ok = true;
    const next = rows.map((row) => {
      const errors = validateRow(row);
      if (Object.keys(errors).length > 0) ok = false;
      return { ...row, touched: true, errors };
    });
    setRows(next);
    return ok;
  };

  const handleShorten = async () => {
    if (!validateAll()) return;
    setBusy(true);
    setResults([]);
    try {
      const payload = rows.map((r) => ({
        longUrl: r.longUrl.trim(),
        validityMins: r.validityMins ? parseInt(r.validityMins, 10) : undefined,
        customCode: r.customCode?.trim() || undefined
      }));
      const res = await ShortService.createMany(payload, { action: "batch_shorten" });
      setResults(res);
      setSnack(res.some(x => x.ok) ? "Short links created" : "No links created");
    } finally {
      setBusy(false);
    }
  };

  const copy = async (text) => { try { await navigator.clipboard.writeText(text); setCopied(true); } catch {} };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 1 }}>URL Shortener</Typography>
      <Typography sx={{ mb: 2, color: "text.secondary" }}>
        Provide up to 5 URLs. Optional validity (minutes, defaults to 30) and optional custom shortcode.
      </Typography>

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack spacing={1}>
          {rows.map((row, i) => (
            <div key={i}>
              <UrlRow idx={i} value={row} onChange={(v) => updateRow(i, v)} onRemove={rows.length > 1 ? () => removeRow(i) : null} />
            </div>
          ))}
        </Stack>
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button onClick={addRow} disabled={!canAdd}>Add URL</Button>
          <Button onClick={handleShorten} disabled={busy}>Create Short Links</Button>
          <Button color="secondary" onClick={() => navigate("/stats")}>View Statistics</Button>
        </Box>
      </Paper>

      {results.length > 0 && (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Results</Typography>
          <Stack spacing={1}>
            {results.map((r, i) => r.ok
              ? <ResultItem key={i} entry={r.entry} copy={copy} navigate={navigate} />
              : <Alert key={i} severity="error">{r.error}</Alert>)}
          </Stack>
        </Paper>
      )}

      <Snackbar open={!!snack || copied} autoHideDuration={2000} onClose={() => { setSnack(""); setCopied(false); }}>
        <Alert severity="success" variant="filled">{copied ? "Copied!" : snack}</Alert>
      </Snackbar>
    </Box>
  );
}
