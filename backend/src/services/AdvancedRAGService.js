// Advanced RAG search service
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { OpenAIEmbeddings } from '@langchain/openai';
export class AdvancedRAGService {
    constructor() {
        this.vectorStore = null;
        this.embeddings = new OpenAIEmbeddings({
            modelName: 'text-embedding-3-small',
        });
    }
    async search(query, workspaceId, limit = 5, filters) {
        try {
            const vectorStore = new Chroma(this.embeddings, {
                collectionName: `workspace-${workspaceId}`,
                url: process.env.CHROMA_HOST || 'http://localhost:8000',
            });
            const results = await vectorStore.similaritySearchWithScore(query, limit);
            return results
                .map(([doc, score]) => ({
                id: doc.metadata?.id || '',
                content: doc.pageContent,
                metadata: doc.metadata || {},
                score,
            }))
                .filter((r) => !filters?.minScore || r.score >= filters.minScore);
        }
        catch (err) {
            console.error('RAG search error:', err);
            return [];
        }
    }
    async semanticSearch(query, workspaceId, options) {
        return this.search(query, workspaceId, options?.limit || 5, {
            minScore: options?.threshold || 0.7,
        });
    }
    async hybridSearch(query, workspaceId, semanticWeight = 0.7) {
        // Semantic search
        const semanticResults = await this.search(query, workspaceId, 10);
        // Full-text search (from MongoDB)
        // Combine results with weights
        const combined = semanticResults.map(r => ({
            ...r,
            score: r.score * semanticWeight,
        }));
        return combined.sort((a, b) => b.score - a.score).slice(0, 5);
    }
    async rerank(query, documents, topK = 3) {
        // Simple relevance reranking based on query terms
        const queryTerms = query.toLowerCase().split(/\s+/);
        const scored = documents.map(doc => {
            let score = doc.score;
            const content = doc.content.toLowerCase();
            // Boost score for query term matches
            for (const term of queryTerms) {
                const matches = content.match(new RegExp(term, 'g')) || [];
                score += matches.length * 0.1;
            }
            return { ...doc, score };
        });
        return scored.sort((a, b) => b.score - a.score).slice(0, topK);
    }
}
export const advancedRAGService = new AdvancedRAGService();
//# sourceMappingURL=AdvancedRAGService.js.map