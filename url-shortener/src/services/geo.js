export async function getCoarseGeo() {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 2500);
    const r = await fetch("https://ipapi.co/json/", { signal: ctl.signal });
    clearTimeout(t);
    if (!r.ok) throw new Error();
    const j = await r.json();
    const city = j.city || "";
    const region = j.region || j.region_code || "";
    const country = j.country_name || j.country || "";
    return [city, region, country].filter(Boolean).join(", ") || "Unknown";
  } catch {
    return "Unknown";
  }
}
