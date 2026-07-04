from __future__ import annotations

import csv
import hashlib
import json
import shutil
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RESEARCH = ROOT / "research"
DATA = ROOT / "data"
OUTPUT = ROOT / "output"
DOCS = ROOT / "docs"

ROUTE_ID = "cluster_c_text_analysis"
DESIGN_SOURCE = "research/study_design/cluster_c_text_analysis_route/cluster_c_text_analysis_design_brief.md"
TARGET_INQUIRY = (
    "Public comment/review text expressions about otome games, emotional value, "
    "emotional consumption, digital intimacy, and continued consumption."
)


def rel(path: Path) -> str:
    return path.resolve().relative_to(ROOT.resolve()).as_posix()


def ensure_dirs() -> None:
    dirs = [
        DATA / "raw" / "literature_sources",
        DATA / "raw" / "public_text_comments",
        DATA / "interim" / "literature",
        DATA / "interim" / "text_units",
        DATA / "analysis",
        OUTPUT / "audit",
        OUTPUT / "logs",
        OUTPUT / "tables",
        OUTPUT / "figures",
        OUTPUT / "manuscript",
        OUTPUT / "results" / "literature",
        OUTPUT / "results" / "methods_review",
        OUTPUT / "results" / "writing_scaffold",
        OUTPUT / "results" / "study_design" / "cluster_c_survey_route",
        OUTPUT / "results" / "study_design" / "cluster_c_text_analysis_route",
        OUTPUT / "results" / "manuscript",
        DOCS,
    ]
    for directory in dirs:
        directory.mkdir(parents=True, exist_ok=True)


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def copy_file(src: Path, dst: Path, copied: list[dict[str, str]]) -> None:
    if not src.exists():
        copied.append(
            {
                "source_path": rel(src),
                "output_path": rel(dst),
                "category": "missing",
                "bytes": "0",
                "sha256": "missing",
                "status": "missing",
            }
        )
        return
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
    copied.append(
        {
            "source_path": rel(src),
            "output_path": rel(dst),
            "category": infer_category(dst),
            "bytes": str(dst.stat().st_size),
            "sha256": sha256(dst),
            "status": "copied",
        }
    )


def copy_glob(src_dir: Path, pattern: str, dst_dir: Path, copied: list[dict[str, str]]) -> None:
    for src in sorted(src_dir.glob(pattern)):
        if src.is_file():
            copy_file(src, dst_dir / src.name, copied)


def infer_category(path: Path) -> str:
    parts = path.as_posix().split("/")
    if "literature" in parts:
        return "literature"
    if "methods_review" in parts:
        return "methods_review"
    if "writing_scaffold" in parts:
        return "writing_scaffold"
    if "study_design" in parts:
        return "study_design"
    if "manuscript" in parts:
        return "manuscript"
    return "other"


