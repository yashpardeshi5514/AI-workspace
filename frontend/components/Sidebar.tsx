'use client';

import { MessageCircle, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useRouter } from 'next/navigation';
import { FileList } from './FileList';

const WORKSPACE_ID = 'default-workspace'; // TODO: Dynamic workspace

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="w-64 h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-500" />
          <span className="font-semibold">Workspace</span>
        </div>
      </div>

      {/* New Chat */}
      <button className="m-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
        + New Chat
      </button>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        <div className="space-y-2 text-sm">
          <div className="px-3 py-2 text-zinc-500">No chats yet</div>
        </div>
      </div>

      {/* Files */}
      <FileList workspaceId={WORKSPACE_ID} />

      {/* Footer */}
      <div className="border-t border-zinc-800 p-4 space-y-2">
        {user && (
          <div className="px-3 py-2 text-sm">
            <p className="text-zinc-300 font-medium truncate">{user.name}</p>
            <p className="text-zinc-500 text-xs truncate">{user.email}</p>
          </div>
        )}
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors text-sm">
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors text-sm text-red-400"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
