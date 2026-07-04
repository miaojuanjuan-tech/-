# Cluster C Text Data Pipeline Scaffold

## Directory Layout

```text
data/
  raw/
    platform_name/
      raw_html_or_json/
      raw_exports/
  interim/
    normalized_text/
    deduplicated_text/
    anonymized_text/
  analysis/
    coded_text_units.csv
    event_window_sample.csv
scripts/
  00_setup.py
  10_collect_public_metadata.py
  20_parse_normalize_text.py
  30_deduplicate_anonymize.py
  40_build_codebook_sample.py
  50_apply_text_codes.py
  60_export_analysis_sample.py
output/
  audit/
    sample_flow.csv
    variable_provenance.csv
    coding_validation.csv
    source_inventory.csv
  logs/
  tables/
  figures/
docs/
  changelog.md
  scraping_ethics_note.md
  codebook.md
```

## Stage 0: Boundary And Ethics

Before any collection:

- Confirm platform rules, robots, service terms, and access restrictions.
- Use only public content.
- Do not bypass login walls, CAPTCHA, paywalls, rate limits, or anti-scraping systems.
- Do not collect private messages, private groups, or non-public accounts.
- Hash or remove user identifiers.
- Avoid publishing long verbatim comments that can be searched back to users.

Output:

- `docs/scraping_ethics_note.md`
- `output/audit/source_inventory.csv`

## Stage 1: Source Inventory

Required fields:

- source_id
- platform
- game_name
- source_type
- public_url_or_entry_point
- access_method
- allowed_collection_status
- time_window
- keyword_or_event
- planned_unit
- expected_fields
- restriction_note
- approval_status

Gate:

- No source can enter collection unless `allowed_collection_status` is `public_allowed` or `manual_export_allowed`.

## Stage 2: Raw Collection

Raw data are immutable.

Required raw metadata:

- raw_file_path
- source_id
- collection_timestamp
- collector_script_version
- query_keyword
- page_or_cursor
- row_count_raw
- hash_raw_file
- collection_status

Collection options:

- API or official export if available.
- Manual export or manual sampling if scraping is restricted.
- Browser-visible public pages only if permitted.

Gate:

- No raw file is overwritten.
- Each collection batch has a log.

## Stage 3: Parse And Normalize

Output unit:

One row = one text unit, such as one comment, post, review, or reply.

Required normalized fields:

- text_unit_id
- source_id
- platform
- game_name
- character_or_event_keyword
- text_type
- parent_text_unit_id
- user_hash
- text_raw
- text_clean
- timestamp_original
- timestamp_parsed
- like_count
- reply_count
- source_url
- crawl_timestamp
- parse_status

Gate:

- `text_unit_id` is unique.
- `text_clean` is nonempty for analysis rows.
- Timestamp parsing failures are flagged, not silently dropped.

## Stage 4: Deduplicate And Anonymize

Deduplication keys:

- exact text duplicate within same platform/game/time window.
- near duplicate if same text and same user_hash within short time.
- repost/quote kept only if analytically relevant and flagged.

Anonymization:

- Replace user ids with salted hashes.
- Remove @mentions, phone numbers, URLs, or other direct identifiers if not central.
- Keep `source_url` only in restricted internal audit file if publication risk is high.

Output:

- `data/interim/anonymized_text/text_units_anonymized.csv`
- `output/audit/sample_flow.csv`

## Stage 5: Codebook Sample

Sampling plan:

- Stratify by platform, game, event window, and keyword.
- First coding sample: 300-500 text units.
- Include obvious positive, ambiguous, and negative cases.

Output:

- `data/interim/codebook_sample.csv`
- `docs/codebook.md`

## Stage 6: Text Coding

Recommended labels:

- digital_self_extension
- emotional_value
- character_attachment
- brand_ip_attachment
- continued_consumption
- self_reported_payment
- community_participation
- commercialization_resistance
- unrelated_or_information_only

Required coding fields:

- text_unit_id
- label_name
- label_value
- coder_id_or_model
- coding_method
- codebook_version
- confidence
- source_snippet
- needs_review
- review_status

LLM-assisted coding rule:

- Store prompt version.
- Store model/tool version.
- Store confidence and source snippet.
- Route ambiguous texts to `needs_review=true`.
- Low-confidence labels do not enter primary analysis.

## Stage 7: Validation

Validation outputs:

- `output/audit/coding_validation.csv`

Minimum metrics:

- human agreement or adjudication rate if multiple coders.
- precision check for each automated/LLM label.
- false positive examples.
- false negative examples if feasible.
- number and share of `needs_review`.

Gate:

- Do not report label prevalence until validation sample is reviewed.

## Stage 8: Analysis Sample

Analysis fields:

- text_unit_id
- platform
- game_name
- event_window
- month
- text_type
- digital_self_extension
- emotional_value
- character_attachment
- brand_ip_attachment
- continued_consumption
- self_reported_payment
- community_participation
- commercialization_resistance
- label_confidence_min
- included_primary_analysis

Primary outputs:

- label prevalence by platform/game/month.
- co-occurrence matrix.
- event-window trend.
- representative de-identified snippets.

Report boundary:

- Results describe public textual expression, not all player psychology or actual behavior.
