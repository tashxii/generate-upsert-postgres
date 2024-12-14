import fs from "fs";
import {
  TableDef,
  ColumnDef,
  SQLRecord,
  SQLRecordItem,
} from "./classes";
import { loadTableDefs, verifyHeaderLines } from "./functions";

function main() {
  if (process.argv.length !== 3) {
    console.log("Usage: npx tsx main.ts <input-tsv-file>");
    process.exit(1);
  }

  const inputFile = process.argv[2];
  console.log("Input File:" + inputFile);
  const contents = fs.readFileSync(inputFile, { encoding: "utf-8" });
  let lines = contents.split("\r\n");
  if (lines.length === 1) lines = contents.split("\n");

  try {
    verifyHeaderLines(lines);
    const tableDefs = loadTableDefs(lines);
    const dataLines = lines.splice(4);
    const sqls = generateSQLs(tableDefs, dataLines);
    const outFile = inputFile + ".sql";
    console.log("Output File: " + outFile);
    fs.writeFileSync(outFile, sqls.join("\n"));
    console.log("Completed.");
  } catch (e) {
    console.error(e);
  }
}

function generateSQLs(tableDefs: TableDef[], dataLines: string[]): string[] {
  const result: string[] = [];
  let lineCount = 4;
  for (let i = 0; i < dataLines.length; i++) {
    lineCount++;
    const line = dataLines[i];
    if (line === "") {
      continue;
    }
    const values = line.split("\t");
    tableDefs.forEach((tableDef) => {
      const columnDefs = tableDef.columnDefs;
      const sqlRecord = new SQLRecord(tableDef.name, tableDef.idColumns);
      columnDefs.forEach((columnDef) => {
        if (columnDef.index >= values.length) {
          throw new Error(
            `${lineCount}行目のレコードが足りません。\n` +
            `  必要数:${columnDef.index + 1}, 実際の数:${values.length}}`
          );
        }
        const value = values[columnDef.index];
        let sqlValue = value;
        const type = columnDef.type.split("=")[0];
        const typeOption = columnDef.type.split("=")[1];
        switch (type) {
          case "string":
            sqlValue = `'${value}'`;
            break;
          case "datetime":
            if (!value) {
              sqlValue = "null";
            } else {
              sqlValue = `'${value}'`;
            }
            break;
          case "serial":
            // 必須とみなす
            break;
          case "double":
            if (!value) {
              sqlValue = "null";
            }
            break;
          case "int":
            if (!value) {
              sqlValue = "null";
            }
            break;
          case "bool":
            sqlValue = value.toUpperCase() === "TRUE" ? "true" : "false";
            break;
          case "refstr":
            sqlValue = `'${values[Number(typeOption) - 1]}'`;
            break;
          case "ref":
            sqlValue = `${values[Number(typeOption) - 1]}`;
            break;
          case "fix":
            sqlValue = `${typeOption}`;
            break;
        }
        sqlRecord.items.push(new SQLRecordItem(columnDef.name, sqlValue));
      });
      result.push(sqlRecord.toSQL());
    });
  }

  return result;
}

main();