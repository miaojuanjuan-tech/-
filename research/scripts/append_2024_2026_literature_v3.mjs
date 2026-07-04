import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const accessDate = "2026-07-04";
const inputPath = "outputs/乙游_情绪价值_情感消费_数字亲密关系_商学文献矩阵_v2_扩展版.xlsx";
const outputDir = "outputs";
const outputPath = `${outputDir}/乙游_情绪价值_情感消费_数字亲密关系_商学文献矩阵_v3_近两年扩展版.xlsx`;

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const matrix = workbook.worksheets.getItem("Matrix");
const values = matrix.getUsedRange().values;
const headers = values[0];
const rows = values.slice(1);
const titleIndex = headers.indexOf("题目");
const paperIdIndex = headers.indexOf("paper_id");
const doiIndex = headers.findIndex((h) => String(h).includes("DOI"));
const urlIndex = headers.findIndex((h) => String(h).includes("URL"));
const statusIndex = headers.indexOf("验证状态");
const venueIndex = headers.findIndex((h) => String(h).includes("期刊/来源"));
const yearIndex = headers.indexOf("年份");
const sourceNoteIndex = headers.indexOf("来源备注");
const localPathIndex = headers.indexOf("原文下载/本地路径");

function row({
  paperId,
  position,
  object,
  type,
  title,
  authors,
  year,
  venue,
  tier,
  doi,
  url,
  status,
  abstract,
  keywords,
  rq,
  design,
  data,
  mechanism,
  contribution,
  findings,
  relevance,
  limitations,
  localPath = "not downloaded; DOI/publisher page to verify",
  note,
}) {
  return [
    paperId,
    position,
    object,
    type,
    title,
    authors,
    year,
    venue,
    tier,
    doi,
    url,
    status,
    abstract,
    keywords,
    rq,
    design,
    data,
    mechanism,
    contribution,
    findings,
    relevance,
    limitations,
    localPath,
    note ?? `Crossref/DOI candidate; accessed ${accessDate}`,
  ];
}

const updates = [
  {
    matchTitle: "AI Companions Reduce Loneliness",
    changes: {
      year: 2025,
      venue: "Journal of Consumer Research",
      doi: "10.1093/jcr/ucaf040",
      url: "https://doi.org/10.1093/jcr/ucaf040",
      status: "verified_crossref",
      localPath: "D:\\乙游\\文献\\DeFreitas_2024_AI_Companions_Reduce_Loneliness_arXiv2407.19096.pdf; published JCR DOI to verify",
      note: `Crossref shows JCR publication DOI; local arXiv PDF already saved; accessed ${accessDate}`,
    },
  },
  {
    matchTitle: "Emotional Manipulation by AI Companions",
    changes: {
      doi: "10.2139/ssrn.5390377",
      url: "https://doi.org/10.2139/ssrn.5390377",
      status: "verified_crossref_working_paper",
      localPath: "D:\\乙游\\文献\\DeFreitas_2025_Emotional_Manipulation_by_AI_Companions_arXiv2508.19258.pdf; SSRN DOI to verify",
      note: `Crossref/SSRN DOI found; local arXiv PDF already saved; accessed ${accessDate}`,
    },
  },
  {
    matchTitle: "Virtual influencer marketing: the good, the bad and the unreal",
    changes: {
      doi: "10.1108/ejm-12-2022-0915",
      url: "https://doi.org/10.1108/ejm-12-2022-0915",
      status: "verified_crossref",
      note: `Crossref record verified; accessed ${accessDate}`,
    },
  },
  {
    matchTitle: "Virtually Human: Anthropomorphism in Virtual Influencer Marketing",
    changes: {
      doi: "10.1016/j.jretconser.2024.103797",
      url: "https://doi.org/10.1016/j.jretconser.2024.103797",
      status: "verified_crossref",
      note: `Crossref record verified; accessed ${accessDate}`,
    },
  },
  {
    matchTitle: "How Real Is Real Enough? Unveiling the Diverse Power of Generative AI-Enabled Virtual Influencers and the Dynamics of Human Responses",
    changes: {
      doi: "10.1002/mar.22105",
      url: "https://doi.org/10.1002/mar.22105",
      status: "verified_crossref",
      note: `Crossref record verified; accessed ${accessDate}`,
    },
  },
];

