import OpenAI from 'openai';
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
export class EmbeddingService {
    async embed(text) {
        const response = await client.embeddings.create({
            model: 'text-embedding-3-small',
            input: text,
        });
        return response.data[0].embedding;
    }
    async embedMultiple(texts) {
        const response = await client.embeddings.create({
            model: 'text-embedding-3-small',
            input: texts,
        });
        return response.data.map(d => d.embedding);
    }
}
export const embeddingService = new EmbeddingService();
//# sourceMappingURL=embeddings.js.map