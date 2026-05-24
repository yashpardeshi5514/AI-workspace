interface SearchResult {
    id: string;
    content: string;
    metadata: Record<string, any>;
    score: number;
}
export declare class AdvancedRAGService {
    private embeddings;
    private vectorStore;
    constructor();
    search(query: string, workspaceId: string, limit?: number, filters?: {
        fileType?: string;
        minScore?: number;
        dateRange?: {
            start: Date;
            end: Date;
        };
    }): Promise<SearchResult[]>;
    semanticSearch(query: string, workspaceId: string, options?: {
        limit?: number;
        threshold?: number;
    }): Promise<SearchResult[]>;
    hybridSearch(query: string, workspaceId: string, semanticWeight?: number): Promise<SearchResult[]>;
    rerank(query: string, documents: SearchResult[], topK?: number): Promise<SearchResult[]>;
}
export declare const advancedRAGService: AdvancedRAGService;
export {};
//# sourceMappingURL=AdvancedRAGService.d.ts.map