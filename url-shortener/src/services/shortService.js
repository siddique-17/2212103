import { Store } from "./store";
import { getCoarseGeo } from "./geo";
import logger from "../logger";

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const randomCode = (len = 7) => Array.from({ length: len }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
const isValidUrl = (v) => {
  try { const u = new URL(v); return u.protocol === "http:" || u.protocol === "https:"; } catch { return false; }
};
const isValidShortcode = (c) => /^[A-Za-z0-9_-]{3,20}$/.test(c || "");
const now = () => Date.now();
const minutesFromNow = (m) => now() + m * 60 * 1000;

export const ShortService = {
  createMany: async (items, ctx) => {
    const res = [];
    const log = logger.child({ module: "ShortService", ...ctx });
    for (const input of items) {
      try {
        if (!isValidUrl(input.longUrl)) {
          res.push({ ok: false, error: "Invalid URL", input });
          log.warn("invalid_url", { longUrl: input.longUrl });
          continue;
        }
        let validity = parseInt(input.validityMins, 10);
        if (isNaN(validity) || validity <= 0) validity = 30;

        let code;
        if (input.customCode) {
          if (!isValidShortcode(input.customCode)) {
            res.push({ ok: false, error: "Invalid shortcode. Use 3-20 chars (a-z, A-Z, 0-9, _,-)" });
            log.warn("invalid_shortcode", { customCode: input.customCode });
            continue;
          }
          if (Store.exists(input.customCode)) {
            res.push({ ok: false, error: "Shortcode already in use" });
            log.warn("shortcode_collision", { customCode: input.customCode });
            continue;
          }
          code = input.customCode;
        } else {
          let tries = 0;
          do { code = randomCode(7); tries++; } while (Store.exists(code) && tries < 5);
          while (Store.exists(code)) code = randomCode(8);
        }

        const entry = {
          code,
          longUrl: input.longUrl.trim(),
          createdAt: now(),
          expiresAt: minutesFromNow(validity),
          clicks: []
        };
        Store.put(entry);
        res.push({ ok: true, entry });
        log.info("short_created", { code });
      } catch (e) {
        res.push({ ok: false, error: "Unexpected error" });
        log.error("create_error", { error: String(e) });
      }
    }
    return res;
  },

  all: () => Object.values(Store.getAll()).sort((a, b) => b.createdAt - a.createdAt),
  findByCode: (code) => Store.get(code),

  async recordClick(code, source = "redirect") {
    const entry = Store.get(code);
    if (!entry) return false;
    const geo = await getCoarseGeo();
    entry.clicks.push({
      at: Date.now(),
      source,
      referrer: document.referrer || "",
      userAgent: navigator.userAgent || "",
      geo
    });
    Store.put(entry);
    logger.info("click_recorded", { code, source, geo });
    return true;
  },

  delete(code) {
    Store.remove(code);
    logger.info("short_deleted", { code });
  }
};
