# Project Memory

Updated: 2026-07-04

## Current State

This repository now contains an academic paper project workflow for an otome
game research topic. The project has moved from scattered chat outputs into a
more reproducible structure with a main pipeline script and explicit research
directories.

## Research Focus

- Topic: otome games in relation to emotional value, emotional consumption,
  digital intimacy, and business/marketing research.
- Chosen route: Cluster C text-analysis route.
- Data strategy: use public comments/reviews or other approved public text
  exports, not questionnaire survey data.
- Planned unit of analysis: one public text unit.

## Important Files

- `scripts/run_all.py`: main one-command pipeline entrypoint.
- `scripts/run_all.ps1`: PowerShell wrapper for Windows.
- `docs/project_workflow.md`: workflow and current pipeline status.
- `docs/scraping_ethics_note.md`: data collection and publication boundaries.
- `docs/changelog.md`: project change log.
- `research/README.md`: guide to the archived research materials.
- `output/audit/sample_flow.csv`: current sample/artifact flow.
- `output/audit/source_inventory.csv`: source and data-access status.
- `output/audit/variable_provenance.csv`: planned text-label variables.
- `output/results/`: bundled current research outputs.

## Current Pipeline Behavior

Running `scripts/run_all.py` currently:

1. Creates the standard paper-project folders.
2. Bundles existing verified research artifacts into `output/results/`.
3. Writes audit files under `output/audit/`.
4. Writes table shells under `output/tables/`.
5. Writes manuscript scaffold copies under `output/manuscript/`.
6. Logs the run under `output/logs/`.

The pipeline does not yet produce empirical text-analysis results, because no
raw public comment/review files have been added.

## Directory Convention

- `data/raw/`: immutable original inputs.
- `data/interim/`: cleaned or normalized intermediate data.
- `data/analysis/`: analysis-ready files.
- `research/`: curated research archive and scaffolds.
- `scripts/`: reproducible commands.
- `output/`: generated results, audit files, tables, figures, and manuscript
  artifacts.
- `docs/`: project memory, workflow, ethics, and changelog.

## Next Concrete Step

Add an approved first-loop text dataset under:

```text
data/raw/public_text_comments/
```

Recommended first loop:

1. Select one otome game.
2. Select one public platform.
3. Select one event/card-pool window or fixed time window.
4. Collect or export 500-1000 public text units if allowed.
5. Manually code 300 text units to refine the codebook.
6. Extend `scripts/run_all.py` to create normalized text units, anonymized text,
   coding validation, label prevalence, and co-occurrence outputs.
