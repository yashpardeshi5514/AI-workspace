import { Chunk } from './chunker';
interface SearchResult {
    id: string;
    content: string;
    similarity: number;
    metadata: Record<string, any>;
}
export declare class ChromaDBClient {
    private client;
    private collectionName;
    constructor(host?: string, port?: number, collectionName?: string);
    indexChunks(chunks: Chunk[]): Promise<void>;
    search(query: string, limit?: number): Promise<SearchResult[]>;
    clear(): Promise<void>;
}
export declare const chromaDB: ChromaDBClient;
export {};
//# sourceMappingURL=chromadb.d.ts.map