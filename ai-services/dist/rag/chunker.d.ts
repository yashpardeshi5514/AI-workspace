export interface Document {
    id: string;
    content: string;
    metadata?: Record<string, any>;
}
export interface Chunk {
    id: string;
    content: string;
    metadata: Record<string, any>;
    chunkIndex: number;
}
export declare class DocumentChunker {
    private chunkSize;
    private overlap;
    constructor(chunkSize?: number, overlap?: number);
    chunk(document: Document): Chunk[];
    chunkMultiple(documents: Document[]): Chunk[];
}
export declare const chunker: DocumentChunker;
//# sourceMappingURL=chunker.d.ts.map