for (const update of updates) {
  const existing = rows.find((r) => String(r[titleIndex]).toLowerCase() === update.matchTitle.toLowerCase());
  if (!existing) continue;
  const c = update.changes;
  if (c.year !== undefined && yearIndex >= 0) existing[yearIndex] = c.year;
  if (c.venue !== undefined && venueIndex >= 0) existing[venueIndex] = c.venue;
  if (c.doi !== undefined && doiIndex >= 0) existing[doiIndex] = c.doi;
  if (c.url !== undefined && urlIndex >= 0) existing[urlIndex] = c.url;
  if (c.status !== undefined && statusIndex >= 0) existing[statusIndex] = c.status;
  if (c.localPath !== undefined && localPathIndex >= 0) existing[localPathIndex] = c.localPath;
  if (c.note !== undefined && sourceNoteIndex >= 0) existing[sourceNoteIndex] = c.note;
}

const addRows = [
  row({
    paperId: "liu_wang_2025_virtual_influencer_uncanny_valley",
    position: "虚拟影响者/拟社会关系",
    object: "虚拟影响者粉丝、品牌受众、不同文化/群体消费者",
    type: "定量-问卷/多群组比较",
    title: "Fostering Parasocial Relationships with Virtual Influencers in the Uncanny Valley: Anthropomorphism, Autonomy, and a Multigroup Comparison",
    authors: "Fang Liu; Rui Wang",
    year: 2025,
    venue: "Journal of Business Research",
    tier: "商学高水平期刊; 虚拟影响者与拟社会关系前沿",
    doi: "10.1016/j.jbusres.2024.115024",
    url: "https://doi.org/10.1016/j.jbusres.2024.115024",
    status: "verified_crossref",
    abstract: "围绕虚拟影响者在恐怖谷附近如何通过拟人化和自主性塑造拟社会关系，比较不同群体反应。",
    keywords: "virtual influencer; parasocial relationship; uncanny valley; anthropomorphism; autonomy",
    rq: "虚拟影响者的拟人化与自主性如何影响消费者形成拟社会关系？这种机制是否存在群体差异？",
    design: "定量实证/多群组比较；具体量表、样本和模型需打开全文核验。",
    data: "消费者调查数据；样本细节待全文核验。",
    mechanism: "拟人化、自主性、恐怖谷感知、拟社会关系、品牌/互动结果。",
    contribution: "把虚拟影响者研究推进到关系形成和群体异质性，适合支撑乙游角色真实感和互动自主性感知。",
    findings: "Crossref题录确认；具体结果方向待全文抽取。",
    relevance: "可直接迁移到乙游男主/AI角色的拟社会关系、真实感、恐怖谷边界和持续互动意愿。",
    limitations: "目前只核到Crossref/DOI，需进一步下载或打开全文确认样本和结论。",
  }),
  row({
    paperId: "wirtz_stockhomburg_2025_generative_ai_service_robots",
    position: "生成式AI/服务机器人",
    object: "服务机器人、AI代理、顾客-机器服务接触",
    type: "理论/综述",
    title: "Generative AI Meets Service Robots",
    authors: "Jochen Wirtz; Ruth Stock-Homburg",
    year: 2025,
    venue: "Journal of Service Research",
    tier: "服务营销顶刊; 2025 online first",
    doi: "10.1177/10946705251340487",
    url: "https://doi.org/10.1177/10946705251340487",
    status: "verified_crossref",
    abstract: "讨论生成式AI与服务机器人结合后对服务交互、自动化、顾客体验和管理议题的影响。",
    keywords: "generative AI; service robots; customer experience; service encounter; automation",
    rq: "生成式AI如何改变服务机器人的能力边界、服务接触和顾客体验？",
    design: "概念/研究议程；全文需进一步核验框架细节。",
    data: "既有AI、服务机器人和服务管理文献。",
    mechanism: "生成式能力、对话性、社会临场感、服务自动化、顾客体验。",
    contribution: "为乙游中AI男主/虚拟角色作为服务代理提供服务研究视角。",
    findings: "Crossref题录确认；具体命题待全文抽取。",
    relevance: "可用于论证乙游不只是内容产品，也是持续服务接触和AI代理互动。",
    limitations: "概念性强，需与消费者实证文献搭配。",
  }),
  row({
    paperId: "hollebeek_2024_ai_technologies_engagement_review",
    position: "AI技术/消费者参与",
    object: "消费者与人工智能技术互动",
    type: "系统综述/概念模型",
    title: "Engaging consumers through artificially intelligent technologies: Systematic review, conceptual model, and further research",
    authors: "Linda D. Hollebeek; Choukri Menidjel; Marko Sarstedt; Johan Jansson; Sigitas Urbonavicius",
    year: 2024,
    venue: "Psychology & Marketing",
    tier: "营销/消费者心理高水平期刊; AI消费者参与综述",
    doi: "10.1002/mar.21957",
    url: "https://doi.org/10.1002/mar.21957",
    status: "verified_crossref",
    abstract: "系统综述人工智能技术如何激发消费者参与，并提出概念模型和未来研究方向。",
    keywords: "artificial intelligence; consumer engagement; systematic review; conceptual model",
    rq: "AI技术如何影响消费者参与？既有文献有哪些机制和未来研究缺口？",
    design: "系统文献综述/概念模型；纳入标准和编码框架需全文核验。",
    data: "AI消费者参与相关既有文献。",
    mechanism: "AI互动、参与、体验、信任、价值共创。",
    contribution: "把AI技术与消费者参与系统连接，能帮助构建乙游持续互动和付费参与路径。",
    findings: "Crossref题录确认；综述结论待全文抽取。",
    relevance: "适合作为乙游用户参与、AI互动和持续消费变量的综述入口。",
    limitations: "不是乙游场景，需要与游戏/虚拟角色文献结合。",
  }),
  row({
    paperId: "barrett_2024_customer_engagement_hedonic_utilitarian",
    position: "享乐服务/消费者参与",
    object: "享乐型与功利型服务场景中的顾客",
    type: "定量/服务研究",
    title: "Customer Engagement in Utilitarian vs. Hedonic Service Contexts",
    authors: "Jenna Adriana Maeve Barrett; Elina Jaakkola; Jonas Heller; Elisabeth Christine Brüggen",
    year: 2024,
    venue: "Journal of Service Research",
    tier: "服务营销顶刊; 享乐服务与参与",
    doi: "10.1177/10946705241242901",
    url: "https://doi.org/10.1177/10946705241242901",
    status: "verified_crossref",
    abstract: "比较功利型和享乐型服务中顾客参与的形成机制和表现差异。",
    keywords: "customer engagement; hedonic service; utilitarian service; service context",
    rq: "享乐型服务与功利型服务中，顾客参与的驱动因素和结果有何差异？",
    design: "服务研究实证；具体样本、模型和结果需全文核验。",
    data: "顾客/服务场景数据；细节待全文。",
    mechanism: "享乐价值、功利价值、顾客参与、服务体验。",
    contribution: "为把乙游定位为享乐/情感服务而不是单纯游戏商品提供服务研究依据。",
    findings: "Crossref题录确认；具体结果待全文抽取。",
    relevance: "可支撑乙游情绪价值和持续参与的服务语境分类。",
    limitations: "场景不一定是数字游戏，需要在综述中说明外推边界。",
  }),
  row({
    paperId: "looi_kahlor_2024_ai_influencer_mixed_method",
    position: "AI影响者/虚拟影响者",
    object: "Instagram人类影响者与虚拟影响者受众",
    type: "混合方法",
    title: "Artificial Intelligence in Influencer Marketing: A Mixed-Method Comparison of Human and Virtual Influencers on Instagram",
    authors: "Jiemin Looi; Lee Ann Kahlor",
    year: 2024,
    venue: "Journal of Interactive Advertising",
    tier: "互动广告高水平期刊; 虚拟影响者实证",
    doi: "10.1080/15252019.2024.2313721",
    url: "https://doi.org/10.1080/15252019.2024.2313721",
    status: "verified_crossref",
    abstract: "比较人类影响者和虚拟影响者在Instagram营销中的受众反应，采用混合方法。",
    keywords: "AI influencer; virtual influencer; influencer marketing; Instagram; mixed methods",
    rq: "消费者如何评价人类影响者和虚拟影响者？两者对参与和营销效果有何差异？",
    design: "混合方法；具体质性/定量模块需全文核验。",
    data: "Instagram影响者/受众相关数据；细节待全文。",
    mechanism: "真实性、可信度、互动性、社会临场感、参与。",
    contribution: "提供人类/虚拟角色对比，帮助乙游分析虚拟男主为何仍能产生情感连接。",
    findings: "Crossref题录确认；具体结果待全文抽取。",
    relevance: "适合比较乙游虚拟角色、虚拟偶像和真人陪伴/社群互动的替代与互补关系。",
    limitations: "平台为Instagram，需谨慎迁移到游戏内付费互动。",
  }),
  row({
    paperId: "liu_xu_yu_gong_2025_emotional_engagement_virtual_influencer",
    position: "情感参与/虚拟背书",
    object: "虚拟影响者背书场景中的消费者",
    type: "定量-实证",
    title: "Bridging the virtual and real: emotional engagement in virtual influencer endorsements",
    authors: "Haiwen Liu; Jia Xu; Kaidong Yu; Jiankun Gong",
    year: 2025,
    venue: "Young Consumers",
    tier: "消费者青年市场补充期刊; 情感参与前沿",
    doi: "10.1108/yc-12-2024-2372",
    url: "https://doi.org/10.1108/yc-12-2024-2372",
    status: "verified_crossref",
    abstract: "聚焦虚拟影响者背书中的情感参与，解释虚拟与现实之间的消费者反应。",
    keywords: "virtual influencer; emotional engagement; endorsement; young consumers",
    rq: "虚拟影响者背书如何激发消费者情感参与并影响品牌/购买反应？",
    design: "定量实证；具体样本和模型需全文核验。",
    data: "年轻消费者/虚拟影响者背书数据；细节待全文。",
    mechanism: "情感参与、虚拟真实感、背书效果、品牌反应。",
    contribution: "将情感参与直接放入虚拟角色商业化链条。",
    findings: "Crossref题录确认；具体结论待全文抽取。",
    relevance: "与乙游'情绪价值-品牌依恋-持续消费'链条高度贴近。",
    limitations: "期刊层级低于JCR/JSR/JBR，作为近年主题补充更合适。",
  }),
  row({
    paperId: "tian_2025_virtual_influencers_interactive_marketing_review",
    position: "虚拟影响者/互动营销综述",
    object: "互动营销中的虚拟影响者研究",
    type: "综述",
    title: "Virtual influencers in interactive marketing: a state-of-art review and future research directions",
    authors: "Min Tian; Haiqiang Hu; Meimei Chen",
    year: 2025,
    venue: "Journal of Research in Interactive Marketing",
    tier: "互动营销高水平期刊; 2025综述",
    doi: "10.1108/jrim-03-2025-0123",
    url: "https://doi.org/10.1108/jrim-03-2025-0123",
    status: "verified_crossref",
    abstract: "梳理互动营销中虚拟影响者研究现状并提出未来研究方向。",
    keywords: "virtual influencers; interactive marketing; literature review; future research",
    rq: "虚拟影响者互动营销研究有哪些主题、方法和未来方向？",
    design: "文献综述；检索范围和编码需全文核验。",
    data: "虚拟影响者互动营销文献。",
    mechanism: "互动性、真实性、拟人化、信任、消费者参与。",
    contribution: "为快速搭建虚拟角色营销文献版图提供近年综述入口。",
    findings: "Crossref题录确认；综述发现待全文抽取。",
    relevance: "可用于乙游文献综述的近年虚拟角色/影响者分支定位。",
    limitations: "综述型文献不能替代核心实证证据。",
  }),
  row({
    paperId: "jayasingh_2025_ai_influencers_credibility",
    position: "AI影响者/可信度",
    object: "AI影响者受众与电子商务消费者",
    type: "定量-SEM",
    title: "Artificial Intelligence Influencers’ Credibility Effect on Consumer Engagement and Purchase Intention",
    authors: "Sudarsan Jayasingh; Arun Sivakumar; Arputha Arockiaraj Vanathaiyan",
    year: 2025,
    venue: "Journal of Theoretical and Applied Electronic Commerce Research",
    tier: "电子商务补充期刊; AI影响者购买意愿",
    doi: "10.3390/jtaer20010017",
    url: "https://doi.org/10.3390/jtaer20010017",
    status: "verified_crossref",
    abstract: "检验AI影响者可信度对消费者参与和购买意向的影响。",
    keywords: "AI influencers; credibility; consumer engagement; purchase intention",
    rq: "AI影响者可信度如何影响消费者参与和购买意愿？",
    design: "定量模型/SEM倾向；具体量表与样本待全文核验。",
    data: "消费者问卷数据；细节待全文。",
    mechanism: "可信度、参与、购买意向、电子商务行为。",
    contribution: "把虚拟角色的商业转化落到参与和购买意向。",
    findings: "Crossref题录确认；具体路径系数待全文抽取。",
    relevance: "可为乙游角色可信度、品牌依恋和付费意愿建模提供变量参考。",
    limitations: "期刊层级一般，作为近年实证补充。",
  }),
  row({
    paperId: "werner_2024_conversational_ai_steer_consumer_behavior",
    position: "对话式AI/消费者操纵",
    object: "与对话式AI互动的消费者",
    type: "定量-行为实验/预印本",
    title: "Experimental Evidence That Conversational Artificial Intelligence Can Steer Consumer Behavior Without Detection",
    authors: "Tobias Werner; Ivan Soraperra; Emilio Calvano; David C. Parkes; Iyad Rahwan",
    year: 2024,
    venue: "arXiv",
    tier: "预印本; 对话式AI操纵与商业化风险前沿",
    doi: "no_doi: arXiv preprint",
    url: "https://arxiv.org/abs/2409.12143",
    status: "verified_preprint_page",
    abstract: "行为实验显示，对话式AI可能在消费者未察觉的情况下影响偏好与选择，引发商业化和监管担忧。",
    keywords: "conversational AI; consumer behavior; persuasion; manipulation; experiment",
    rq: "对话式AI能否在消费者未察觉的情况下引导偏好和行为？",
    design: "行为实验/预印本；需核验实验任务、样本和操纵。",
    data: "实验参与者行为数据；细节见arXiv全文。",
    mechanism: "对话式推荐、隐性说服、偏好塑造、检测失败。",
    contribution: "为'情绪价值商业化'中的平台操纵和亲密关系货币化风险提供前沿证据。",
    findings: "arXiv摘要报告AI可显著改变消费者偏好且不易被察觉；正式引用需读全文。",
    relevance: "适合放在乙游限时活动、角色话术、AI陪伴劝服和持续付费风险讨论中。",
    limitations: "预印本，非商学顶刊；作为风险机制前沿而非核心顶刊证据。",
    localPath: "not downloaded; arXiv page to download if needed",
    note: `arXiv page found via web search; accessed ${accessDate}`,
  }),
  row({
    paperId: "aggarwal_2024_generative_engine_optimization",
    position: "生成式AI搜索/品牌可见性",
    object: "生成式搜索引擎中的品牌、内容与消费者信息接触",
    type: "会议论文/信息系统-营销相关",
    title: "GEO: Generative Engine Optimization",
    authors: "Pranjal Aggarwal; Vishvak Murahari; Tanmay Rajpurohit; Ashwin Kalyan; Karthik Narasimhan; Ameet Deshpande",
    year: 2024,
    venue: "ACM SIGKDD / arXiv",
    tier: "计算/营销交叉前沿; 品牌在生成式AI答案中的可见性",
    doi: "no_doi: arXiv/ACM record to verify",
    url: "https://arxiv.org/abs/2311.09735",
    status: "needs_version_check",
    abstract: "提出生成式引擎优化问题，研究内容如何在生成式AI答案中被引用和呈现。",
    keywords: "generative engine optimization; AI search; brand visibility; content optimization",
    rq: "内容和品牌如何在生成式AI搜索答案中获得可见性？",
    design: "基准构建/实验评估；正式版本和会议页需核验。",
    data: "GEO-bench/搜索查询与生成式答案数据。",
    mechanism: "AI生成答案、引用、内容优化、品牌露出。",
    contribution: "补充2024后AI平台如何改变品牌接触点和消费者发现路径。",
    findings: "预印本/会议线索显示优化策略可改变生成式答案可见性；具体数值需全文核验。",
    relevance: "若乙游公司开始用AI搜索/AI助手获客，可作为新渠道商业化背景。",
    limitations: "不是情感消费核心文献，放作数字营销环境扩展。",
    localPath: "not downloaded; arXiv/ACM page to verify",
    note: `candidate from web search; accessed ${accessDate}`,
  }),
];

