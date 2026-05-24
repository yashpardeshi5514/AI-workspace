interface ConversationListProps {
    workspaceId: string;
    selectedId?: string;
    onSelect: (id: string) => void;
    onNew: () => void;
}
export declare function ConversationList({ workspaceId, selectedId, onSelect, onNew, }: ConversationListProps): import("react").JSX.Element;
interface StreamingChatProps {
    workspaceId: string;
    conversationId: string;
}
export declare function StreamingChat({ workspaceId, conversationId, }: StreamingChatProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=AdvancedChat.d.ts.map