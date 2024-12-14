export class TableDef {
  name: string = "";
  idColumns: string = "";
  columnDefs: ColumnDef[] = [];
}

export class ColumnDef {
  name: string = "";
  type: string = "";
  index: number = 0;
}

export class SQLRecord {
  tableName: string;
  idColumns: string;
  items: SQLRecordItem[] = [];
  constructor(tableName: string, idColumns: string) {
    this.tableName = tableName;
    this.idColumns = idColumns;
  }
  toSQL(): string {
    const columns: string[] = [];
    const values: string[] = [];
    const sets: string[] = [];

    this.items.forEach((item) => {
      columns.push(`"${item.columnName}"`);
      values.push(item.sqlValue);
      sets.push(`"${item.columnName}" = ${item.sqlValue}`);
    });

    return (
      `INSERT INTO "${this.tableName}" (${columns.join(", ")}) \n` +
      `  VALUES (${values.join(", ")})\n` +
      `  ON CONFLICT (${this.idColumns
        .split(",")
        .map((id) => `"${id.trim()}"`)
        .join(",")})\n` +
      `  DO UPDATE SET ${sets.join(", ")};`
    );
  }
}

export class SQLRecordItem {
  columnName: string;
  sqlValue: string; //引用符で括ったり、nullにしたりする
  constructor(columnName: string, sqlValue: string) {
    this.columnName = columnName;
    this.sqlValue = sqlValue;
  }
}