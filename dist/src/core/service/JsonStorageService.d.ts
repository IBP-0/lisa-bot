declare class JsonStorageService {
    hasStorageKey(path: string, key: string): Promise<boolean>;
    load(path: string, key: string): Promise<null | unknown>;
    store(path: string, key: string, data: Record<string, unknown>): Promise<void>;
    private hasStorage;
    private loadAll;
    private initStorage;
}
export { JsonStorageService };
