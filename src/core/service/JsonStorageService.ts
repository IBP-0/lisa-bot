import { pathExists, readJSON, writeJSON } from "fs-extra";
import { injectable } from "inversify";

@injectable()
class JsonStorageService {
    public async hasStorageKey(path: string, key: string): Promise<boolean> {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        return (await this.load(path, key)) != null;
    }

    public async load(path: string, key: string): Promise<null | unknown> {
        if (!(await this.hasStorage(path))) {
            return null;
        }
        const object = await this.loadAll(path);
        if (!(key in object)) {
            return null;
        }
        return object[key];
    }

    public async store(
        path: string,
        key: string,
        data: Record<string, unknown>
    ): Promise<void> {
        if (!(await this.hasStorage(path))) {
            await this.initStorage(path);
        }

        const object = await this.loadAll(path);
        object[key] = data;
        return await writeJSON(path, object);
    }

    private async hasStorage(path: string): Promise<boolean> {
        return pathExists(path);
    }

    private async loadAll(path: string): Promise<Record<string, unknown>> {
        return (await readJSON(path)) as Record<string, unknown>;
    }

    private async initStorage(path: string): Promise<void> {
        return await writeJSON(path, {});
    }
}

export { JsonStorageService };
