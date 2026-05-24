'use client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { MessageList } from '@/components/MessageList';
import { MessageInput } from '@/components/MessageInput';
import { EditorButton } from '@/components/EditorButton';
import { useChatStore } from '@/hooks/useChatStore';
import { useSocket } from '@/hooks/useSocket';
function ChatContent() {
    const { messages, isLoading } = useChatStore();
    const { sendMessage } = useSocket();
    return (<div className="flex h-screen bg-zinc-950 text-zinc-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-zinc-800 px-6 py-3 flex items-center justify-end gap-4">
          <EditorButton />
        </div>

        {/* Chat Area */}
        <MessageList messages={messages} isLoading={isLoading}/>
        <MessageInput onSend={sendMessage} isLoading={isLoading}/>
      </div>
    </div>);
}
export default function ChatPage() {
    return (<ProtectedRoute>
      <ChatContent />
    </ProtectedRoute>);
}
//# sourceMappingURL=page.js.map