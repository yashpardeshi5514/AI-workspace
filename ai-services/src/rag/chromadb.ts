import { ChromaClient } from 'chromadb';
import { Chunk } from './chunker';

interface SearchResult {
  id: string;
  content: string;
  similarity: number;
  metadata: Record<string, any>;
}

export class ChromaDBClient {
  private client: ChromaClient;
  private collectionName: string;

  constructor(host = 'localhost', port = 8000, collectionName = 'workspace') {
    this.client = new ChromaClient({
      path: `http://${host}:${port}`,
    });
    this.collectionName = collectionName;
  }

  async indexChunks(chunks: Chunk[]): Promise<void> {
    const collection = await this.client.getOrCreateCollection({
      name: this.collectionName,
      embeddingFunction: undefined as any
    });

    for (const chunk of chunks) {
      await collection.add({
        ids: [chunk.id],
        documents: [chunk.content],
        metadatas: [chunk.metadata],
      });
    }
  }

  async search(query: string, limit = 5): Promise<SearchResult[]> {
    const collection = await this.client.getCollection({
      name: this.collectionName,
      embeddingFunction: undefined as any
    });

    const results = await collection.query({
      queryTexts: [query],
      nResults: limit,
    } as any);

    if (!results.ids[0]) {
      return [];
    }

    return results.ids[0].map((id: string, index: number) => ({
      id,
      content: (results.documents as any)[0][index] || '',
      similarity: (results.distances as any)?.[0]?.[index] || 0,
      metadata: (results.metadatas as any)?.[0]?.[index] || {},
    }));
  }

  async clear(): Promise<void> {
    await this.client.deleteCollection({
      name: this.collectionName,
    });
  }
}

export const chromaDB = new ChromaDBClient();
