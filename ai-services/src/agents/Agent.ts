import OpenAI from 'openai';
import { TOOLS, Tool, AgentMessage } from '../tools/definitions';
import { toolExecutor } from '../tools/executor';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export abstract class Agent {
  name: string;
  systemPrompt: string;
  tools: Tool[];

  constructor(name: string, systemPrompt: string, tools: Tool[] = []) {
    this.name = name;
    this.systemPrompt = systemPrompt;
    this.tools = tools;
  }

  async run(messages: AgentMessage[]): Promise<string> {
    const conversationHistory = [
      { role: 'system' as const, content: this.systemPrompt },
      ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ];

    let response = await client.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: conversationHistory,
      tools: this.tools.length > 0 ? this.tools.map(t => ({
        type: 'function' as const,
        function: {
          name: t.name,
          description: t.description,
          parameters: t.parameters,
        },
      })) : undefined,
      temperature: 0.7,
    });

    // Agentic loop: keep executing tools until we get a final response
    while (response.choices[0]?.message?.tool_calls) {
      const toolCalls = response.choices[0].message.tool_calls;

      conversationHistory.push({
        role: 'assistant',
        content: response.choices[0].message.content || '',
      });

      const toolResults = [];
      for (const toolCall of toolCalls) {
        const result = await toolExecutor.execute({
          name: toolCall.function.name,
          args: JSON.parse(toolCall.function.arguments),
        });
        toolResults.push({
          tool_call_id: toolCall.id,
          result,
        });
      }

      conversationHistory.push({
        role: 'user',
        content: JSON.stringify(toolResults),
      });

      response = await client.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: conversationHistory,
        tools: this.tools.length > 0 ? this.tools.map(t => ({
          type: 'function' as const,
          function: {
            name: t.name,
            description: t.description,
            parameters: t.parameters,
          },
        })) : undefined,
        temperature: 0.7,
      });
    }

    return response.choices[0]?.message?.content || 'No response';
  }
}
