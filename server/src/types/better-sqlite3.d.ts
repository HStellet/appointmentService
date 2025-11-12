declare module "better-sqlite3" {
  // Minimal, pragmatic typings to support the project's usage of .prepare<TArgs, TRow>()
  export class Statement<TArgs extends any[] = any[], TRow = any> {
    all(): TRow[];
    get(...args: TArgs): TRow | undefined;
    run(...args: TArgs): { lastInsertRowid?: number } | any;
  }

  export default class Database {
    constructor(path?: string, options?: any);
    prepare<TArgs extends any[] = any[], TRow = any>(sql: string): Statement<TArgs, TRow>;
    pragma(name: string, value?: any): any;
    exec(sql: string): void;
  }
}
