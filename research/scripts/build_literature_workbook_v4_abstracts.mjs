import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "outputs/乙游_情绪价值_情感消费_数字亲密关系_商学文献矩阵_v3_近两年扩展版.xlsx";
const abstractJsonPath = "work/abstracts_crossref_raw.json";
const outputDir = "outputs";
const outputPath = `${outputDir}/乙游_情绪价值_情感消费_数字亲密关系_商学文献矩阵_v4_英文原摘要_中文翻译版.xlsx`;
const accessDate = "2026-07-04";

const zhTranslations = {
  belk_1988_extended_self:
    "我们的所有物既是身份的重要贡献者，也是身份的反映。文章提出多种证据来支持这一简单而有力的命题，并整合相关研究流派以发展“延伸自我”概念及其对消费者行为的启示。由于延伸自我关注的是消费者行为而不仅是购买行为，它比以往关于自我概念与消费者品牌选择关系的表述更为丰富。",
  brakus_2009_brand_experience:
    "文章将品牌体验界定为由品牌设计、身份、包装、传播和环境等品牌相关刺激所唤起的感觉、情感、认知和行为反应。作者区分若干体验维度，并构建包含感官、情感、智识和行为四个维度的品牌体验量表。通过六项研究，文章证明该量表具有可靠性、效度，并区别于其他品牌测量；同时品牌体验会影响消费者满意度和忠诚。",
  park_2010_brand_attachment:
    "既有研究尚未充分验证品牌依恋相对于其他构念，尤其是品牌态度强度的理论和实践价值。作者在概念、测量和管理层面作出贡献：界定品牌依恋，阐明其关键属性，并将其与品牌态度强度区分开来；同时开发并验证一个简洁的品牌依恋测量，并考察其对品牌行为结果的预测价值。",
  batra_2012_brand_love:
    "作者采用扎根理论方法考察品牌爱这一现象的性质和结果。文章认为，品牌爱研究需要建立在消费者实际如何体验这一现象的基础上，因此首先通过两项质性研究识别消费者品牌爱原型的不同元素，随后用结构方程模型分析调查数据，探索这些元素如何作为一阶和高阶结构被建模，并进一步解释品牌爱带来的后果。",
  labrecque_2014_parasocial_brand:
    "随着品牌在社交媒体环境中站稳脚跟，消费者期望不断提高，推动了辅助互动技术的发展。理解品牌如何在互动量快速增长的同时保持社交媒体所提供的一对一特征和亲密关系质量，已经变得十分关键。文章借鉴传播学文献，提出拟社会互动在社交媒体消费者-品牌关系中的作用。",
  hollebeek_2014_cbe:
    "过去三十年中，消费者/品牌关系动态成为重要研究流派。近年来，消费者品牌参与被提出，用以比卷入等传统概念更全面地反映消费者与特定品牌之间的互动关系。尽管相关研究兴趣增长，但消费者品牌参与的概念化和测量仍有不足。文章在社交媒体语境下界定该构念，并开发、验证相关量表。",
  brodie_2011_customer_engagement:
    "在高度动态和互动的商业环境中，顾客参与在共同创造顾客体验和价值中的作用受到实践界和学界关注。尽管如此，关于顾客参与及其与其他关系概念差异的系统研究仍然有限。文章借鉴关系营销和服务主导逻辑等理论，探索顾客参与的概念域、基本命题及其对未来研究的启示。",
  hennig_thurau_2010_new_media:
    "近年来，Facebook、YouTube、Google 和 Twitter 等新媒体渠道兴起，使顾客能够作为市场参与者发挥更主动的作用，并几乎在任何时间、地点触达他人或被他人触达。这些新媒体既威胁既有商业模式和企业战略，也为适应性战略和增长带来机会。文章提出“弹球”框架，解释新媒体如何影响顾客关系。",
  kozinets_2002_netnography:
    "作者发展了“网络民族志”这一在线营销研究技术，用以获取消费者洞察。网络民族志是适用于在线社区研究的民族志方法，比传统民族志更快、更简单、成本更低，也比焦点小组或访谈更自然、非侵入。它能够揭示在线消费者群体的象征、意义和消费模式，并提供适应在线社区独特性的操作指南。",
  defreitas_2024_ai_companions:
    "聊天机器人如今能够在关系领域与消费者进行复杂对话，为广泛存在的社会孤独问题提供潜在应对方案。但行为研究对于这些应用能否缓解孤独仍了解有限。文章聚焦为消费者提供合成互动伙伴的 AI 陪伴应用，通过用户评论和行为研究检验其对孤独感的影响，并讨论 AI 陪伴作为情感支持工具的消费者后果。",
  davenport_2020_ai_marketing:
    "未来，人工智能很可能显著改变营销战略和顾客行为。作者基于既有研究和大量实践互动，提出一个理解 AI 影响的多维框架，涵盖智能水平、任务类型以及 AI 是否嵌入机器人。文章将以往分散讨论的维度整合为统一框架，并讨论 AI 对营销战略、顾客行为、隐私、偏见和伦理等方面的影响。",
  huang_rust_2018_ai_service:
    "人工智能正通过执行多种任务重塑服务，既成为重要创新来源，也威胁人类工作。文章提出 AI 工作替代理论，解释这一双刃剑影响。理论区分服务任务所需的机械、分析、直觉和共情四种智能，并说明企业应如何在人类和机器之间进行任务分配。AI 的发展呈现从较低智能任务向较高智能任务推进的可预测顺序。",
  van_doorn_2017_automated_social_presence:
    "技术正在快速改变服务、顾客前台服务体验以及顾客与服务提供者之间的关系。文章预测到 2025 年，技术如服务型类人机器人将被融入大量服务体验，并强调技术在社会层面吸引顾客的能力是技术嵌入的重要进展。文章提出自动化社会临场感概念，用以解释技术如何在服务前台产生社会性体验。",
  castelo_2019_algorithm_aversion:
    "研究表明，即使算法往往表现更好，消费者仍不愿依赖算法执行通常由人类完成的任务。作者在多个领域考察何时以及为何会出现这种现象，发现对于看起来更主观的任务，消费者更少信任和依赖算法；但任务客观性的感知是可塑的，提高任务的客观性感知能够提升对算法的信任。",
  mouritzen_2024_virtual_influencer_marketing:
    "文章旨在概念化虚拟影响者营销，概述在社交媒体营销传播中使用虚拟影响者的机会和风险。作者借鉴影响者营销以及消费者-技术互动文献，描绘虚拟影响者营销图景，区分虚拟影响者、真人影响者和相关数字角色，提出虚拟影响者的定制化、灵活性、所有权和自动化四个独特元素，并建立分类框架。",
  sorosrungruang_2024_generative_ai_virtual_influencers:
    "各种形式的虚拟影响者正在从真人影响者那里获得越来越多广告预算。粉丝对虚拟影响者的反应在许多方面类似于对真人的反应，其参与率、信任和信息源可信度可与真人影响者相当。然而，仍需要更细致地理解消费者如何与真人影响者以及不断涌现的多种虚拟影响者互动，尤其是生成式 AI 支持的虚拟影响者。",
  packard_berger_2024_consumer_language:
    "过去五十多年中，消费者语言研究快速增长。文章回顾这一领域的兴起与演化，识别关键主题和趋势，并指出未来研究议题。相关研究从宽泛的语言概念逐渐走向具体语言特征，也从单向话语扩展到双向对话。文章讨论自动化文本分析和语音等技术发展如何拓展消费者语言研究。",
  wirtz_stockhomburg_2025_generative_ai_service_robots:
    "文章探讨将生成式人工智能，包括大语言模型、大行为模型和智能体 AI，整合进实体服务机器人后对服务接触的变革性影响。作者指出，生成式 AI 驱动的服务机器人将能自主提供更复杂、定制化和个性化的顾客服务，并通过更强的对话、推理和适应能力改变实体服务体验。",
  hollebeek_2024_ai_technologies_engagement_review:
    "人工智能技术语境下的消费者参与正在受到关注，例如聊天机器人、智能产品、语音助手和自动驾驶汽车，但这一跨学科新兴文献的主题仍不清晰。文章采用 PRISMA 方法系统综述 89 篇研究，综合人工智能技术如何促进消费者参与，并提出概念模型和未来研究方向。",
  barrett_2024_customer_engagement_hedonic_utilitarian:
    "过去十年中，顾客参与已成为服务研究的核心概念。既有研究多聚焦社交媒体平台、品牌社区等享乐型消费语境。作者认为，享乐型和功利型服务存在根本差异，因此既有顾客参与知识不一定适用于功利型语境。文章比较不同服务语境中的顾客参与机制。",
  liu_xu_yu_gong_2025_emotional_engagement_virtual_influencer:
    "文章以中国虚拟偶像洛天依为案例，研究虚拟影响者背书中支撑粉丝参与的情感动态。研究采用现象学方法，通过深度访谈捕捉粉丝的真实情感和感知，并结合在线社区网络民族志分析提供情境洞察，从而解释虚拟影响者背书中的情感参与如何形成。",
  tian_2025_virtual_influencers_interactive_marketing_review:
    "虚拟影响者，即社交媒体中的计算机生成角色，已迅速成为重要的营销人格。然而，既有综述缺少整合框架，也常忽视近期相互矛盾的发现。文章基于可供性实现理论和认知行为理论，对 88 篇同行评审文献进行框架化系统综述，综合研究进展、解决矛盾并提出未来方向。",
  jayasingh_2025_ai_influencers_credibility:
    "在不断演化的影响者营销中，AI 影响者正在产生重要影响并改变社交媒体品牌推广方式。近来许多知名品牌与 AI 影响者合作以触达社交媒体受众。AI 影响者作为提升顾客参与和购买意向的新方法逐渐流行，但相关研究仍不足。文章考察 AI 影响者可信度对消费者参与和购买意向的影响。",
};

