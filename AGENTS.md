# Project Memory For Codex Agents

## Project

This is an academic research project on otome games, emotional value, emotional
consumption, digital intimacy, and business/marketing scholarship.

Current preferred design route: Cluster C text-analysis route. The project
should use scraped/exported public comments or reviews for text analysis rather
than questionnaire survey data.

## Current Research Logic

- Broad topic: otome games and business/marketing research.
- Core constructs: emotional value, emotional consumption, digital intimacy,
  digital self-extension, character attachment, continued consumption, and
  commercialization resistance.
- Empirical unit planned for future analysis: one public text unit, such as a
  public app review, TapTap review, post, reply, or comment.
- Claims should describe public textual expression, not player psychology or
  causal effects, unless additional evidence supports stronger claims.

## Repository Layout

- `research/`: curated research archive from prior Codex work.
- `scripts/run_all.py`: main one-command project pipeline entrypoint.
- `scripts/run_all.ps1`: Windows wrapper for the main pipeline.
- `data/raw/`: immutable raw inputs. Put future approved public comment/review
  exports in `data/raw/public_text_comments/`.
- `data/interim/`: parsed, normalized, cleaned, or anonymized intermediate data.
- `data/analysis/`: model-ready or table-ready analysis files.
- `output/results/`: bundled current results.
- `output/audit/`: source inventory, sample flow, variable provenance, and
  output inventory.
- `output/tables/`: table shells for the empirical paper.
- `output/manuscript/`: manuscript scaffold outputs.
- `docs/`: workflow, ethics, changelog, and project memory.

## Reproducibility Command

Run:

```powershell
./scripts/run_all.ps1
```

or:

```powershell
python scripts/run_all.py
```

The current pipeline packages existing research artifacts and writes audit
files. It does not yet parse or analyze real public comment data because raw
comment/review files are not present.

## Data And Ethics Boundaries

- Never overwrite files under `data/raw/`.
- Use only public content collected according to platform rules.
- Do not bypass login walls, CAPTCHA, paywalls, rate limits, or anti-scraping
  systems.
- Do not collect private messages, private groups, or non-public accounts.
- Hash or remove user identifiers before analysis.
- Avoid publishing long verbatim comments that can be searched back to users.

## Next Work

1. Select one platform, one otome game, and one event or time window.
2. Place approved raw exports under `data/raw/public_text_comments/`.
3. Extend `scripts/run_all.py` with parse, normalize, deduplicate, anonymize,
   code, validate, and export stages.
4. Generate real text-analysis outputs: source inventory, sample flow, coding
   validation, label prevalence, co-occurrence matrix, and de-identified
   qualitative examples.
