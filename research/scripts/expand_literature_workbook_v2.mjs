import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const accessDate = "2026-07-04";
const inputPath = "outputs/乙游_情绪价值_情感消费_数字亲密关系_商学文献矩阵.xlsx";
const outputDir = "outputs";
const outputPath = `${outputDir}/乙游_情绪价值_情感消费_数字亲密关系_商学文献矩阵_v2_扩展版.xlsx`;

const input = await FileBlob.load(inputPath);
const oldWb = await SpreadsheetFile.importXlsx(input);
const oldMatrix = oldWb.worksheets.getItem("Matrix").getUsedRange().values;
const oldHeaders = oldMatrix[0];
const oldRows = oldMatrix.slice(1);

const newHeaders = [
  "paper_id",
  "中文定位",
  "研究对象",
  "文献类型",
  ...oldHeaders.slice(2),
];

function inferType(row) {
  const method = String(row[13] || "");
  const venue = String(row[5] || "");
  if (method.includes("实验")) return "定量-实验";
  if (method.includes("SEM") || method.includes("结构方程") || method.includes("量表")) return "定量-量表/SEM";
  if (method.includes("访谈") || method.includes("质性") || method.includes("案例") || method.includes("netnography")) return "质性";
  if (method.includes("元分析")) return "定量-元分析";
  if (method.includes("概念") || method.includes("理论") || method.includes("综述") || venue.includes("Working Paper")) return "理论/综述";
  return "待核查";
}

function inferObject(row) {
  const pos = String(row[1] || "");
  const title = String(row[2] || "");
  if (pos.includes("乙游") || title.toLowerCase().includes("otome")) return "乙游玩家/乙游社群/女性向游戏消费";
  if (title.toLowerCase().includes("ai") || title.toLowerCase().includes("robot") || title.toLowerCase().includes("chatbot")) return "AI服务/机器人/AI陪伴消费者";
  if (title.toLowerCase().includes("brand")) return "消费者-品牌关系/品牌体验";
  if (title.toLowerCase().includes("virtual")) return "虚拟商品/虚拟角色/数字财产消费者";
  return "消费者/数字服务用户";
}

const transformedOldRows = oldRows.map((r) => [r[0], r[1], inferObject(r), inferType(r), ...r.slice(2)]);