function fallbackZh(oldNote) {
  return `【待补原版英文摘要后翻译】本条尚未从 Crossref/DOI 记录获得原版英文摘要；临时中文概括如下：${oldNote || ""}`;
}

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const abstractRecords = JSON.parse(await fs.readFile(abstractJsonPath, "utf8"));
const abstractById = new Map(abstractRecords.map((r) => [String(r.paper_id), r]));

const matrix = workbook.worksheets.getItem("Matrix");
const values = matrix.getUsedRange().values;
const headers = values[0];
const rows = values.slice(1);
const idIndex = headers.indexOf("paper_id");
let abstractIndex = headers.indexOf("摘要/核心内容");
if (abstractIndex < 0) abstractIndex = headers.indexOf("摘要");
if (abstractIndex < 0) {
  throw new Error(`Cannot find abstract column. Headers: ${headers.join(" | ")}`);
}

const newHeaders = [
  ...headers.slice(0, abstractIndex),
  "原版英文摘要",
  "中文摘要",
  "摘要来源状态",
  "旧版摘要/核心内容",
  ...headers.slice(abstractIndex + 1),
];

const newRows = rows.map((r) => {
  const id = String(r[idIndex]);
  const rec = abstractById.get(id);
  const english = rec?.english_abstract || "Original English abstract not available from Crossref/DOI metadata; retrieve from publisher page or PDF.";
  const zh = rec?.english_abstract
    ? (zhTranslations[id] || "【待人工精校】已获取原版英文摘要；中文翻译需进一步补录。")
    : fallbackZh(r[abstractIndex]);
  const sourceStatus = rec?.english_abstract
    ? `original_abstract_from_crossref; ${rec.source_url || ""}; accessed ${accessDate}`
    : `abstract_missing_in_crossref; ${rec?.source_url || ""}; accessed ${accessDate}`;
  return [
    ...r.slice(0, abstractIndex),
    english,
    zh,
    sourceStatus,
    r[abstractIndex],
    ...r.slice(abstractIndex + 1),
  ];
});

