'use client';

import { useState, useEffect } from 'react';
import { FileText, Trash2, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '@/hooks/useAuthStore';
import { FileUpload } from './FileUpload';

interface FileItem {
  _id: string;
  filename: string;
  size: number;
  indexed: boolean;
  createdAt: string;
}

interface FileListProps {
  workspaceId: string;
}

export function FileList({ workspaceId }: FileListProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuthStore();

  const fetchFiles = async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files/list?workspaceId=${workspaceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFiles(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load files');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [token, workspaceId]);

  const handleDelete = async (fileId: string) => {
    if (!token) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files/${fileId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFiles(files.filter(f => f._id !== fileId));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  const handleUpload = (newFile: FileItem) => {
    setFiles([newFile, ...files]);
    setError('');
  };

  return (
    <div className="px-2 py-4 border-t border-zinc-800 space-y-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors text-sm font-medium"
      >
        <span>Files</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="space-y-2">
          <FileUpload
            workspaceId={workspaceId}
            onUpload={handleUpload}
            onError={setError}
          />

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="space-y-1 max-h-40 overflow-y-auto">
            {files.length === 0 ? (
              <p className="text-xs text-zinc-500 px-3 py-2">No files</p>
            ) : (
              files.map(file => (
                <div
                  key={file._id}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                    <span className="text-xs truncate text-zinc-300">
                      {file.filename}
                    </span>
                    {file.indexed && (
                      <span className="text-xs px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded flex-shrink-0">
                        indexed
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3 text-red-400 hover:text-red-300" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
