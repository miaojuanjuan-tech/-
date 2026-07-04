# Cluster C Analysis Plan Scaffold

## Purpose

本分析计划只服务第一轮预测试或正式问卷初版。目标不是证明因果，而是检查 Cluster C 路线是否能形成可区分、可解释、可建模的构念链条。

## Analysis Unit

首选单位：玩家-最喜欢角色关系。

每位受访者先填写：

- 最近 3 或 6 个月主要游玩的乙游。
- 最喜欢或投入最多的角色。
- 后续题项均围绕这个角色和该游戏/IP回答。

## Table Shells

### Table 1: Sample Profile

Required columns:

- 年龄段
- 教育/职业状态
- 乙游玩龄
- 最近 30 天游玩频率
- 是否付费
- 近 30 天付费区间
- 是否有主推角色
- 招募渠道

Risk check:

- 报告不同招募渠道的样本差异。
- 不把便利样本泛化到所有乙游玩家。

### Table 2: Construct Reliability and Validity

Required columns:

- construct
- number_of_items
- Cronbach alpha
- Composite reliability
- AVE
- min loading
- max loading
- HTMT warning

Decision rule:

- 若数字自我延伸、情绪价值、角色依恋 HTMT 过高，优先重写题项或合并构念。
- 若品牌/IP依恋与角色依恋高度重叠，保留角色依恋为主，品牌/IP依恋作为次级结果。

### Table 3: Correlation Matrix

Variables:

- 数字自我延伸
- 虚拟物品情感价值
- 角色依恋
- 品牌/IP依恋
- 持续消费意向
- 自报消费行为
- 社群参与
- 商业化反感/操纵感

Risk check:

- 如果所有核心变量相关都极高，说明共同方法或构念重叠严重。

### Table 4: Main SEM or PLS-SEM Path Model

Baseline model:

`数字自我延伸 -> 虚拟物品情感价值 -> 角色依恋 -> 持续消费意向`

Alternative model:

`数字自我延伸 -> 角色依恋 -> 虚拟物品情感价值 -> 持续消费意向`

Optional extension:

`角色依恋 -> 品牌/IP依恋 -> 持续消费意向`

Controls:

- 乙游玩龄
- 游玩频率
- 付费能力或月可支配金额
- 社群参与
- 招募渠道固定效应或渠道哑变量

Reporting boundary:

- 写“关联”“路径关系”“与理论机制一致”。
- 不写“导致”“证明”“因果效应”。

## Qualitative Coding Scaffold

If interviews or open-ended responses are collected:

| code | meaning | example evidence needed |
|---|---|---|
| identity_expression | 玩家把角色或卡牌作为自我表达 | 受访者说明“这个角色像我/代表我喜欢的东西” |
| memory_archive | 虚拟资产承载个人记忆 | 受访者提到入坑、活动、周年、陪伴时刻 |
| investment_proof | 收藏或高练度作为投入证明 | 受访者提到卡面、练度、氪金记录或账号展示 |
| companionship | 角色提供陪伴或安慰 | 受访者提到情绪低落、日常陪伴 |
| commercialization_tension | 情感投入与付费压力冲突 | 受访者提到被活动、抽卡、限时机制推动消费 |

Validation:

- 至少 2 名编码者或 1 名编码者 + 抽样复核。
- 记录 codebook 版本。
- 保留负例。

## Minimum Diagnostic Gates

1. 构念题项是否被玩家理解。
2. 数字自我延伸是否能和情绪价值、角色依恋区分。
3. 持续消费意向是否与自报行为方向一致。
4. 商业化反感是否削弱情绪价值到消费意向的路径。
5. 招募渠道是否显著影响核心变量均值。

## First Handoff

When pilot data exist, route to:

- `research-analysis-runner`: 生成描述统计、信效度、相关矩阵、SEM/PLS-SEM初版。
- `methods-reviewer`: 审查构念重叠、模型路径和过度宣称风险。
