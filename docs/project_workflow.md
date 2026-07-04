# Project Workflow

Run all reproducible project packaging steps with:

```powershell
./scripts/run_all.ps1
```

or:

```powershell
python scripts/run_all.py
```

## Current Pipeline Status

- Current route: Cluster C text-analysis route.
- Current unit planned for future empirical analysis: one public text unit.
- Raw public comment/review files are not yet present.
- This run packages existing verified research outputs and creates audit scaffolds.

## Main Outputs

- `output/results/`: bundled research results for sharing.
- `output/audit/source_inventory.csv`: source and data-access status.
- `output/audit/sample_flow.csv`: row/artifact flow.
- `output/audit/variable_provenance.csv`: planned text-label variables.
- `output/audit/output_inventory.csv`: file inventory with SHA-256 hashes.
- `output/tables/`: table shells for the future empirical paper.
- `output/logs/run_all_20260704_161356.log`: run log.

## Next Data Step

Put approved public comment/review exports under `data/raw/public_text_comments/`.
Do not overwrite raw files. Then extend `scripts/run_all.py` with parse,
deduplicate, anonymize, code, validate, and export stages.
