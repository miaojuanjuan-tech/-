# Cluster C Text Analysis Plan

## Analysis Unit

Primary unit: one public text unit.

Examples:

- one app review
- one TapTap short review
- one public post
- one public reply/comment

Aggregation:

- platform x game x month
- game x event_window
- character/event keyword x month

## First Feasibility Sample

Recommended smallest loop:

1. Select one乙游.
2. Select one public platform.
3. Select one event or card-pool window.
4. Collect 500-1000 text units if permitted.
5. Manually code 300 text units.
6. Evaluate whether labels are meaningful and separable.

## Table Shells

### Table 1: Source Inventory

Columns:

- source_id
- platform
- game_name
- source_type
- time_window
- keyword_or_event
- access_method
- allowed_collection_status
- raw_rows_collected
- analysis_rows_after_cleaning

### Table 2: Sample Flow

Rows:

- raw collected text units
- nonempty parsed text
- after duplicate removal
- after anonymization
- codebook sample
- coded sample
- primary analysis sample
- needs_review excluded from primary analysis

### Table 3: Codebook Validation

Columns:

- label_name
- positive_examples_reviewed
- negative_examples_reviewed
- precision_estimate
- disagreement_count
- boundary_problem
- decision

If using two coders:

- add agreement or adjudication rate.

If using LLM:

- add model/tool version, prompt version, confidence threshold, false positive examples.

### Table 4: Label Prevalence

Rows:

- digital_self_extension
- emotional_value
- character_attachment
- continued_consumption
- commercialization_resistance
- community_participation

Columns:

- overall share
- by platform
- by game
- by event window

### Table 5: Co-occurrence Matrix

Core pairs:

- digital_self_extension x emotional_value
- digital_self_extension x character_attachment
- digital_self_extension x continued_consumption
- emotional_value x continued_consumption
- character_attachment x continued_consumption
- commercialization_resistance x continued_consumption

Interpretation:

- Co-occurrence is not causality.
- It shows how concepts appear together in public expression.

## Figure Shells

### Figure 1: Event Window Trend

X-axis:

- Days or weeks around card-pool/activity/event.

Y-axis:

- Share of text units with selected label.

Lines:

- digital_self_extension
- emotional_value
- continued_consumption
- commercialization_resistance

Boundary:

- Changes may reflect posting volume and platform attention, not population attitude.

### Figure 2: Concept Co-occurrence Network

Nodes:

- labels.

Edges:

- co-occurrence frequency or lift.

Boundary:

- This is descriptive mapping, not causal mechanism proof.

## Qualitative Evidence Slots

Use de-identified short snippets only.

For each label, include:

- 1 clear positive example.
- 1 ambiguous example.
- 1 negative/boundary example.

Do not include long verbatim comments that can be searched back to users.

## Reportable Claims

Safe:

- “在公开评论样本中，数字自我延伸表达常与情绪价值和角色依恋表达共同出现。”
- “活动窗口中，商业化反感表达与持续消费表达可能同时上升，提示情感价值商业化存在张力。”
- “不同平台上的表达模式不同，说明公开文本样本具有平台语境性。”

Unsafe:

- “数字自我延伸导致玩家持续消费。”
- “乙游玩家普遍如此。”
- “评论文本直接反映玩家真实心理强度。”
- “平台策略证明存在情感操纵。”

## Minimum Quality Gates

1. Source legality and ethics note completed.
2. Raw data preserved and not overwritten.
3. Source inventory and sample flow complete.
4. Codebook has positive, negative, and boundary cases.
5. At least one human validation sample exists.
6. Low-confidence labels excluded or separately reported.
7. All claims say “公开文本表达” rather than “玩家心理” unless supported by other data.
