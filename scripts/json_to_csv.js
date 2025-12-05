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

    // Extract flattened fields from each transaction
    const rows = transactions.map((tx) => {
      const ops = tx.operations ? tx.operations[0] : {};
      const sourceChain = tx.sourceChain || {};
      const targetChain = tx.targetChain || {};
      const content = ops.content || {};
      const payload = content.payload || {};
      const standardProps = content.standarizedProperties || {};

      return {
        sequence: ops.sequence || "",
        fromChain: sourceChain.chainId || "",
        fromAddress: sourceChain.from || "",
        toChain: targetChain.chainId || "",
        toAddress: standardProps.toAddress || "",
        tokenAddress: standardProps.tokenAddress || "",
        amount: standardProps.amount || "",
        fee: standardProps.fee || "",
        txHashSource: sourceChain.transaction?.txHash || "",
        txHashTarget: targetChain.transaction?.txHash || "",
        status: targetChain.status || "",
        symbol: tx.data?.symbol || "",
        tokenAmount: tx.data?.tokenAmount || "",
        usdAmount: tx.data?.usdAmount || "",
      };
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
