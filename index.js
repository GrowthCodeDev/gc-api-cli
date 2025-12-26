#!/usr/bin/env node
import fs from "fs";
import path from "path";
import axios from "axios";
import { Command } from "commander";
import { Parser } from "json2csv";
import { envConfig } from "./config.js";

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}

function toArray(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return [data];
  return [{ value: data }];
}

function safeWrite(filePath, content) {
  fs.writeFileSync(filePath, content);
}

async function fetchWithRetry({ url, headers, timeoutMs, retries, retryDelayMs }) {
  let lastErr = null;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const res = await axios.get(url, { headers, timeout: timeoutMs });
      return res;
    } catch (err) {
      lastErr = err;
      const status = err?.response?.status;

      // On retry surtout sur erreurs réseau/timeout/5xx
      const shouldRetry =
        !status || (status >= 500 && status <= 599) || err.code === "ECONNABORTED";

      if (!shouldRetry || attempt === retries + 1) break;

      await new Promise((r) => setTimeout(r, retryDelayMs));
    }
  }

  throw lastErr;
}

const program = new Command();

program
  .name("gc-api")
  .description("Fetch data from an API and export to JSON and/or CSV (GrowthCode).")
  .option("-u, --url <string>", "API URL (overrides API_URL in .env)")
  .option("-k, --key <string>", "API key/token (Bearer). Overrides API_KEY in .env")
  .option(
    "-f, --format <string>",
    "Export format: json | csv | both",
    "both"
  )
  .option("-o, --out <string>", "Output directory", "outputs")
  .option("-n, --name <string>", "Base filename (without extension)", "export")
  .option("-t, --timeout <number>", "Timeout in ms", String(envConfig.timeoutMs))
  .option("-r, --retries <number>", "Retry count on network/5xx", "2")
  .option("--retry-delay <number>", "Retry delay in ms", "600")
  .option("--no-timestamp", "Disable timestamp suffix in filenames")
  .parse(process.argv);

const opts = program.opts();

(async () => {
  try {
    const url = opts.url || envConfig.apiUrl;
    if (!url) {
      throw new Error(
        "API URL manquante. Utilise --url <...> ou configure API_URL dans le fichier .env"
      );
    }

    const token = opts.key ?? envConfig.apiKey;
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const timeoutMs = Number(opts.timeout);
    const retries = Number(opts.retries);
    const retryDelayMs = Number(opts.retryDelay);

    const outDir = path.resolve(process.cwd(), opts.out);
    ensureDir(outDir);

    const suffix = opts.timestamp === false ? "" : `_${nowStamp()}`;
    const baseName = `${opts.name}${suffix}`;

    console.log("—");
    console.log("🚀 GrowthCode API Automation");
    console.log(`• URL: ${url}`);
    console.log(`• Format: ${opts.format}`);
    console.log(`• Output: ${outDir}`);
    console.log(`• Retries: ${retries}`);
    console.log("—");

    const res = await fetchWithRetry({ url, headers, timeoutMs, retries, retryDelayMs });
    const data = res.data;

    const format = String(opts.format).toLowerCase();
    const wantJson = format === "json" || format === "both";
    const wantCsv = format === "csv" || format === "both";

    if (!wantJson && !wantCsv) {
      throw new Error("Format invalide. Utilise: json | csv | both");
    }

    if (wantJson) {
      const jsonPath = path.join(outDir, `${baseName}.json`);
      safeWrite(jsonPath, JSON.stringify(data, null, 2));
      console.log(`✅ JSON export: ${jsonPath}`);
    }

    if (wantCsv) {
      const rows = toArray(data);
      const parser = new Parser();
      const csv = parser.parse(rows);
      const csvPath = path.join(outDir, `${baseName}.csv`);
      safeWrite(csvPath, csv);
      console.log(`✅ CSV export: ${csvPath}`);
    }

    console.log("🎉 Terminé.");
  } catch (err) {
    const status = err?.response?.status;
    const details = err?.response?.data;

    console.error("❌ Erreur :");
    if (status) console.error(`• HTTP ${status}`);
    console.error(`• ${err.message || String(err)}`);

    if (details) {
      const snippet = JSON.stringify(details).slice(0, 300);
      console.error(`• Détails: ${snippet}${snippet.length >= 300 ? "…" : ""}`);
    }

    process.exit(1);
  }
})();
