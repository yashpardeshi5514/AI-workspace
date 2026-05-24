const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_OVERLAP = 100;
export class DocumentChunker {
    constructor(chunkSize = DEFAULT_CHUNK_SIZE, overlap = DEFAULT_OVERLAP) {
        this.chunkSize = chunkSize;
        this.overlap = overlap;
    }
    chunk(document) {
        const content = document.content;
        const chunks = [];
        let start = 0;
        let chunkIndex = 0;
        while (start < content.length) {
            let end = start + this.chunkSize;
            // Try to break at sentence boundary
            if (end < content.length) {
                const lastPeriod = content.lastIndexOf('.', end);
                if (lastPeriod > start) {
                    end = lastPeriod + 1;
                }
            }
            const chunkText = content.substring(start, end).trim();
            if (chunkText.length > 0) {
                chunks.push({
                    id: `${document.id}-chunk-${chunkIndex}`,
                    content: chunkText,
                    metadata: {
                        ...document.metadata,
                        source: document.id,
                        chunkIndex,
                    },
                    chunkIndex,
                });
                chunkIndex++;
            }
            start = end - this.overlap;
        }
        return chunks;
    }
    chunkMultiple(documents) {
        return documents.flatMap(doc => this.chunk(doc));
    }
}
export const chunker = new DocumentChunker();
//# sourceMappingURL=chunker.js.map