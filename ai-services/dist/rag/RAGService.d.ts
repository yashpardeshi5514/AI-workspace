export interface SearchResult {
    content: string;
    source: string;
    similarity: number;
    metadata: Record<string, any>;
}
export declare class RAGService {
    indexDocument(id: string, content: string, metadata?: Record<string, any>): Promise<void>;
    indexDocuments(documents: Array<{
        id: string;
        content: string;
        metadata?: Record<string, any>;
    }>): Promise<void>;
    search(query: string, limit?: number): Promise<SearchResult[]>;
    searchAndFormat(query: string, limit?: number): Promise<string>;
    clear(): Promise<void>;
}
export declare const ragService: RAGService;
//# sourceMappingURL=RAGService.d.ts.map