const existingIds = new Set(rows.map((r) => String(r[paperIdIndex])));
const existingTitles = new Set(rows.map((r) => String(r[titleIndex]).toLowerCase()));
const uniqueAddRows = addRows.filter((r) => !existingIds.has(String(r[0])) && !existingTitles.has(String(r[titleIndex]).toLowerCase()));
const allRows = [...rows, ...uniqueAddRows];

const tableValues = [headers, ...allRows];
matrix.getRangeByIndexes(0, 0, tableValues.length, headers.length).values = tableValues;
const used = matrix.getRangeByIndexes(0, 0, tableValues.length, headers.length);
used.format = {
  wrapText: true,
  borders: { preset: "inside", style: "thin", color: "#D9E2F3" },
};
matrix.getRangeByIndexes(0, 0, 1, headers.length).format = {
  fill: "#1F4E79",
  font: { bold: true, color: "#FFFFFF" },
  wrapText: true,
};
matrix.freezePanes.freezeRows(1);
matrix.freezePanes.freezeColumns(4);

const readme = workbook.worksheets.getItem("README");
readme.getRange("A5:B12").values = [
  ["主表文献数", allRows.length],
  ["本轮新增", uniqueAddRows.length],
  ["新增列", "沿用 v2：研究对象；文献类型"],
  ["新增重点", "2024-2026 AI陪伴、生成式AI服务机器人、虚拟影响者、拟社会关系、情感参与、对话式AI操纵"],
  ["证据状态说明", "verified_crossref=已核到Crossref/DOI题录；verified_preprint_page=已核到预印本页面；needs_version_check=需确认正式版本；needs_primary_source=需继续打开一手页面。"],
  ["建议优先阅读", "De Freitas et al. 2025 JCR; Wirtz & Stock-Homburg 2025 JSR; Barrett et al. 2024 JSR; Liu & Wang 2025 JBR; Mouritzen et al. 2024 EJM"],
  ["研究设计建议", "问卷SEM + 实验(AI披露/角色真实感/限时活动) + netnography/访谈 + 游戏评论与社群文本分析"],
  ["下一步", "继续用Web of Science/Scopus/CNKI核验全文，优先下载 JCR/JSR/EJM/JBR/P&M/JRCS 的PDF。"],
];
readme.getRange("A5:A12").format = { fill: "#D9EAF7", font: { bold: true } };
readme.getRange("A1:B12").format = { wrapText: true };

