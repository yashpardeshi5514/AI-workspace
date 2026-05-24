import { Agent } from './Agent';
export class CodeAgent extends Agent {
    async run(messages) {
        // TODO: Implement OpenAI call for Code Agent
        return "I am the Code Agent.";
    }
}
export class ResearchAgent extends Agent {
    async run(messages) {
        return "I am the Research Agent.";
    }
}
export class DebugAgent extends Agent {
    async run(messages) {
        return "I am the Debug Agent.";
    }
}
export class GeneralAgent extends Agent {
    async run(messages) {
        return "I am the General Agent.";
    }
}
//# sourceMappingURL=index.js.map