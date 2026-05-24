import { ChromaClient } from 'chromadb';
export class ChromaDBClient {
    constructor(host = 'localhost', port = 8000, collectionName = 'workspace') {
        this.client = new ChromaClient({
            path: `http://${host}:${port}`,
        });
        this.collectionName = collectionName;
    }
    async indexChunks(chunks) {
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
    async search(query, limit = 5) {
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
    async clear() {
        await this.client.delete_collection({
            name: this.collectionName,
        });
    }
}
export const chromaDB = new ChromaDBClient();
//# sourceMappingURL=chromadb.js.map