const outputValues = [newHeaders, ...newRows];
matrix.getRangeByIndexes(0, 0, outputValues.length, newHeaders.length).values = outputValues;
matrix.getRangeByIndexes(0, 0, 1, newHeaders.length).format = {
  fill: "#1F4E79",
  font: { bold: true, color: "#FFFFFF" },
  wrapText: true,
};
matrix.getRangeByIndexes(0, 0, outputValues.length, newHeaders.length).format = {
  wrapText: true,
  borders: { preset: "inside", style: "thin", color: "#D9E2F3" },
};
matrix.getRangeByIndexes(0, 0, outputValues.length, newHeaders.length).format.autofitColumns();
matrix.getRangeByIndexes(1, abstractIndex, outputValues.length - 1, 2).format.columnWidth = 55;
matrix.getRangeByIndexes(1, abstractIndex + 2, outputValues.length - 1, 2).format.columnWidth = 34;
matrix.freezePanes.freezeRows(1);
matrix.freezePanes.freezeColumns(4);

const readme = workbook.worksheets.getItem("README");
readme.getRange("A5:B13").values = [
  ["主表文献数", newRows.length],
  ["本轮新增", "0；本轮为摘要列结构升级"],
  ["新增列", "原版英文摘要；中文摘要；摘要来源状态；旧版摘要/核心内容"],
  ["摘要获取情况", `${abstractRecords.filter((r) => r.english_abstract).length} 篇从 Crossref/DOI 元数据获得原版英文摘要；其余需从出版商页或PDF补录。`],
  ["新增重点", "把摘要拆为英文原文与中文翻译，保留摘要来源状态，避免把概括误作原版摘要。"],
  ["证据状态说明", "original_abstract_from_crossref=英文原摘要来自 Crossref DOI 元数据；abstract_missing_in_crossref=Crossref无摘要字段，需进一步取全文或出版商页。"],
  ["建议优先补录", "JCR/JM/JMR/JAMS/JSR 等顶刊中缺摘要的条目；尤其是早期经典文献和部分Elsevier/SAGE条目。"],
  ["研究设计建议", "问卷SEM + 实验(AI披露/角色真实感/限时活动) + netnography/访谈 + 游戏评论与社群文本分析"],
  ["下一步", "继续下载PDF后，用PDF摘要替换 abstract_missing_in_crossref 行。"],
];
readme.getRange("A5:A13").format = { fill: "#D9EAF7", font: { bold: true } };
readme.getRange("A1:B13").format = { wrapText: true };