const addRows = [
  [
    "belk_2013_extended_self_digital",
    "数字财产/数字自我",
    "数字产品、虚拟物品、社交媒体资料、数字记忆与消费者身份",
    "理论/综述",
    "Extended Self in a Digital World",
    "Russell W. Belk",
    2013,
    "Journal of Consumer Research",
    "消费者研究顶刊; 数字自我核心",
    "10.1086/671052",
    "https://doi.org/10.1086/671052",
    "needs_primary_source",
    "文章将延伸自我理论推进到数字世界，讨论数字财产、在线身份、分享、共同建构记忆和虚拟物品如何改变所有物与自我的关系。",
    "digital self; extended self; digital possessions; virtual goods; identity",
    "数字环境如何改变消费者所有物、身份和延伸自我？",
    "理论/概念论文，整合数字技术和消费者身份研究。",
    "文献整合；无单一原始样本。",
    "digital possessions; dematerialization; sharing; co-construction of self; distributed memory",
    "为乙游账号资产、抽卡卡面、角色收藏和数字回忆成为自我组成部分提供顶刊理论依据。",
    "数字对象虽然非物质，但仍能进入消费者身份、记忆和关系结构。",
    "用于解释乙游消费不是单次娱乐，而是数字资产化、身份化和关系化的长期投入。",
    "需从数字财产理论迁移到乙游平台锁定与虚拟恋爱关系。",
    "not downloaded; publisher/DOI page to verify",
    `DOI candidate; accessed ${accessDate}`,
  ],
  [
    "davenport_2020_ai_marketing",
    "AI营销/数字互动总框架",
    "AI营销系统、消费者行为、个性化、聊天机器人和客户互动",
    "理论/综述",
    "How Artificial Intelligence Will Change the Future of Marketing",
    "Thomas Davenport; Abhijit Guha; Dhruv Grewal; Timna Bressgott",
    2020,
    "Journal of the Academy of Marketing Science",
    "营销顶刊; AI营销开放获取",
    "10.1007/s11747-019-00696-0",
    "https://doi.org/10.1007/s11747-019-00696-0",
    "verified_primary",
    "文章提出 AI 影响营销的多维框架，围绕智能水平、任务类型、是否嵌入机器人，讨论 AI 对营销策略、顾客行为、隐私、偏见和伦理的影响。",
    "artificial intelligence; marketing strategy; customer behavior; personalization; ethics",
    "AI 将如何改变营销战略和顾客行为？营销研究应如何组织 AI 议程？",
    "理论/概念框架，结合既有研究和实践案例。",
    "文献与实践案例整合；无单一调查样本。",
    "AI intelligence level; task type; robot embodiment; personalization; customer engagement; privacy",
    "为乙游中的 AI 陪伴、自动化亲密互动、数据化推荐和情感运营提供顶级营销框架。",
    "AI 会改变营销战略和顾客行为；更适合增强而非完全替代人类管理者，同时引出隐私、偏见和伦理问题。",
    "用于把乙游从“游戏现象”上升到 AI/数据驱动的情感营销与客户关系管理。",
    "不是乙游文献，需要用游戏场景做理论应用。",
    "open access PDF available at Springer",
    `published open-access version; accessed ${accessDate}`,
  ],
  [
    "puntoni_2021_consumers_ai",
    "消费者与AI体验",
    "消费者与AI系统的服务体验、主体性、信任和情绪反应",
    "理论/综述",
    "Consumers and Artificial Intelligence: An Experiential Perspective",
    "Stefano Puntoni; Rebecca Walker Reczek; Markus Giesler; Simona Botti",
    2021,
    "Journal of the Academy of Marketing Science",
    "营销顶刊; AI消费者体验",
    "10.1007/s11747-020-00788-5",
    "https://doi.org/10.1007/s11747-020-00788-5",
    "needs_primary_source",
    "文章从体验视角讨论消费者如何遭遇 AI，强调 AI 不只是工具，也会改变消费者的身份、控制感、关系感和情绪体验。",
    "artificial intelligence; consumer experience; agency; trust; identity; customer experience",
    "AI 如何重塑消费者体验？消费者如何理解和回应 AI 介入？",
    "理论/综述框架。",
    "文献整合；无单一原始样本。",
    "consumer experience; AI agency; identity; autonomy; trust; affect",
    "适合解释乙游 AI/脚本化互动为什么会影响被回应感、控制感和关系真实感。",
    "消费者与 AI 的关系需从体验、身份和主体性感知理解，而不仅是效率工具。",
    "用于讨论乙游数字亲密关系中的“是真人、AI、脚本还是角色人格”的体验差异。",
    "需进一步核验出版社页和具体摘要。",
    "not downloaded; publisher page to verify",
    `DOI candidate; accessed ${accessDate}`,
  ],
  [
    "huang_rust_2018_ai_service",
    "AI服务/情感智能",
    "AI服务任务、机械/分析/直觉/情感智能与人机替代",
    "理论/综述",
    "Artificial Intelligence in Service",
    "Ming-Hui Huang; Roland T. Rust",
    2018,
    "Journal of Service Research",
    "服务营销顶刊; 开放获取; JSR获奖文献",
    "10.1177/1094670517752459",
    "https://doi.org/10.1177/1094670517752459",
    "verified_primary",
    "文章提出 AI 服务替代理论，区分机械、分析、直觉和情感四类智能，说明 AI 会先替代低阶任务，情感和直觉能力对服务员工仍重要。",
    "artificial intelligence; service; empathetic intelligence; task replacement; human-machine integration",
    "AI 在服务中会如何替代或增强人类任务？哪些智能类型最难被替代？",
    "理论建构/概念框架。",
    "文献和案例整合；无单一调查样本。",
    "mechanical intelligence; analytical intelligence; intuitive intelligence; empathetic intelligence; service tasks",
    "乙游情绪价值高度依赖“情感智能/共情智能”，该文可解释为什么自动化陪伴要跨越情感智能门槛。",
    "AI 替代发生在任务层面，并按机械、分析、直觉、情感的顺序推进。",
    "用于把乙游陪伴系统定位为高情感智能服务，而不是普通自动客服。",
    "理论层面；未直接检验乙游或娱乐服务。",
    "open PDF/EPUB available at SAGE",
    `published open-access version; accessed ${accessDate}`,
  ],
  [
    "van_doorn_2017_automated_social_presence",
    "自动化社会临场感",
    "服务机器人、虚拟化身、自动化社会临场感和服务体验",
    "理论/综述",
    "Domo Arigato Mr. Roboto: Emergence of Automated Social Presence in Organizational Frontlines and Customers’ Service Experiences",
    "Jenny van Doorn; Martin Mende; Stephanie M. Noble; John Hulland; Amy L. Ostrom; Dhruv Grewal; J. Andrew Petersen",
    2017,
    "Journal of Service Research",
    "服务营销顶刊; 开放获取; 自动化社会临场感",
    "10.1177/1094670516679272",
    "https://doi.org/10.1177/1094670516679272",
    "verified_primary",
    "文章提出自动化社会临场感 ASP，解释技术如何让消费者感到另一个社会实体存在，并通过社会认知和心理所有权影响服务结果。",
    "automated social presence; service robots; social cognition; psychological ownership; anthropomorphism",
    "技术如何在服务前台产生社会临场感，并影响顾客体验和关系？",
    "概念框架和命题。",
    "文献和服务技术案例整合；无单一原始样本。",
    "ASP; warmth; competence; psychological ownership; anthropomorphism; technology readiness",
    "非常适合乙游：男主语音、短信、互动动作、AI聊天都在制造自动化社会临场感。",
    "自动化社会临场感可通过社会认知和心理所有权影响服务体验与再访意愿。",
    "用于构建“角色似乎在场/陪我/回应我 -> 数字亲密 -> 付费和留存”的机制。",
    "服务机器人场景，迁移到虚拟恋爱游戏需重新定义临场感。",
    "open PDF/EPUB available at SAGE",
    `published open-access version; accessed ${accessDate}`,
  ],
  [
    "mende_2019_service_robots",
    "机器人服务/补偿性消费",
    "人形服务机器人、消费者威胁感、自我认同和补偿性反应",
    "定量-实验",
    "Service Robots Rising: How Humanoid Robots Influence Service Experiences and Elicit Compensatory Consumer Responses",
    "Martin Mende; Maura L. Scott; Jenny van Doorn; Dhruv Grewal; Ilana Shanks",
    2019,
    "Journal of Service Research",
    "服务营销顶刊; 机器人服务实证",
    "10.1177/1094670518824532",
    "https://doi.org/10.1177/1094670518824532",
    "needs_primary_source",
    "研究人形机器人服务对消费者体验和补偿性消费反应的影响，适合讨论虚拟男主/数字人互动对自我威胁或自我修复的作用。",
    "service robots; humanoid robots; compensatory consumption; customer experience; identity threat",
    "人形机器人如何影响服务体验并引发消费者补偿性反应？",
    "多项实验研究。",
    "实验参与者；需原文确认样本量和实验情境。",
    "humanoid robot; self-threat; compensatory consumption; service evaluation",
    "补充乙游“情绪修复/补偿性消费”的机制，尤其适合解释压力、孤独、低自尊状态下的付费。",
    "待核查原文；核心逻辑是人机服务互动可能引发补偿性消费。",
    "用于提出调节变量：孤独、自我威胁、现实关系缺口。",
    "不是恋爱/游戏场景；需谨慎迁移。",
    "not downloaded; publisher page to verify",
    `DOI candidate; accessed ${accessDate}`,
  ],
  [
    "longoni_2019_medical_ai_resistance",
    "AI接受/独特性忽视",
    "医疗AI消费者、算法抵触、独特性忽视",
    "定量-实验",
    "Resistance to Medical Artificial Intelligence",
    "Chiara Longoni; Andrea Bonezzi; Carey K. Morewedge",
    2019,
    "Journal of Consumer Research",
    "消费者研究顶刊; AI接受机制",
    "10.1086/705920",
    "https://doi.org/10.1086/705920",
    "needs_primary_source",
    "研究消费者为何抵触医疗 AI，核心机制是认为 AI 会忽视个人独特性。对乙游很有启发：玩家也可能怀疑脚本/AI不懂“我的特殊性”。",
    "medical AI; algorithm aversion; uniqueness neglect; consumer resistance; personalization",
    "消费者为什么抵触 AI，即使 AI 可能表现更好？",
    "多项实验。",
    "实验参与者；需原文确认样本量。",
    "uniqueness neglect; AI resistance; personalization; risk perception",
    "可解释乙游中自动化互动的风险：当玩家意识到关系是模板化/批量化，会损害亲密感。",
    "待核查原文；已知核心结论是独特性忽视驱动 AI 抵触。",
    "用于构建“感知独特性/专属性”作为数字亲密关系的关键前因。",
    "医疗高风险场景，与娱乐低风险消费不同。",
    "not downloaded; publisher page to verify",
    `DOI candidate; accessed ${accessDate}`,
  ],
  [
    "castelo_2019_algorithm_aversion",
    "算法厌恶/任务主观性",
    "算法建议、主观/客观任务、消费者算法接受",
    "定量-实验",
    "Task-Dependent Algorithm Aversion",
    "Noah Castelo; Maarten W. Bos; Donald R. Lehmann",
    2019,
    "Journal of Marketing Research",
    "营销研究顶刊; 算法接受实证",
    "10.1177/0022243719851788",
    "https://doi.org/10.1177/0022243719851788",
    "needs_primary_source",
    "研究消费者对算法建议的接受取决于任务类型；主观、情感和直觉任务中消费者更可能厌恶算法。",
    "algorithm aversion; subjective tasks; consumer decision making; artificial intelligence",
    "消费者何时接受或拒绝算法建议？任务类型如何影响算法厌恶？",
    "实验研究。",
    "实验参与者；需原文确认样本量。",
    "algorithm aversion; task objectivity; subjectivity; affective tasks",
    "乙游的恋爱陪伴高度主观/情感化，因此算法/AI披露可能引发关系真实性问题。",
    "待核查原文；核心逻辑是主观任务中算法接受度更低。",
    "用于解释为什么乙游玩家既需要AI互动，又可能抗拒“这是AI/脚本”。",
    "算法建议场景；需迁移到娱乐陪伴产品。",
    "not downloaded; publisher page to verify",
    `DOI candidate; accessed ${accessDate}`,
  ],
  [
    "luo_2019_ai_chatbot_disclosure",
    "AI披露/购买转化",
    "AI聊天机器人、销售线索、披露、购买转化",
    "定量-现场实验/大数据",
    "Frontiers: Machines vs. Humans: The Impact of Artificial Intelligence Chatbot Disclosure on Customer Purchases",
    "Xueming Luo; Siliang Tong; Zheng Fang; Zhe Qu",
    2019,
    "Marketing Science",
    "营销科学顶刊; AI聊天机器人实证",
    "10.1287/mksc.2019.1192",
    "https://doi.org/10.1287/mksc.2019.1192",
    "needs_primary_source",
    "研究 AI 聊天机器人披露对购买的影响，据相关引用，该研究发现披露机器人身份会降低购买表现，原因涉及感知共情不足。",
    "AI chatbot; disclosure; customer purchase; field experiment; empathy",
    "客户知道自己在和 AI 聊天后，购买行为是否改变？",
    "现场数据/现场实验或准实验；需原文确认。",
    "销售聊天和购买转化数据；需原文确认规模。",
    "chatbot disclosure; purchase rate; perceived empathy; sales conversion",
    "可直接迁移到乙游：当玩家知道角色回应是自动化/AI生成，是否降低付费和亲密感？",
    "待核查原文；文献常被引用为 AI披露会降低购买率。",
    "用于设计乙游实验：角色消息是否披露AI生成 × 情绪价值 × 付费意愿。",
    "销售客服场景，不是虚拟恋爱；需考虑娱乐情境可能不同。",
    "not downloaded; publisher page to verify",
    `DOI candidate; accessed ${accessDate}`,
  ],
  [
    "kumar_2019_customer_engagement_service",
    "顾客参与服务/新近综述",
    "服务业顾客参与、价值、企业绩效和研究议程",
    "理论/综述",
    "Customer Engagement in Service",
    "V. Kumar; Bharath Rajan; Sunil Gupta; Ilaria Dalla Pozza",
    2019,
    "Journal of the Academy of Marketing Science",
    "营销顶刊; 顾客参与综述",
    "10.1007/s11747-017-0565-2",
    "https://doi.org/10.1007/s11747-017-0565-2",
    "needs_primary_source",
    "文章总结服务场景中的顾客参与，适合补充乙游作为持续服务产品的参与机制。",
    "customer engagement; service; customer value; firm performance; engagement behaviors",
    "服务场景中的顾客参与如何定义、管理和影响价值？",
    "理论/综述。",
    "文献整合。",
    "customer engagement; value creation; engagement behaviors; service outcomes",
    "把乙游玩家日常登录、剧情互动、社群分享、二创和消费理解为服务参与。",
    "顾客参与不仅是购买，还包括多种互动和价值共创行为。",
    "用于完善结果变量：不只付费，还包括留存、口碑、社群贡献。",
    "非游戏场景。",
    "not downloaded; publisher page to verify",
    `DOI candidate; accessed ${accessDate}`,
  ],
  [
    "harmeling_2017_customer_engagement_marketing",
    "顾客参与营销",
    "企业主动激发顾客参与、关系营销和价值共创",
    "理论/综述",
    "Toward a Theory of Customer Engagement Marketing",
    "Colleen M. Harmeling; Jordan W. Moffett; Mark J. Arnold; Brad D. Carlson",
    2017,
    "Journal of the Academy of Marketing Science",
    "营销顶刊; 参与营销理论",
    "10.1007/s11747-016-0509-2",
    "https://doi.org/10.1007/s11747-016-0509-2",
    "needs_primary_source",
    "提出顾客参与营销理论，关注企业如何通过营销活动激发顾客超越交易的行为。",
    "customer engagement marketing; relationship marketing; value co-creation; engagement behaviors",
    "企业如何设计营销活动来激发顾客参与？",
    "理论建构。",
    "文献整合。",
    "engagement marketing; customer resources; firm-initiated engagement",
    "乙游限时活动、生日活动、签到、角色短信、抽卡活动都可被解释为顾客参与营销。",
    "顾客参与营销通过调动顾客资源和互动行为创造价值。",
    "用于分析乙游运营活动如何将情绪价值转化为持续参与和消费。",
    "需补乙游具体运营数据验证。",
    "not downloaded; publisher page to verify",
    `DOI candidate; accessed ${accessDate}`,
  ],
  [
    "sokolova_kefi_2020_influencers",
    "拟社会互动/购买意向",
    "Instagram/YouTube影响者受众、可信度、拟社会互动和购买意向",
    "定量-问卷/SEM",
    "Instagram and YouTube Bloggers Promote It, Why Should I Buy? How Credibility and Parasocial Interaction Influence Purchase Intentions",
    "Karina Sokolova; Hajer Kefi",
    2020,
    "Journal of Retailing and Consumer Services",
    "零售/消费者服务高水平期刊; 拟社会互动实证",
    "10.1016/j.jretconser.2019.01.011",
    "https://doi.org/10.1016/j.jretconser.2019.01.011",
    "needs_primary_source",
    "研究影响者可信度和拟社会互动如何影响购买意向；对乙游角色作为虚拟影响者/虚拟伴侣的商业影响很有参考价值。",
    "parasocial interaction; influencer marketing; credibility; purchase intention; social media",
    "影响者可信度和拟社会互动如何影响购买意向？",
    "问卷/结构模型；据二级来源样本为法国时尚美妆影响者受众。",
    "社交媒体影响者受众问卷；需原文确认样本量和变量。",
    "credibility; parasocial interaction; purchase intention; influencer attachment",
    "乙游男主可类比为持续曝光、人格化、可互动的虚拟影响者，拟社会互动可预测购买。",
    "拟社会互动和可信度影响消费者购买意向，年轻用户尤其重视个人依恋。",
    "用于支撑“数字亲密关系 -> 付费意愿”的定量路径。",
    "影响者不是游戏角色；商品推荐关系和恋爱陪伴关系不同。",
    "not downloaded; publisher page to verify",
    `DOI candidate; accessed ${accessDate}`,
  ],
  [
    "xiang_2016_social_commerce_impulse",
    "社交商务/冲动购买",
    "社交商务平台用户、拟社会互动、冲动购买",
    "定量-问卷/SEM",
    "Exploring Consumers’ Impulse Buying Behavior on Social Commerce Platform: The Role of Parasocial Interaction",
    "Li Xiang; Xiabing Zheng; Matthew K. O. Lee; Dingtao Zhao",
    2016,
    "International Journal of Information Management",
    "信息管理高水平期刊; 拟社会互动与冲动购买",
    "10.1016/j.ijinfomgt.2015.11.002",
    "https://doi.org/10.1016/j.ijinfomgt.2015.11.002",
    "needs_primary_source",
    "研究社交商务中拟社会互动对冲动购买行为的作用，适合连接乙游中的限时活动、角色互动和冲动氪金。",
    "social commerce; parasocial interaction; impulse buying; consumer behavior",
    "社交商务中的拟社会互动如何影响冲动购买？",
    "问卷/结构模型；需原文确认。",
    "社交商务用户问卷数据。",
    "parasocial interaction; impulse buying; social commerce; affective response",
    "乙游付费常有强即时情绪和限时稀缺，冲动购买机制值得引入。",
    "待核查原文；核心为拟社会互动推动社交商务冲动购买。",
    "用于构建“角色亲密感 × 限时抽卡 -> 冲动付费”的机制。",
    "社交商务平台与游戏抽卡机制不同。",
    "not downloaded; publisher page to verify",
    `DOI candidate; accessed ${accessDate}`,
  ],
  [
    "wirtz_2018_brave_new_world_service_robots",
    "拟人化/机器人服务接受",
    "服务机器人拟人化、社会存在和顾客接受",
    "定量-实验/问卷",
    "Brave New World: Service Robots in the Frontline",
    "Jochen Wirtz; Paul G. Patterson; Werner H. Kunz; Thorsten Gruber; Vinh Nhat Lu; Stefanie Paluch; Antje Martins",
    2018,
    "Journal of Service Management",
    "服务机器人近年综述; 待精确核源",
    "10.1108/JOSM-04-2016-0119",
    "https://doi.org/10.1108/JOSM-04-2016-0119",
    "needs_primary_source",
    "服务机器人和数字人研究集中讨论拟人化、社会存在、顾客接受和服务体验，可为乙游虚拟男主的拟人化设计提供变量。",
    "service robots; anthropomorphism; social presence; customer acceptance; service experience",
    "服务机器人文献如何解释顾客接受和体验？",
    "综述/实证文献候选，需进一步核定具体文章。",
    "待核查。",
    "anthropomorphism; social presence; service acceptance",
    "补充虚拟男主设计维度：人形感、温暖、能力、拟人化、社会存在。",
    "待核查。",
    "保留为候选方向，不作为最终证据。",
    "需精确检索并替换为正式文献。",
    "not downloaded; DOI page to verify",
    `DOI candidate; accessed ${accessDate}`,
  ],
  [
    "mouritzen_2024_virtual_influencer_marketing",
    "虚拟影响者营销",
    "虚拟影响者、品牌合作、真实性和消费者反应",
    "理论/综述",
    "Virtual Influencer Marketing: The Good, the Bad and the Unreal",
    "Simone Lykke Tranholm Mouritzen; Valeria Penttinen; Susanne Pedersen",
    2024,
    "European Journal of Marketing",
    "营销高水平期刊; 虚拟人/虚拟影响者",
    "no_doi: needs verification",
    "publisher source pending",
    "needs_primary_source",
    "围绕虚拟影响者营销的优势、风险和虚拟性问题展开，适合补充乙游男主作为品牌化虚拟人格/数字代言人的商业逻辑。",
    "virtual influencers; influencer marketing; authenticity; consumer response; virtuality",
    "虚拟影响者营销有哪些机会、风险和真实性问题？",
    "理论/综述或概念研究；需原文确认。",
    "文献整合；需原文确认。",
    "virtual influencer; authenticity; disclosure; brand endorsement; consumer trust",
    "乙游角色也可被视为虚拟影响者/虚拟偶像，承担情感关系和商业转化双重职能。",
    "待核查原文；预计指出虚拟影响者带来控制力、品牌安全和真实性风险。",
    "用于连接乙游角色商业化、周边/IP、社交媒体运营。",
    "不是游戏消费文献。",
    "not downloaded; publisher page to verify",
    `candidate from secondary source; accessed ${accessDate}`,
  ],
  [
    "dabiran_2024_virtually_human",
    "虚拟影响者拟人化",
    "虚拟影响者、拟人化、消费者信任和参与",
    "定量-实证",
    "Virtually Human: Anthropomorphism in Virtual Influencer Marketing",
    "Ehsan Dabiran; Samira Farivar; Fang Wang; Gerald Grant",
    2024,
    "Journal of Retailing and Consumer Services",
    "零售/消费者服务高水平期刊; 虚拟人实证",
    "no_doi: needs verification",
    "publisher source pending",
    "needs_primary_source",
    "研究虚拟影响者营销中的拟人化，适合解释乙游男主人设、语音、互动动作和3D建模如何增强亲密感与信任。",
    "virtual influencers; anthropomorphism; trust; engagement; purchase intention",
    "虚拟影响者的拟人化如何影响消费者反应？",
    "实证研究；需原文确认方法和样本。",
    "消费者样本；需原文确认。",
    "anthropomorphism; perceived humanness; trust; engagement; purchase intention",
    "为乙游3D男主、短信互动、语音陪伴的人格化设计提供近年营销证据。",
    "待核查原文。",
    "用于测量乙游角色拟人化和真实感。",
    "需核验 DOI 和结论。",
    "not downloaded; publisher page to verify",
    `candidate from secondary source; accessed ${accessDate}`,
  ],
  [
    "sorosrungruang_2024_generative_ai_virtual_influencers",
    "生成式AI虚拟影响者",
    "生成式AI虚拟影响者、人类反应、真实感和品牌互动",
    "定量/质性-混合或实验",
    "How Real Is Real Enough? Unveiling the Diverse Power of Generative AI-Enabled Virtual Influencers and the Dynamics of Human Responses",
    "Tippayanet Sorosrungruang; Nisreen Ameen; Chris Hackley",
    2024,
    "Psychology & Marketing",
    "消费者心理/营销高水平期刊; 生成式AI虚拟人",
    "no_doi: needs verification",
    "publisher source pending",
    "needs_primary_source",
    "研究生成式AI虚拟影响者的真实感和消费者反应，可用于乙游中AI男主/数字伴侣真实感的边界讨论。",
    "generative AI; virtual influencers; perceived realism; consumer response; authenticity",
    "生成式AI虚拟影响者需要多真实才足够？真实感如何影响消费者反应？",
    "待核查：可能为实验或混合方法。",
    "待核查。",
    "perceived realism; authenticity; human response; virtual influencer",
    "乙游《恋与深空》3D写实化和AI互动升级都涉及“真实到什么程度才有效/舒适”的问题。",
    "待核查原文。",
    "用于提出调节变量：角色真实感、恐怖谷、真实性披露。",
    "需核验正式来源。",
    "not downloaded; publisher page to verify",
    `candidate from secondary source; accessed ${accessDate}`,
  ],
  [
    "packard_berger_2024_consumer_language",
    "消费者语言/对话互动",
    "消费者语言、AI文本、语音交互、品牌对话",
    "理论/综述",
    "The Emergence and Evolution of Consumer Language Research",
    "Grant Packard; Jonah Berger",
    2024,
    "Journal of Consumer Research",
    "消费者研究顶刊; 近年语言/对话综述",
    "10.1093/jcr/ucad013",
    "https://doi.org/10.1093/jcr/ucad013",
    "verified_primary",
    "文章回顾消费者语言研究的兴起与演进，指出研究从单向广告语言转向双向对话，并强调语音和文本交互的新机会。",
    "consumer language; communication; speaking; writing; automated text analysis; dialogue",
    "消费者语言研究如何演进？未来有哪些与语音/文本互动相关的问题？",
    "综述/研究议程。",
    "文献整合；无单一样本。",
    "language; dialogue; voice; writing; automated text analysis",
    "乙游的短信、电话、语音、AI聊天和玩家评论都是语言互动数据，该文可支撑语言/文本分析方法。",
    "消费者语言研究已从单向传播走向双向对话，语音和文本交互是未来重点。",
    "用于设计乙游评论/聊天/角色台词的文本分析和语言风格研究。",
    "不是游戏文献，需要结合乙游语料。",
    "publisher page only; access model restricted",
    `published version; accessed ${accessDate}`,
  ],
];

