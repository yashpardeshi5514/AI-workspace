import { Chroma } from 'chromadb';
import { Chunk } from './chunker';

interface SearchResult {
  id: string;
  content: string;
  similarity: number;
  metadata: Record<string, any>;
}

export class ChromaDBClient {
  private client: Chroma;
  private collectionName: string;

  constructor(host = 'localhost', port = 8000, collectionName = 'workspace') {
    this.client = new Chroma({
      path: `http://${host}:${port}`,
    });
    this.collectionName = collectionName;
  }

  async indexChunks(chunks: Chunk[]): Promise<void> {
    const collection = await this.client.get_or_create_collection({
      name: this.collectionName,
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
    const collection = await this.client.get_collection({
      name: this.collectionName,
    });

    const results = await collection.query({
      query_texts: [query],
      n_results: limit,
    });

    if (!results.ids[0]) {
      return [];
    }

    return results.ids[0].map((id, index) => ({
      id,
      content: results.documents[0][index] || '',
      similarity: results.distances?.[0]?.[index] || 0,
      metadata: results.metadatas?.[0]?.[index] || {},
    }));
  }

  async clear(): Promise<void> {
    await this.client.delete_collection({
      name: this.collectionName,
    });
  }
}

export const chromaDB = new ChromaDBClient();