def write_csv(path: Path, rows: list[dict[str, object]], fieldnames: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def write_readme_files() -> None:
    (DATA / "raw" / "README.md").write_text(
        """# Raw Data

Raw data are immutable. Put source files here before running analysis scripts.

- `literature_sources/`: PDFs, exported citation files, or source metadata used for the literature matrix.
- `public_text_comments/`: public comment/review exports collected under the ethics and platform rules in `docs/scraping_ethics_note.md`.

Do not edit raw files in place. Create cleaned or normalized files under `data/interim/`.
""",
        encoding="utf-8",
    )
    (DATA / "interim" / "README.md").write_text(
        """# Interim Data

This folder is for normalized or cleaned files that are not yet model-ready.

Expected future text-analysis outputs:

- `text_units_normalized.csv`
- `text_units_anonymized.csv`
- `codebook_sample.csv`
""",
        encoding="utf-8",
    )
    (DATA / "analysis" / "README.md").write_text(
        """# Analysis Data

This folder is for model-ready datasets. The current project has not yet collected
raw public comments/reviews, so the first run creates an artifact index and audit
files rather than a final text-analysis sample.
""",
        encoding="utf-8",
    )


def build_result_bundle() -> list[dict[str, str]]:
    copied: list[dict[str, str]] = []

    copy_glob(
        RESEARCH / "literature" / "matrices",
        "*.xlsx",
        OUTPUT / "results" / "literature",
        copied,
    )
    copy_glob(
        RESEARCH / "literature" / "previews",
        "*.png",
        OUTPUT / "results" / "literature",
        copied,
    )
    copy_glob(
        RESEARCH / "methods_review",
        "*",
        OUTPUT / "results" / "methods_review",
        copied,
    )
    copy_glob(
        RESEARCH / "writing_scaffold",
        "*",
        OUTPUT / "results" / "writing_scaffold",
        copied,
    )
    copy_glob(
        RESEARCH / "study_design" / "cluster_c_survey_route",
        "*",
        OUTPUT / "results" / "study_design" / "cluster_c_survey_route",
        copied,
    )
    copy_glob(
        RESEARCH / "study_design" / "cluster_c_text_analysis_route",
        "*",
        OUTPUT / "results" / "study_design" / "cluster_c_text_analysis_route",
        copied,
    )
    copy_glob(
        RESEARCH / "manuscript_scaffold",
        "*",
        OUTPUT / "results" / "manuscript",
        copied,
    )

    for src in sorted((OUTPUT / "results" / "manuscript").glob("*")):
        if src.is_file():
            copy_file(src, OUTPUT / "manuscript" / src.name, copied)

    return copied


def build_audits(copied: list[dict[str, str]]) -> None:
    source_inventory = [
        {
            "source_id": "literature_matrix_v4",
            "platform": "academic_literature",
            "game_name": "not_applicable",
            "source_type": "literature_matrix_workbook",
            "public_url_or_entry_point": "source URLs and DOIs embedded in literature matrix",
            "access_method": "manual_and_crossref_metadata_collection",
            "allowed_collection_status": "public_allowed",
            "time_window": "not_applicable",
            "keyword_or_event": "otome games; emotional value; emotional consumption; digital intimacy",
            "planned_unit": "one article",
            "expected_fields": "title; authors; year; abstract; methods; data; contribution",
            "restriction_note": "Use original article metadata and cite original source.",
            "approval_status": "ready",
        },
        {
            "source_id": "public_text_comments_placeholder",
            "platform": "to_be_selected",
            "game_name": "to_be_selected",
            "source_type": "public_comment_or_review_export",
            "public_url_or_entry_point": "to_be_documented",
            "access_method": "official_export_api_or_permitted_public_collection",
            "allowed_collection_status": "pending_review",
            "time_window": "to_be_defined",
            "keyword_or_event": "to_be_defined",
            "planned_unit": "one public text unit",
            "expected_fields": "text_unit_id; platform; game_name; text_clean; timestamp; source_url",
            "restriction_note": "Do not bypass login walls, CAPTCHA, paywalls, or platform restrictions.",
            "approval_status": "blocked_until_source_approved",
        },
    ]

    sample_flow = [
        {
            "route_id": ROUTE_ID,
            "design_source": DESIGN_SOURCE,
            "target_inquiry": TARGET_INQUIRY,
            "step": "00_archive_existing_research_outputs",
            "input_path": "research/",
            "output_path": "output/results/",
            "n_before": len([r for r in copied if r["status"] == "copied"]),
            "n_after": len([r for r in copied if r["status"] == "copied"]),
            "units_before": len([r for r in copied if r["status"] == "copied"]),
            "units_after": len([r for r in copied if r["status"] == "copied"]),
            "years_before": "not_applicable",
            "years_after": "not_applicable",
            "reason": "Bundle current verified project artifacts into stable output paths.",
            "check_status": "pass",
            "notes": "Artifact-level flow; raw comment data have not yet been collected.",
        },
        {
            "route_id": ROUTE_ID,
            "design_source": DESIGN_SOURCE,
            "target_inquiry": TARGET_INQUIRY,
            "step": "10_collect_public_text_comments",
            "input_path": "data/raw/public_text_comments/",
            "output_path": "data/interim/text_units/",
            "n_before": 0,
            "n_after": 0,
            "units_before": 0,
            "units_after": 0,
            "years_before": "not_applicable",
            "years_after": "not_applicable",
            "reason": "No raw public comment/review files are present yet.",
            "check_status": "warn",
            "notes": "Add approved raw exports before running text normalization and coding.",
        },
    ]

    labels = [
        "digital_self_extension",
        "emotional_value",
        "character_attachment",
        "brand_ip_attachment",
        "continued_consumption",
        "self_reported_payment",
        "community_participation",
        "commercialization_resistance",
        "unrelated_or_information_only",
    ]
    variable_provenance = [
        {
            "route_id": ROUTE_ID,
            "design_source": DESIGN_SOURCE,
            "target_inquiry": TARGET_INQUIRY,
            "variable": label,
            "source_variables": "text_clean; source_snippet; codebook label rules",
            "rule": "Binary or categorical text label defined in the Cluster C text codebook.",
            "script_path": "scripts/run_all.py",
            "validation": "Requires human validation sample before primary analysis.",
            "status": "needs_review",
        }
        for label in labels
    ]

    write_csv(
        OUTPUT / "audit" / "source_inventory.csv",
        source_inventory,
        [
            "source_id",
            "platform",
            "game_name",
            "source_type",
            "public_url_or_entry_point",
            "access_method",
            "allowed_collection_status",
            "time_window",
            "keyword_or_event",
            "planned_unit",
            "expected_fields",
            "restriction_note",
            "approval_status",
        ],
    )
    write_csv(
        OUTPUT / "audit" / "sample_flow.csv",
        sample_flow,
        [
            "route_id",
            "design_source",
            "target_inquiry",
            "step",
            "input_path",
            "output_path",
            "n_before",
            "n_after",
            "units_before",
            "units_after",
            "years_before",
            "years_after",
            "reason",
            "check_status",
            "notes",
        ],
    )
    write_csv(
        OUTPUT / "audit" / "variable_provenance.csv",
        variable_provenance,
        [
            "route_id",
            "design_source",
            "target_inquiry",
            "variable",
            "source_variables",
            "rule",
            "script_path",
            "validation",
            "status",
        ],
    )
    write_csv(
        OUTPUT / "audit" / "output_inventory.csv",
        copied,
        ["source_path", "output_path", "category", "bytes", "sha256", "status"],
    )
    write_csv(
        DATA / "analysis" / "project_artifact_index.csv",
        copied,
        ["source_path", "output_path", "category", "bytes", "sha256", "status"],
    )


def write_table_shells() -> None:
    table_shells = {
        "table_1_source_inventory.csv": [
            "source_id",
            "platform",
            "game_name",
            "source_type",
            "time_window",
            "keyword_or_event",
            "access_method",
            "allowed_collection_status",
            "raw_rows_collected",
            "analysis_rows_after_cleaning",
        ],
        "table_2_sample_flow.csv": [
            "step",
            "input_rows",
            "output_rows",
            "row_loss",
            "reason",
            "check_status",
        ],
        "table_3_codebook_validation.csv": [
            "label_name",
            "positive_examples_reviewed",
            "negative_examples_reviewed",
            "precision_estimate",
            "disagreement_count",
            "boundary_problem",
            "decision",
        ],
        "table_4_label_prevalence.csv": [
            "label_name",
            "overall_share",
            "by_platform",
            "by_game",
            "by_event_window",
            "notes",
        ],
        "table_5_cooccurrence_matrix.csv": [
            "label_a",
            "label_b",
            "cooccurrence_count",
            "cooccurrence_share",
            "lift",
            "notes",
        ],
    }
    for filename, columns in table_shells.items():
        write_csv(OUTPUT / "tables" / filename, [], columns)


def write_project_docs(copied: list[dict[str, str]], run_id: str) -> None:
    workflow = f"""# Project Workflow

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
- `output/logs/run_all_{run_id}.log`: run log.

## Next Data Step

Put approved public comment/review exports under `data/raw/public_text_comments/`.
Do not overwrite raw files. Then extend `scripts/run_all.py` with parse,
deduplicate, anonymize, code, validate, and export stages.
"""
    (DOCS / "project_workflow.md").write_text(workflow, encoding="utf-8")

    changelog = DOCS / "changelog.md"
    entry = f"""## {datetime.now().date().isoformat()}

- Modified: `scripts/run_all.py`, `scripts/run_all.ps1`, `data/`, `output/`, `docs/`.
- Reason: Consolidate scattered research artifacts into a one-command academic project workflow.
- Change: Created result bundle, audit files, table shells, raw/interim/analysis directories, and run log.
- Command: `python scripts/run_all.py`
- Check: Packaged {len([r for r in copied if r['status'] == 'copied'])} artifacts into `output/results/`.

"""
    if changelog.exists():
        old = changelog.read_text(encoding="utf-8")
        if entry not in old:
            changelog.write_text(entry + old, encoding="utf-8")
    else:
        changelog.write_text(entry, encoding="utf-8")


def main() -> None:
    run_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    ensure_dirs()
    write_readme_files()
    copied = build_result_bundle()
    build_audits(copied)
    write_table_shells()
    write_project_docs(copied, run_id)

    log = {
        "run_id": run_id,
        "timestamp": datetime.now().isoformat(timespec="seconds"),
        "root": str(ROOT),
        "route_id": ROUTE_ID,
        "copied_artifacts": len([r for r in copied if r["status"] == "copied"]),
        "missing_artifacts": len([r for r in copied if r["status"] == "missing"]),
        "status": "success",
        "notes": "Raw public comment/review data are not present yet; text-analysis stages remain scaffolded.",
    }
    log_path = OUTPUT / "logs" / f"run_all_{run_id}.log"
    log_path.write_text(json.dumps(log, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Run complete: {log_path}")
    print(f"Copied artifacts: {log['copied_artifacts']}")
    print("Primary results: output/results/")


if __name__ == "__main__":
    main()