const allRows = [...transformedOldRows, ...addRows];

const workbook = Workbook.create();

function setHeader(range) {
  range.format = { fill: "#1F4E79", font: { bold: true, color: "#FFFFFF" }, wrapText: true };
}

function addSheetWithTable(name, headers, rows, tableName) {
  const sheet = workbook.worksheets.add(name);
  sheet.showGridLines = false;
  const data = [headers, ...rows];
  const range = sheet.getRangeByIndexes(0, 0, data.length, headers.length);
  range.values = data;
  setHeader(sheet.getRangeByIndexes(0, 0, 1, headers.length));
  range.format.borders = { preset: "outside", style: "thin", color: "#B7C9D6" };
  sheet.freezePanes.freezeRows(1);
  const table = sheet.tables.add(range.address, true, tableName);
  table.style = "TableStyleMedium2";
  table.showFilterButton = true;
  range.format.wrapText = true;
  range.format.font = { name: "Aptos", size: 10 };
  return sheet;
}

const readme = workbook.worksheets.add("README");
readme.showGridLines = false;
readme.getRange("A1:H1").merge();
readme.getRange("A1").values = [["乙游、情绪价值、情感消费、数字亲密关系：商学文献矩阵 v2 扩展版"]];
readme.getRange("A1").format = { fill: "#17365D", font: { bold: true, color: "#FFFFFF", size: 16 } };
readme.getRange("A3:B12").values = [
  ["研究方向", "情绪价值的商业化：女性向游戏中的数字亲密关系、品牌依恋与持续消费"],
  ["更新日期", accessDate],
  ["主表文献数", allRows.length],
  ["本轮新增", addRows.length],
  ["新增列", "研究对象；文献类型"],
  ["新增重点", "近年AI营销、AI服务、机器人/自动化社会临场感、虚拟影响者、拟社会互动、数字自我、消费者语言"],
  ["证据状态说明", "verified_primary=已核到一手页面；needs_primary_source=保留 DOI/线索但需继续打开原始页面；unverified=方向占位，不进入正式论证。"],
  ["建议优先阅读", "Davenport et al. 2020; Huang & Rust 2018; van Doorn et al. 2017; Park et al. 2010; Batra et al. 2012; Labrecque 2014; Zhou et al. 2024"],
  ["研究设计建议", "问卷SEM + 实验(AI披露/角色真实感/限时活动) + netnography/访谈 + 游戏评论与社群文本分析"],
  ["下一步", "继续用 Web of Science/Scopus/CNKI 核验 needs_primary_source 行，下载学校可访问 PDF。"],
];
readme.getRange("A3:A12").format = { fill: "#D9EAF7", font: { bold: true } };
readme.getRange("A3:B12").format.borders = { preset: "all", style: "thin", color: "#C7D6E2" };

