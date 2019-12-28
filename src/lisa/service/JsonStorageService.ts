import { Injectable } from "chevronjs";
import { pathExists, readJSON, writeJSON } from "fs-extra";
import { chevron } from "../../chevron";

interface Storage<T = any> {
    [key: string]: T;
}

@Injectable(chevron)
class JsonStorageService {
    private async hasStorage(path: string): Promise<boolean> {
        return pathExists(path);
    }

    public async hasStorageKey(path: string, key: string): Promise<boolean> {
        return (await this.load(path, key)) != null;
    }

    public async load(path: string, key: string): Promise<null | any> {
        if (!(await this.hasStorage(path))) {
            return null;
        }
        const object = await this.loadAll(path);
        if (!(key in object)) {
            return null;
        }
        return object[key];
    }

    public async store(path: string, key: string, data: any): Promise<void> {
        if (!(await this.hasStorage(path))) {
            await this.initStorage(path);
        }

        const object = await this.loadAll(path);
        object[key] = data;
        return await writeJSON(path, object);
    }

    private async loadAll(path: string): Promise<Storage> {
        return await readJSON(path);
    }

    private async initStorage(path: string): Promise<void> {
        return await writeJSON(path, {});
    }
}

export { JsonStorageService };
