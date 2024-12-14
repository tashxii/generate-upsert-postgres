import { ColumnDef, TableDef } from "./classes";

export function verifyHeaderLines(lines: string[]) {
  if (lines.length < 4) {
    throw new Error(
      "ヘッダー部が少なすぎます。4行以上必要です。 " + lines.length
    );
  }
  const tableNames = lines[0].split("\t");
  const columnNames = lines[2].split("\t");
  const columnTypes = lines[3].split("\t");
  if (
    tableNames.length > columnNames.length ||
    tableNames.length > columnTypes.length ||
    columnNames.length !== columnTypes.length
  ) {
    const message =
      "ヘッダー部のカラムの長さが一致しません。\n" +
      `  テーブル行:${tableNames.length}\n` +
      `  カラム名行:${columnNames.length}\n` +
      `  カラムタイプ行:${columnTypes.length}\n`;
    throw new Error(message);
  }
}

export function loadTableDefs(lines: string[]) {
  const tableNames = lines[0].split("\t");
  const columnNames = lines[2].split("\t");
  const columnTypes = lines[3].split("\t");
  const tableDefs: TableDef[] = [];
  let currentTableDef: TableDef | undefined = undefined;
  for (let i = 0; i < columnNames.length; i++) {
    let tableValue: string = "";
    if (i <= tableNames.length) {
      tableValue = tableNames[i];
    }
    if (tableValue) {
      currentTableDef = new TableDef();
      currentTableDef.name = tableValue.split("=")[0];
      currentTableDef.idColumns = tableValue.split("=")[1];
      tableDefs.push(currentTableDef);
    }
    if (currentTableDef) {
      const columnDef = new ColumnDef();
      columnDef.name = columnNames[i];
      columnDef.type = columnTypes[i];
      if (!columnDef.name) {
        throw new Error(`${i + 1}列目のカラム名が未設定です`);
      }
      if (!columnDef.type) {
        throw new Error(`${i + 1}列目のタイプが未設定です`);
      }
      columnDef.index = i;
      currentTableDef.columnDefs.push(columnDef);
    }
  }
  return tableDefs;
}
