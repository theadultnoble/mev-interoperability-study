# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a research project studying Maximum Extractable Value (MEV) across different blockchain networks and cross-chain environments. The project aims to quantify the economic impacts of cross-chain MEV extraction through data analysis and academic paper writing.

## Repository Structure

```
.
├── analysis/           # Analysis scripts and notebooks
│   └── scripts/        # Data processing and statistical analysis scripts
├── data/              # Data collection and storage
│   ├── dune_queries/  # Dune Analytics SQL queries for blockchain data
│   └── raw_exports/   # Raw data exports from various sources
└── paper/             # Research paper and documentation
    ├── diagrams/      # Figures and visualizations for the paper
    ├── draft.md       # Main paper draft
    └── references.md  # Bibliography and citations
```

## Architecture

### Data Pipeline
1. **Data Collection**: Blockchain data is queried from Dune Analytics (queries stored in `data/dune_queries/`) and exported to `data/raw_exports/`
2. **Data Processing**: Scripts in `analysis/scripts/` process raw data and perform statistical analysis
3. **Paper Production**: Results are documented in `paper/draft.md` with supporting visualizations in `paper/diagrams/`

### Key Components
- **Dune Analytics Integration**: Primary data source for blockchain transaction data and MEV metrics
- **Analysis Layer**: Statistical analysis and MEV quantification algorithms
- **Documentation Layer**: Academic paper draft and reference management

## Development Workflow

Since this is a research project in early stages:
- The repository structure is established but most directories are empty
- Development will primarily involve data collection scripts, analysis code, and paper writing
- Data files from Dune Analytics should be placed in `data/raw_exports/`
- SQL queries for Dune should be saved in `data/dune_queries/` for reproducibility

## Research Focus Areas

1. MEV patterns across multiple blockchain networks
2. Cross-chain MEV opportunities and extraction mechanisms
3. Economic impact quantification of MEV activities
4. Network security and user experience implications
5. Comparison between different blockchain architectures
