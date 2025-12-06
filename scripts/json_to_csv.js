import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANSACTIONS_PATH = path.join(
  __dirname,
  "..",
  "data",
  "raw_exports",
  "transactions.json"
);
const CSV_PATH = path.join(
  __dirname,
  "..",
  "data",
  "raw_exports",
  "transactions.csv"
);

async function jsonToCsv() {
  try {
    // Load transactions JSON
    const raw = await fs.readFile(TRANSACTIONS_PATH, "utf8");
    const transactions = JSON.parse(raw);

    if (!Array.isArray(transactions)) {
      throw new Error("transactions.json must contain an array");
    }

    // Flatten: each transaction has operations array
    // Each operation contains sourceChain, targetChain, data
    const rows = [];
    transactions.forEach((tx) => {
      const operations = tx.operations || [];

      operations.forEach((ops) => {
        const sourceChain = ops.sourceChain || {};
        const targetChain = ops.targetChain || {};
        const txData = ops.data || {};
        const content = ops.content || {};
        const payload = content.payload || {};
        const standardProps = content.standarizedProperties || {};
        const vaa = ops.vaa || {};

        rows.push({
          sequence: ops.sequence || "",
          id: ops.id || "",
          emitterChain: ops.emitterChain || "",
          fromChain: sourceChain.chainId || "",
          fromAddress: sourceChain.from || "",
          toChain: targetChain.chainId || "",
          toAddress: standardProps.toAddress || targetChain.to || "",
          tokenAddress: standardProps.tokenAddress || "",
          amount: standardProps.amount || payload.amount || "",
          fee: standardProps.fee || payload.fee || "",
          symbol: txData.symbol || "",
          tokenAmount: txData.tokenAmount || "",
          usdAmount: txData.usdAmount || "",
          txHashSource: sourceChain.transaction?.txHash || "",
          txHashTarget: targetChain.transaction?.txHash || "",
          statusSource: sourceChain.status || "",
          statusTarget: targetChain.status || "",
          feeSourceUSD: sourceChain.feeUSD || "",
          feeTargetUSD: targetChain.feeUSD || "",
          timestampSource: sourceChain.timestamp || "",
          timestampTarget: targetChain.timestamp || "",
          payloadType: payload.payloadType || "",
          appId: standardProps.appIds ? standardProps.appIds.join("|") : "",
        });
      });
    });

    if (rows.length === 0) {
      console.log("No transactions to export");
      return;
    }

    // Generate CSV header
    const headers = Object.keys(rows[0]);
    const escapeCsv = (val) => {
      if (!val) return "";
      const str = String(val);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvLines = [
      headers.join(","),
      ...rows.map((row) => headers.map((h) => escapeCsv(row[h])).join(",")),
    ];

    const csv = csvLines.join("\n");
    await fs.writeFile(CSV_PATH, csv);
    console.log(`✓ Exported ${rows.length} transactions to ${CSV_PATH}`);
  } catch (e) {
    console.error("Error converting JSON to CSV:", e.message);
    process.exit(1);
  }
}

jsonToCsv();
