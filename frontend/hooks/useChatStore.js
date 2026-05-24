import { create } from 'zustand';
export const useChatStore = create((set) => ({
    messages: [],
    isLoading: false,
    addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
    setMessages: (msgs) => set({ messages: msgs }),
    setLoading: (loading) => set({ isLoading: loading }),
    clearMessages: () => set({ messages: [] }),
}));
//# sourceMappingURL=useChatStore.js.map