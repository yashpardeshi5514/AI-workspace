'use client';
import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/hooks/useAuthStore';
export function CreateDialog({ workspaceId, parentPath, type, onSuccess, onClose, }) {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { token } = useAuthStore();
    const handleCreate = async () => {
        if (!name.trim() || !token)
            return;
        setIsLoading(true);
        setError('');
        try {
            if (type === 'folder') {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/files/mkdir?workspaceId=${workspaceId}`, { name: name.trim(), parentPath }, { headers: { Authorization: `Bearer ${token}` } });
            }
            else {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/files/upload?workspaceId=${workspaceId}&path=${parentPath}`, { filename: name.trim(), content: '' }, { headers: { Authorization: `Bearer ${token}` } });
            }
            onSuccess?.();
            onClose?.();
        }
        catch (err) {
            setError(err.response?.data?.error || 'Failed to create');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter')
            handleCreate();
        if (e.key === 'Escape')
            onClose?.();
    };
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 w-96">
        <h3 className="font-semibold mb-3">
          Create {type === 'folder' ? 'Folder' : 'File'}
        </h3>
        <input autoFocus type="text" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown} placeholder={type === 'folder' ? 'Folder name...' : 'File name...'} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded mb-4 outline-none focus:border-blue-500"/>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-2 text-sm rounded hover:bg-zinc-700 transition-colors">
            Cancel
          </button>
          <button onClick={handleCreate} disabled={isLoading || !name.trim()} className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded transition-colors">
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=CreateDialog.js.map