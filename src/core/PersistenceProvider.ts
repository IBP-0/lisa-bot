import { injectable } from "inversify";
import sqlite3 from "sqlite3";
import type { Database } from "sqlite";
import { open } from "sqlite";
import { readFile } from "fs/promises";

@injectable()
export class PersistenceProvider {
    private db: Database<sqlite3.Database, sqlite3.Statement> | null;

    constructor() {
        this.db = null;
    }

    public async init(): Promise<void> {
        this.db = await open({
            filename: "./data/storage.sqlite3",
            driver: sqlite3.Database,
        });
    }

    public async executeScript(path: string): Promise<void> {
        const script = await readFile(path, { encoding: "utf-8" });
        await this.db!.run(script);
    }

    public getDb(): Database<sqlite3.Database, sqlite3.Statement> | null {
        return this.db;
    }
}
