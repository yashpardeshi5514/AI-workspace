import { chunker } from './chunker';
import { chromaDB } from './chromadb';
export class RAGService {
    async indexDocument(id, content, metadata) {
        const doc = { id, content, metadata };
        const chunks = chunker.chunk(doc);
        // Add embeddings via ChromaDB (handles internally)
        await chromaDB.indexChunks(chunks);
        console.log(`Indexed document: ${id} into ${chunks.length} chunks`);
    }
    async indexDocuments(documents) {
        const ragDocs = documents;
        const chunks = chunker.chunkMultiple(ragDocs);
        await chromaDB.indexChunks(chunks);
        console.log(`Indexed ${documents.length} documents into ${chunks.length} chunks`);
    }
    async search(query, limit = 5) {
        const results = await chromaDB.search(query, limit);
        return results.map(r => ({
            content: r.content,
            source: r.metadata.source || 'unknown',
            similarity: r.similarity,
            metadata: r.metadata,
        }));
    }
    async searchAndFormat(query, limit = 5) {
        const results = await this.search(query, limit);
        if (results.length === 0) {
            return 'No relevant documents found.';
        }
        const formatted = results
            .map((r, i) => `[${i + 1}] (${r.source}) ${r.content.substring(0, 200)}...`)
            .join('\n');
        return `Found ${results.length} relevant documents:\n\n${formatted}`;
    }
    async clear() {
        await chromaDB.clear();
    }
}
export const ragService = new RAGService();
//# sourceMappingURL=RAGService.js.map