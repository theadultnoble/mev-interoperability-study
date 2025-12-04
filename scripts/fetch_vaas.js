// TODO: Increase Fetched VAA count (current max: 50 VAAs)
// fetch_vaas.js
import fs from "fs/promises";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import { parseVaas } from "./parse_vaas.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "data", "raw_exports", "vaas.json");
const EMITTER_CHAIN = "2"; // wormhole chain id for ETH in this API (check API docs)
const EMITTER_ADDR = "0x3ee18B2214AFF97000D974cf647E7C347E8fa585"; // replace with Token Bridge emitter (hex) or emitter string
// const params = {
//   page: 1,
//   pageSize: 5,
// };
// API base (example from earlier)
const BASE = "https://api.wormholescan.io/api/v1/vaas";

async function fetchVaasForEmitter(chain, emitter) {
  const url = `${BASE}/${chain}/${emitter}?`;
  // + new URLSearchParams(params).toString();
  console.log("Fetching", url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json; // structure depends on API; likely an array of vaa records
}

async function filterVaasByDestination() {
  const solanaVaas = [];
  try {
    const Vaas = await fetchVaasForEmitter(EMITTER_CHAIN, EMITTER_ADDR);
    if (!Vaas.data || Vaas.data.length === 0) {
      console.log("No VAAs found for this emitter");
      return solanaVaas;
    }
    console.log("Vaas fetched successfully. Count:", Vaas.data.length);
    for (const Vaa of Vaas.data) {
      const parsedVaa = await parseVaas(Vaa.vaa);
      if (parsedVaa.parsedPayload && parsedVaa.parsedPayload.toChain === 1) {
        solanaVaas.push(Vaa);
      }
    }
  } catch (e) {
    throw e;
  }
  console.log(solanaVaas.length, "VAAs destined for Solana found.");
  return solanaVaas;
}

async function main() {
  const vaas = await filterVaasByDestination();

  await fs.mkdir("./data/raw_exports", { recursive: true });
  await fs.writeFile(OUT, JSON.stringify(vaas, null, 2));

  console.log("Saved Solana VAAS:", OUT, `${vaas}`.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
