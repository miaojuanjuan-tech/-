import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "outputs/乙游_情绪价值_情感消费_数字亲密关系_商学文献矩阵_v3_近两年扩展版.xlsx";
const outPath = "work/abstracts_crossref_raw.json";

function stripJats(value) {
  if (!value) return "";
  return String(value)
    .replace(/<jats:title[^>]*>.*?<\/jats:title>/gis, "")
    .replace(/<\/jats:p>\s*<jats:p[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeDoi(raw) {
  const doi = String(raw || "").trim();
  if (!doi || doi.startsWith("no_doi") || doi.includes("pending") || doi.includes("needs")) return "";
  return doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").trim();
}

async function fetchCrossref(doi) {
  const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
  const res = await fetch(url, { headers: { "User-Agent": "Codex literature matrix mailto:none@example.com" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const json = await res.json();
  const m = json.message || {};
  return {
    doi,
    title: Array.isArray(m.title) ? m.title.join(" ") : "",
    abstract: stripJats(m.abstract || ""),
    venue: Array.isArray(m["container-title"]) ? m["container-title"].join(" | ") : "",
    url: m.URL || `https://doi.org/${doi}`,
    source: "Crossref DOI API",
  };
}

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const matrix = workbook.worksheets.getItem("Matrix").getUsedRange().values;
const headers = matrix[0];
const rows = matrix.slice(1);
const doiIndex = headers.findIndex((h) => String(h).includes("DOI"));
const idIndex = headers.indexOf("paper_id");
const titleIndex = headers.indexOf("题目");
const existingAbstractIndex = headers.indexOf("摘要/核心内容");

const output = [];
for (const r of rows) {
  const doi = normalizeDoi(r[doiIndex]);
  const record = {
    paper_id: r[idIndex],
    title: r[titleIndex],
    doi,
    matrix_abstract_or_note: r[existingAbstractIndex],
    english_abstract: "",
    source_status: "no_doi_or_not_checked",
    source_url: "",
    error: "",
  };
  if (doi) {
    try {
      const fetched = await fetchCrossref(doi);
      record.english_abstract = fetched.abstract;
      record.source_status = fetched.abstract ? "abstract_found_crossref" : "crossref_no_abstract";
      record.source_url = fetched.url;
      record.crossref_title = fetched.title;
      record.crossref_venue = fetched.venue;
    } catch (err) {
      record.source_status = "crossref_fetch_error";
      record.error = String(err.message || err);
    }
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
  output.push(record);
}

await fs.writeFile(outPath, JSON.stringify(output, null, 2), "utf8");
const found = output.filter((x) => x.english_abstract).length;
console.log(JSON.stringify({ total: output.length, found, outPath }, null, 2));
