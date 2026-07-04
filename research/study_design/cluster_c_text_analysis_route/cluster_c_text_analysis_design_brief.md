# Study Design Brief: Cluster C Text Analysis

## Route

route_id: `cluster_c_text_analysis_virtual_goods`

working title: `从评论到数字自我：乙游玩家如何在公开文本中表达虚拟物品、角色资产与情绪价值`

selected route: Cluster C 的文本分析版本。主线从问卷 SEM 转为公开评论、帖子、回复和游戏评价的文本证据。

rejected route: 暂不采用问卷作为主设计。问卷题项可保留为未来验证工具，但当前研究不以自报量表为主。

## Model

Population of expression: 公开平台中围绕国内乙游、角色、卡牌、剧情、抽卡、活动和消费体验的玩家文本表达。

Unit of analysis:

- 最小单位：一条评论、帖子、回复或短评。
- 聚合单位：游戏-平台-月份、角色-平台-月份、活动窗口。

Setting:

- 游戏评论平台：TapTap、应用商店评论、B站游戏区评论等。
- 社群/内容平台：微博、小红书、贴吧、豆瓣小组、公开论坛或超话。
- 具体平台选择必须先检查平台服务条款、robots、访问限制和研究伦理边界。

Constructs as text targets:

- 数字自我延伸表达：玩家把角色、卡牌、账号资产、剧情记忆或收藏物表达为“我的一部分”“我的回忆”“投入证明”“身份标签”。
- 虚拟物品情感价值表达：陪伴、安慰、愉悦、审美、纪念、情绪修复。
- 角色依恋表达：亲近、想念、分离不适、保护欲、偏爱、主推。
- 持续消费表达：继续玩、继续抽、月卡、氪金、活动参与、退坑/回坑。
- 商业化反感/操纵感表达：被逼氪、骗氪、限时压力、情感绑架、运营不尊重角色。

Mechanism as process-tracing claim:

文本中若同时出现“角色/卡牌/账号资产作为自我或记忆的一部分”和“情绪价值/依恋/持续消费表达”，可作为机制一致性证据，但不能证明个体层面因果。

## Inquiry

Primary inquiry:

在公开乙游相关评论和社群文本中，玩家如何把虚拟角色资产、卡牌、剧情记忆和收藏实践表达为数字自我延伸？这些表达如何与情绪价值、角色依恋、持续消费和商业化反感共同出现？

Descriptive quantities:

- 每个平台/游戏/时期中，数字自我延伸表达的比例。
- 数字自我延伸表达与情绪价值、角色依恋、持续消费、商业化反感的共现模式。
- 活动期、周年庆、角色卡池、争议运营事件前后，相关表达的变化。

Classification target:

将文本单元分类为：

1. 数字自我延伸表达
2. 情绪价值表达
3. 角色依恋表达
4. 持续消费表达
5. 商业化反感/操纵感表达
6. 社群/二创参与表达
7. 无关或仅信息性评论

## Data Strategy

Source selection:

- 选择 2-4 款国内乙游作为样本游戏。
- 每款游戏选择 2-3 个公开平台。
- 设定时间窗：至少覆盖普通期和活动期；如果研究商业化反感，需覆盖卡池/周年庆/争议事件窗口。

Raw data rule:

- 原始 HTML/JSON/截图或导出文件进入 `data/raw/`，不可覆盖。
- 解析后的文本进入 `data/interim/`。
- 编码和分析样本进入 `data/analysis/`。

Required raw fields:

- source_platform
- game_name
- character_or_event_keyword
- text_id
- parent_id if available
- user_hash or anonymized user id if legally/ethically allowed
- text
- timestamp
- like_count/comment_count if available
- source_url
- crawl_timestamp
- access_method

Sampling:

- 关键词策略：游戏名、角色名、卡池名、活动名、抽卡、氪金、月卡、退坑、回坑、陪伴、主推、老公、收藏、卡面。
- 平台内排序偏差需记录：按时间、热度、相关度抓取会产生不同样本。
- 若平台限制访问，只保留可公开访问内容，不绕过登录、验证码、付费墙或反爬限制。

Permissions and ethics:

- 不采集私密群聊、非公开账号内容或需要绕过权限的内容。
- 用户 ID 做哈希或删除。
- 公开引用原文时要去标识化，并避免可搜索回溯的长句。

## Answer Strategy

Stage 1: Dictionary + manual coding pilot

- 抽样 300-500 条文本。
- 人工建立 codebook。
- 双人或一人编码 + 抽样复核。
- 输出各类标签定义、正例、负例和冲突规则。

Stage 2: Text classification

可选方法：

- 词典规则：适合高精度识别明确表达，如“主推”“骗氪”“退坑”。
- 人工编码：适合小样本深描。
- LLM 辅助分类：适合多标签、语义复杂表达，但必须保留 prompt 版本、source snippet、confidence、needs_review。
- 监督学习：只有在人工标注样本足够时使用。

Stage 3: Descriptive analysis

- 标签比例：按游戏、平台、月份、活动窗口。
- 共现矩阵：数字自我延伸与情绪价值、角色依恋、持续消费、商业化反感的共现。
- 关键词/主题模型：仅作探索，不能替代人工验证标签。
- 事件窗口图：活动或争议事件前后表达变化。

## Diagnose

Key gates:

- 平台合法性和伦理边界通过。
- 样本来源和抓取规则可复现。
- 去重规则明确。
- 文本编码有人工验证。
- LLM 分类有 prompt、版本、confidence、needs_review。
- 低置信度文本不进入主分析。
- 公开引用文本已去标识化。

## Redesign

If scraping is blocked:

- 改用手动导出的公开评论样本。
- 改用平台公开榜单/评论截图的人工编码。
- 改为单平台或单游戏深描研究。

If coding reliability is low:

- 缩小标签体系。
- 合并相近标签，如数字自我延伸和角色依恋先分层而非并列。
- 增加人工训练样本。

If sample is too biased:

- 不做平台总体化结论。
- 把研究定位为“公开社群表达”而非“全部乙游玩家态度”。

## Report Boundary

This design can support:

- 公开评论/社群文本中，玩家如何表达数字自我、虚拟物品情感价值和角色依恋。
- 不同平台、游戏、活动窗口中表达模式的差异。
- 数字自我延伸、情绪价值、角色依恋、持续消费表达的共现关系。

This design cannot support:

- 个体玩家心理状态的真实强度。
- 公开表达对真实消费行为的因果影响。
- 所有乙游玩家总体态度。
- 私密社群或沉默玩家的经验。

## First Analysis Plan

Smallest first loop:

1. 选 1 款乙游 + 1 个公开平台 + 1 个活动窗口。
2. 收集 500-1000 条公开评论或帖子元数据。
3. 去重、清洗、匿名化。
4. 抽样 300 条人工编码。
5. 计算标签比例、共现矩阵和编码一致性。
6. 决定是否扩大到多平台/多游戏。

## Handoff

next_skill_route:

- `research-data-builder`: 建立 raw/interim/analysis 数据结构、爬取记录、样本流和变量溯源。
- `research-analysis-runner`: 在有 analysis-ready 文本标签数据后做描述统计、共现矩阵和图表。
- `methods-reviewer`: 审查文本编码、样本偏差、LLM分类和过度宣称风险。