const matrix = addSheetWithTable("Matrix", newHeaders, allRows, "LiteratureMatrixV2");

const queryRows = [
  ["recent_ai_marketing", "\"artificial intelligence\" marketing consumer experience Journal of the Academy of Marketing Science 2020 2021", "AI营销/消费者体验"],
  ["ai_service", "\"Artificial Intelligence in Service\" \"Journal of Service Research\"; \"automated social presence\" service robots", "AI服务/情感智能/社会临场感"],
  ["ai_acceptance", "\"algorithm aversion\" \"Journal of Marketing Research\"; \"Resistance to Medical Artificial Intelligence\" JCR", "AI接受/独特性/任务主观性"],
  ["virtual_influencer", "\"virtual influencer\" \"European Journal of Marketing\" \"Psychology & Marketing\" \"Journal of Retailing and Consumer Services\"", "虚拟影响者/拟人化/真实感"],
  ["parasocial_purchase", "\"parasocial interaction\" purchase intention social commerce influencer marketing", "拟社会互动与购买/冲动消费"],
  ["digital_self_goods", "\"extended self\" digital world virtual goods consumer research", "数字自我/虚拟商品/乙游账号资产"],
];
addSheetWithTable("Search Queries", ["search_stratum", "exact_query_or_seed", "purpose"], queryRows, "SearchQueriesV2");

