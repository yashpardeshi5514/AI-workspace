export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}
export interface ChatStore {
    messages: Message[];
    isLoading: boolean;
    addMessage: (msg: Message) => void;
    setMessages: (msgs: Message[]) => void;
    setLoading: (loading: boolean) => void;
    clearMessages: () => void;
}
export declare const useChatStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ChatStore>>;
//# sourceMappingURL=useChatStore.d.ts.map