let audit;
try {
  audit = workbook.worksheets.getItem("Abstract Audit");
  const used = audit.getUsedRange();
  if (used) used.clear({ applyTo: "all" });
} catch {
  audit = workbook.worksheets.add("Abstract Audit");
}
const auditRows = [
  ["metric", "value"],
  ["total_rows", newRows.length],
  ["original_abstract_from_crossref", abstractRecords.filter((r) => r.english_abstract).length],
  ["abstract_missing_in_crossref", abstractRecords.filter((r) => !r.english_abstract).length],
  ["access_date", accessDate],
];
audit.getRangeByIndexes(0, 0, auditRows.length, 2).values = auditRows;
audit.getRange("A1:B1").format = { fill: "#1F4E79", font: { bold: true, color: "#FFFFFF" } };
audit.getRangeByIndexes(0, 0, auditRows.length, 2).format.autofitColumns();

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 200 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

const inspect = await workbook.inspect({
  kind: "table",
  sheetId: "Matrix",
  range: "A1:P8",
  include: "values",
  tableMaxRows: 8,
  tableMaxCols: 16,
  maxChars: 5000,
});
console.log(inspect.ndjson);
await fs.writeFile(`${outputPath}.inspect.ndjson`, inspect.ndjson);

const preview = await workbook.render({ sheetName: "README", range: "A1:B13", scale: 2, format: "png" });
await fs.writeFile(`${outputDir}/literature_matrix_v4_readme_preview.png`, new Uint8Array(await preview.arrayBuffer()));

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`SAVED ${outputPath}`);
