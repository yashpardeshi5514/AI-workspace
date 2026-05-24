'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '@/hooks/useAuthStore';

interface SearchFilters {
  type: 'all' | 'conversations' | 'messages';
  dateRange?: 'day' | 'week' | 'month' | 'all';
}

interface SearchResult {
  conversations: any[];
  messages: any[];
}

export function AdvancedSearch({ workspaceId }: { workspaceId: string }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({ type: 'all' });
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useAuthStore();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !token) return;

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/search?workspaceId=${workspaceId}&query=${query}&type=${filters.type}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res.data);
      setIsOpen(true);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search conversations and messages..."
          className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded outline-none focus:border-blue-500 transition-colors"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>

      {/* Filters */}
      <div className="mt-3 flex gap-2 flex-wrap">
        {(['all', 'conversations', 'messages'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilters({ ...filters, type })}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              filters.type === type
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Results */}
      {isOpen && results && (
        <div className="absolute top-16 left-0 right-0 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto z-50">
          {results.conversations && results.conversations.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Conversations</h3>
              <div className="space-y-1 mb-4">
                {results.conversations.map(conv => (
                  <div
                    key={conv._id}
                    className="px-2 py-1 bg-zinc-700 rounded text-sm hover:bg-zinc-600 cursor-pointer transition-colors"
                  >
                    {conv.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.messages && results.messages.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Messages</h3>
              <div className="space-y-2">
                {results.messages.map(msg => (
                  <div
                    key={msg._id}
                    className="px-2 py-1 bg-zinc-700 rounded text-sm hover:bg-zinc-600 cursor-pointer transition-colors"
                  >
                    <p className="truncate">{msg.content.slice(0, 100)}</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!results.conversations || results.conversations.length === 0) &&
            (!results.messages || results.messages.length === 0) && (
              <p className="text-zinc-400 text-sm">No results found</p>
            )}
        </div>
      )}
    </div>
  );
}
