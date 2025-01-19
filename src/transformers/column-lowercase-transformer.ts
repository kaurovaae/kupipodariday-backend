export class ColumnLowercaseTransformer {
  to(data: string): string {
    return data.toLowerCase();
  }
  from(data: string): string {
    return data;
  }
}
