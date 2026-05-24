'use client';

import { useState, useRef, useEffect } from 'react';
import { Trash2, Copy, Edit2, FolderPlus } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onRename?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onCreateFolder?: () => void;
  isDirectory?: boolean;
}

export function ContextMenu({
  x,
  y,
  onRename,
  onDelete,
  onDuplicate,
  onCreateFolder,
  isDirectory,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = () => {
      menuRef.current = null;
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div
      ref={menuRef}
      className="fixed bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg py-1 z-50"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      {onRename && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRename();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-700 transition-colors text-zinc-200"
        >
          <Edit2 className="w-3 h-3" />
          Rename
        </button>
      )}

      {isDirectory && onCreateFolder && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCreateFolder();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-700 transition-colors text-zinc-200"
        >
          <FolderPlus className="w-3 h-3" />
          New Folder
        </button>
      )}

      {onDuplicate && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-700 transition-colors text-zinc-200"
        >
          <Copy className="w-3 h-3" />
          Duplicate
        </button>
      )}

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-900/20 transition-colors text-red-400"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      )}
    </div>
  );
}
