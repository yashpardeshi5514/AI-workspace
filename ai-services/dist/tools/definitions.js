export const TOOLS = {
    read_file: {
        name: 'read_file',
        description: 'Read the contents of a file',
        parameters: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'The file path to read',
                },
            },
            required: ['path'],
        },
    },
    write_file: {
        name: 'write_file',
        description: 'Write contents to a file',
        parameters: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'The file path to write to',
                },
                content: {
                    type: 'string',
                    description: 'The content to write',
                },
            },
            required: ['path', 'content'],
        },
    },
    execute_code: {
        name: 'execute_code',
        description: 'Execute JavaScript/Python code',
        parameters: {
            type: 'object',
            properties: {
                language: {
                    type: 'string',
                    enum: ['javascript', 'python'],
                },
                code: {
                    type: 'string',
                    description: 'The code to execute',
                },
            },
            required: ['language', 'code'],
        },
    },
    search_documentation: {
        name: 'search_documentation',
        description: 'Search documentation or knowledge base',
        parameters: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search query',
                },
            },
            required: ['query'],
        },
    },
};
//# sourceMappingURL=definitions.js.map