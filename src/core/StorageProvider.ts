import { injectable } from "inversify";
import sqlite3 from "sqlite3";
import type { Database } from "sqlite";
import { open } from "sqlite";

@injectable()
export class StorageProvider {
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

    public getDb(): Database<sqlite3.Database, sqlite3.Statement> | null {
        return this.db;
    }
}
