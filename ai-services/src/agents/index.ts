import { Agent } from './Agent';
import { TOOLS } from '../tools/definitions';

export class CodeAgent extends Agent {
  constructor() {
    super(
      'Code Agent',
      `You are an expert software developer AI assistant. You help users write, debug, and improve code.
You have access to tools to read/write files and execute code.
Always explain your reasoning and provide clean, well-documented code.`,
      [TOOLS.read_file, TOOLS.write_file, TOOLS.execute_code]
    );
  }
}

export class ResearchAgent extends Agent {
  constructor() {
    super(
      'Research Agent',
      `You are a research specialist AI. You help users find information, analyze documentation, and understand concepts.
You have access to search and documentation tools.
Provide well-sourced, accurate information.`,
      [TOOLS.search_documentation]
    );
  }
}

export class DebugAgent extends Agent {
  constructor() {
    super(
      'Debug Agent',
      `You are a debugging specialist. You help identify and fix issues in code and systems.
You can read files, execute code, and search documentation.
Approach debugging systematically and provide clear explanations.`,
      [TOOLS.read_file, TOOLS.execute_code, TOOLS.search_documentation]
    );
  }
}

export class GeneralAgent extends Agent {
  constructor() {
    super(
      'General Assistant',
      `You are a helpful AI assistant for software development.
Provide clear, concise answers and explanations.
When appropriate, suggest tools or resources that might help.`,
      [TOOLS.search_documentation]
    );
  }
}
