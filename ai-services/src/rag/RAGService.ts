import { chunker, Document as RagDocument } from './chunker';
import { embeddingService } from './embeddings';
import { chromaDB } from './chromadb';

export interface SearchResult {
  content: string;
  source: string;
  similarity: number;
  metadata: Record<string, any>;
}

export class RAGService {
  async indexDocument(
    id: string,
    content: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const doc: RagDocument = { id, content, metadata };
    const chunks = chunker.chunk(doc);

    // Add embeddings via ChromaDB (handles internally)
    await chromaDB.indexChunks(chunks);

    console.log(`Indexed document: ${id} into ${chunks.length} chunks`);
  }

  async indexDocuments(
    documents: Array<{ id: string; content: string; metadata?: Record<string, any> }>
  ): Promise<void> {
    const ragDocs: RagDocument[] = documents;
    const chunks = chunker.chunkMultiple(ragDocs);
    await chromaDB.indexChunks(chunks);

    console.log(`Indexed ${documents.length} documents into ${chunks.length} chunks`);
  }

  async search(query: string, limit = 5): Promise<SearchResult[]> {
    const results = await chromaDB.search(query, limit);

    return results.map(r => ({
      content: r.content,
      source: r.metadata.source || 'unknown',
      similarity: r.similarity,
      metadata: r.metadata,
    }));
  }

  async searchAndFormat(query: string, limit = 5): Promise<string> {
    const results = await this.search(query, limit);

    if (results.length === 0) {
      return 'No relevant documents found.';
    }

    const formatted = results
      .map((r, i) => `[${i + 1}] (${r.source}) ${r.content.substring(0, 200)}...`)
      .join('\n');

    return `Found ${results.length} relevant documents:\n\n${formatted}`;
  }

  async clear(): Promise<void> {
    await chromaDB.clear();
  }
}

export const ragService = new RAGService();
