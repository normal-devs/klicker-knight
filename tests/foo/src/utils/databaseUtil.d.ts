export declare const defaultFilePath = "saves/data.json";
export declare type LoadResult = {
    data: unknown;
    error: null;
} | {
    data: null;
    error: unknown;
};
export declare type SaveResult = {
    isSaved: true;
    error: null;
} | {
    isSaved: false;
    error: unknown;
};
export declare type DeleteResult = {
    isFileOnDisk: false;
    error: null;
} | {
    isFileOnDisk: boolean;
    error: unknown;
};
export declare const databaseUtil: {
    delete(): DeleteResult;
    hasGameFile(): boolean;
    load(): LoadResult;
    save(data: unknown): SaveResult;
};
