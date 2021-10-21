import { readFile } from "fs/promises";
import { injectable } from "inversify";
import type { Database } from "sqlite";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

@injectable()
export class PersistenceProvider {
	#db: Database | null;

	constructor() {
		this.#db = null;
	}

	async init(): Promise<void> {
		this.#db = await open({
			filename: "./data/storage.sqlite3",
			driver: sqlite3.Database,
		});
	}

	async executeScript(path: string): Promise<void> {
		const script = await readFile(path, { encoding: "utf-8" });
		await this.#db!.run(script);
	}

	getDb(): Database | null {
		return this.#db;
	}
}
