'use client';

import { useState, useEffect } from 'react';
import { FileText, X } from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { FileTree, FileTreeItem } from './FileTree';
import { ContextMenu } from './ContextMenu';
import { CreateDialog } from './CreateDialog';
import axios from 'axios';
import { useAuthStore } from '@/hooks/useAuthStore';

interface EditorPanelProps {
  workspaceId: string;
  isOpen: boolean;
  onClose?: () => void;
}

interface FileData {
  _id: string;
  filename: string;
  path: string;
  content?: string;
  isDirectory: boolean;
}

export function EditorPanel({ workspaceId, isOpen, onClose }: EditorPanelProps) {
  const [files, setFiles] = useState<FileData[]>([]);
  const [tree, setTree] = useState<FileTreeItem[]>([]);
  const [activeFile, setActiveFile] = useState<FileData | null>(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: FileTreeItem;
  } | null>(null);
  const [createDialog, setCreateDialog] = useState<{
    type: 'file' | 'folder';
    parentPath: string;
  } | null>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      fetchTree();
    }
  }, [isOpen, token, workspaceId]);

  const fetchTree = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files/tree?workspaceId=${workspaceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const fileList: FileData[] = res.data;
      setFiles(fileList);

      // Build tree structure
      const treeMap = new Map<string, FileTreeItem>();
      const roots: FileTreeItem[] = [];

      for (const file of fileList.sort((a, b) => a.path.localeCompare(b.path))) {
        const item: FileTreeItem = {
          _id: file._id,
          filename: file.filename,
          path: file.path,
          isDirectory: file.isDirectory,
          children: [],
        };

        treeMap.set(file.path, item);

        if (file.path === '/' || !file.path.includes('/')) {
          roots.push(item);
        } else {
          const parentPath = file.path.substring(0, file.path.lastIndexOf('/')) || '/';
          const parent = treeMap.get(parentPath);
          if (parent) {
            parent.children?.push(item);
          }
        }
      }

      setTree(roots);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load files');
    } finally {
      setIsLoading(false);
    }
  };

  const selectFile = (item: FileTreeItem) => {
    const file = files.find(f => f._id === item._id);
    if (file && !file.isDirectory) {
      setActiveFile(file);
      setContent(file.content || '');
    }
  };

  const handleSave = async () => {
    if (!activeFile || !token) return;

    setIsSaving(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files/${activeFile._id}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActiveFile(res.data);
      setFiles(files.map(f => (f._id === activeFile._id ? res.data : f)));
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: FileTreeItem) => {
    if (!token || !window.confirm(`Delete "${item.filename}"?`)) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files/${item._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (activeFile?._id === item._id) {
        setActiveFile(null);
      }
      setError('');
      fetchTree();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-1/2 bg-zinc-900 border-l border-zinc-800 flex flex-col z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h2 className="font-semibold">Code Editor</h2>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-300">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* File Tree */}
        <div className="w-48 border-r border-zinc-800 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-sm text-zinc-500">Loading...</div>
          ) : (
            <FileTree
              items={tree}
              onSelect={selectFile}
              onContextMenu={(item, e) =>
                setContextMenu({ x: e.clientX, y: e.clientY, item })
              }
              selectedId={activeFile?._id}
            />
          )}
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          {activeFile ? (
            <>
              <div className="flex items-center justify-between p-3 border-b border-zinc-800 bg-zinc-800/50">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {activeFile.filename}
                  </span>
                </div>
                <button
                  onClick={handleSave}
                  disabled={isSaving || content === activeFile.content}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded text-sm transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                <CodeEditor
                  filename={activeFile.filename}
                  content={content}
                  onChange={setContent}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-900/20 border-t border-red-900 text-sm text-red-400">
                  {error}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-400">
              Select a file to edit
            </div>
          )}
        </div>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onDelete={() => {
            handleDelete(contextMenu.item);
            setContextMenu(null);
          }}
          onRename={() => {
            // TODO: Rename implementation
            setContextMenu(null);
          }}
          onCreateFolder={() => {
            setCreateDialog({
              type: 'folder',
              parentPath: contextMenu.item.path,
            });
            setContextMenu(null);
          }}
          isDirectory={contextMenu.item.isDirectory}
        />
      )}

      {createDialog && (
        <CreateDialog
          workspaceId={workspaceId}
          parentPath={createDialog.parentPath}
          type={createDialog.type}
          onSuccess={fetchTree}
          onClose={() => setCreateDialog(null)}
        />
      )}
    </div>
  );
}