const queries = workbook.worksheets.getItem("Search Queries");
const qUsed = queries.getUsedRange().values;
const qRows = [
  ["2024-2026 Crossref batch", "AI Companions Reduce Loneliness; Generative AI Meets Service Robots; virtual influencer parasocial relationship 2025", "Crossref API + DOI pages", "新增近两年AI陪伴/服务机器人/虚拟影响者核心条目。"],
  ["2024-2026 virtual influencer batch", "virtual influencer emotional engagement; AI influencer credibility; interactive marketing review", "Crossref API", "补充高水平近年主题前沿文献。"],
];
queries.getRangeByIndexes(qUsed.length, 0, qRows.length, qRows[0].length).values = qRows;

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 200 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

const preview = await workbook.render({ sheetName: "README", range: "A1:B12", scale: 2, format: "png" });
await fs.writeFile(`${outputDir}/literature_matrix_v3_readme_preview.png`, new Uint8Array(await preview.arrayBuffer()));

const inspect = await workbook.inspect({
  kind: "table",
  sheetId: "Matrix",
  range: "A1:L12",
  include: "values",
  tableMaxRows: 12,
  tableMaxCols: 12,
  maxChars: 5000,
});
await fs.writeFile(`${outputPath}.inspect.ndjson`, inspect.ndjson);
console.log(inspect.ndjson);

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`SAVED ${outputPath}`);
console.log(`ADDED ${uniqueAddRows.length}`);
console.log(`TOTAL ${allRows.length}`);
