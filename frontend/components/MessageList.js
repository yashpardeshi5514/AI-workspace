'use client';
import { useEffect, useRef } from 'react';
export function MessageList({ messages, isLoading }) {
    const containerRef = useRef(null);
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);
    return (<div ref={containerRef} className="flex-1 overflow-y-auto space-y-4 p-6 scroll-smooth">
      {messages.length === 0 ? (<div className="h-full flex items-center justify-center text-center">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-200 mb-2">
              Start a conversation
            </h2>
            <p className="text-zinc-500">
              Ask me anything to get started
            </p>
          </div>
        </div>) : (messages.map((msg) => (<div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md px-4 py-3 rounded-lg ${msg.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-100'}`}>
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {msg.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>)))}

      {isLoading && (<div className="flex justify-start">
          <div className="bg-zinc-800 px-4 py-3 rounded-lg">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"/>
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}/>
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}/>
            </div>
          </div>
        </div>)}
    </div>);
}
//# sourceMappingURL=MessageList.js.map