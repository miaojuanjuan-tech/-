import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = await FileBlob.load("outputs/乙游_情绪价值_情感消费_数字亲密关系_商学文献矩阵_v3_近两年扩展版.xlsx");
const workbook = await SpreadsheetFile.importXlsx(input);
const values = workbook.worksheets.getItem("Matrix").getRange("A1:AD1").values[0];
console.log(JSON.stringify(values, null, 2));
