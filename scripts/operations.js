import fs from "fs/promises";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const BASE = "https://api.wormholescan.io/api/v1/operations";
const TIMEOUT_MS = 10000; // 10 second timeout per request

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VAAS_PATH = path.join(
  __dirname,
  "..",
  "data",
  "raw_exports",
  "vaas.json"
);
const TRANSACTIONS_PATH = path.join(
  __dirname,
  "..",
  "data",
  "raw_exports",
  "transactions.json"
);

async function loadOperationsFromVaas() {
  try {
    const raw = await fs.readFile(VAAS_PATH, "utf8");
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr))
      throw new Error("vaas.json must contain an array of VAAs");
    return arr;
  } catch (e) {
    console.error("Failed to load vaas.json:", e.message);
    return [];
  }
}

async function fetchOperations(operations) {
  const transactions = [];
  if (operations && operations.length > 0) {
    for (const operation of operations) {
      try {
        console.log(`Fetching operations for txHash: ${operation.txHash}`);
        const url = `${BASE}?${new URLSearchParams({
          txHash: operation.txHash,
        }).toString()}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`);
        const json = await res.json();
        transactions.push(json);
        console.log(`✓ Operation ${operation.sequence} fetched`);
      } catch (e) {
        console.error(
          `✗ Failed to fetch operation ${operation.sequence}:`,
          e.message
        );
      }
    }
  }
  return transactions;
}

async function main() {
  console.time("fetchOperations");
  const operations = await loadOperationsFromVaas();
  const result = await fetchOperations(operations);
  console.timeEnd("fetchOperations");
  console.log(`\nFetched ${result.length} operation(s)`);

  await fs.mkdir(path.dirname(TRANSACTIONS_PATH), { recursive: true });
  await fs.writeFile(TRANSACTIONS_PATH, JSON.stringify(result, null, 2));
  console.log(`Saved transactions to: ${TRANSACTIONS_PATH}`);
}

main().catch((e) => {
  console.error("Error in main:", e);
  process.exit(1);
});
