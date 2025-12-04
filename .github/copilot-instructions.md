# Copilot Instructions for MEV Cross-Chain Study Repository

## Project Overview

This repository contains a research study quantifying **Maximum Extractable Value (MEV)** across blockchain networks, with a focus on cross-chain MEV opportunities between **Solana and Ethereum**. The goal is to measure economic impacts of MEV extraction through empirical data analysis and academic publication.

## Architecture & Data Pipeline

### Key Components

1. **Data Collection Layer** (`data/`)

   - `dune_queries/` - SQL queries for Dune Analytics (primary blockchain data source)
   - `raw_exports/` - JSON/CSV exports from Dune and Wormhole APIs

2. **Processing & Analysis Layer** (`analysis/`)

   - Scripts for statistical analysis and MEV quantification
   - Data transformation from raw exports to analysis-ready formats

3. **Research Output** (`paper/`)
   - `draft.md` - Main academic paper draft
   - `references.md` - Bibliography and citations
   - `diagrams/` - Visualizations and figures for publication

### Data Flow

```
Dune Analytics (SQL) → raw_exports → analysis scripts → results → paper draft
Wormhole API (VAAs) → raw_exports → parse & filter → quantification
```

## Critical Patterns & Conventions

### VAA Processing (Wormhole Cross-Chain Messages)

- **File**: `scripts/fetch_vaas.js`, `scripts/parse_vaas.js`
- VAAs (Verified Action Approvals) are cross-chain messages from Wormhole bridge
- VAA processing requires:
  1. Fetch from `https://api.wormholescan.io/api/v1/vaas` with emitter chain/address
  2. Parse VAA payload to extract destination chain (e.g., chain ID 1 = Solana)
  3. Filter by destination for Solana-bound transactions
- Configuration: Emitter chain/address must be updated for each bridge contract studied
- Output: Filtered VAAs saved to `data/raw_exports/vaas.json`

### Dune Analytics Integration

- Queries stored in `data/dune_queries/` for reproducibility
- Exports saved to `data/raw_exports/` with descriptive naming
- Use Dune's Solana and Ethereum datasets
- Include query metadata (date run, parameters) for version control

### Development & Runtime

- **Node.js Scripts**: Requires Node 18+ or `node-fetch` polyfill for ES6 imports
- **Error Handling**: Scripts log HTTP errors from APIs; check HTTP status codes
- **File Organization**: All data exports must be placed in `data/raw_exports/` to avoid version control conflicts

## Key External Dependencies

- **Dune Analytics API**: Primary source for blockchain transaction data
- **Wormhole Scan API** (`https://api.wormholescan.io`): Cross-chain bridge data
- **Node.js Ecosystem**: ES6 modules with dynamic imports

## When Extending This Codebase

1. **Adding new data sources**: Create fetch scripts in `scripts/`, store outputs in `data/raw_exports/`
2. **Writing analysis scripts**: Place in `analysis/` with clear input/output specifications
3. **Updating paper**: Reference code with paths like `scripts/fetch_vaas.js` for reproducibility
4. **Querying Dune**: Save SQL queries in `data/dune_queries/` with naming convention `{network}_{metric}_{date}.sql`