const openQuestions = [
  ["Q1", "新增的 virtual influencer 行中有几条来自二级线索，需用学校数据库或出版社检索核验 DOI、摘要、样本和结论。"],
  ["Q2", "若论文目标是商学顶刊，建议主模型不要只写“乙游”，而是写“AI/数字角色驱动的情感消费和品牌依恋”，乙游作为高适配场景。"],
  ["Q3", "新增“研究对象”后，建议筛选：AI服务/机器人、虚拟影响者、消费者-品牌关系、乙游/数字亲密四组分别建理论段落。"],
  ["Q4", "新增“文献类型”后，建议正式综述中区分理论文献、实验文献、问卷SEM、质性/netnography、现场数据。"],
  ["Q5", "需要继续补国内CSSCI和中文管理/营销文献，尤其是情绪价值、女性消费、虚拟偶像、数字人营销、盲盒/抽卡消费。"],
];
addSheetWithTable("Open Questions", ["id", "open_question"], openQuestions, "OpenQuestionsV2");

const widths = [28, 22, 34, 18, 46, 42, 10, 28, 26, 24, 40, 20, 72, 42, 54, 56, 56, 44, 56, 58, 58, 46, 30, 24];
widths.forEach((w, i) => {
  matrix.getRangeByIndexes(0, i, 1, 1).format.columnWidth = w;
});
matrix.getUsedRange().format.autofitRows();
readme.getRange("A:A").format.columnWidth = 18;
readme.getRange("B:B").format.columnWidth = 120;

matrix.getRange("D2:D200").dataValidation = { rule: { type: "list", values: ["理论/综述", "质性", "定量-问卷/SEM", "定量-实验", "定量-现场实验/大数据", "定量-元分析", "混合方法", "待核查"] } };
matrix.getRange("L2:L200").dataValidation = { rule: { type: "list", values: ["verified_primary", "needs_primary_source", "needs_pdf", "needs_version_check", "secondary_only", "unverified"] } };

const inspect = await workbook.inspect({
  kind: "table",
  sheetId: "Matrix",
  range: "A1:L10",
  include: "values",
  tableMaxRows: 10,
  tableMaxCols: 12,
  maxChars: 2500,
});
console.log(inspect.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

await fs.mkdir(outputDir, { recursive: true });
const preview = await workbook.render({ sheetName: "README", autoCrop: "all", scale: 1, format: "png" });
await fs.writeFile(`${outputDir}/literature_matrix_v2_readme_preview.png`, new Uint8Array(await preview.arrayBuffer()));
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);
console.log(`SAVED ${outputPath}`);
