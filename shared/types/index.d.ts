export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
}
export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}
export interface Workspace {
    id: string;
    name: string;
    ownerId: string;
    createdAt: Date;
}
//# sourceMappingURL=index.d.ts.map