'use client';
import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';
export function FileTree({ items, onSelect, onContextMenu, selectedId, }) {
    const [expanded, setExpanded] = useState(new Set(['/']));
    const toggleExpand = (id) => {
        const newExpanded = new Set(expanded);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        }
        else {
            newExpanded.add(id);
        }
        setExpanded(newExpanded);
    };
    const renderItem = (item, level = 0) => (<div key={item._id}>
      <div onClick={() => {
            if (item.isDirectory) {
                toggleExpand(item._id);
            }
            else {
                onSelect(item);
            }
        }} onContextMenu={(e) => {
            e.preventDefault();
            onContextMenu?.(item, e);
        }} className={`flex items-center gap-1 px-2 py-1 text-sm cursor-pointer rounded transition-colors ${selectedId === item._id
            ? 'bg-blue-600 text-white'
            : 'hover:bg-zinc-800 text-zinc-300'}`} style={{ paddingLeft: `${level * 12 + 8}px` }}>
        {item.isDirectory ? (<>
            {expanded.has(item._id) ? (<ChevronDown className="w-3 h-3 flex-shrink-0"/>) : (<ChevronRight className="w-3 h-3 flex-shrink-0"/>)}
            {expanded.has(item._id) ? (<FolderOpen className="w-3 h-3 flex-shrink-0 text-blue-400"/>) : (<Folder className="w-3 h-3 flex-shrink-0 text-yellow-400"/>)}
          </>) : (<>
            <div className="w-3"/>
            <File className="w-3 h-3 flex-shrink-0 text-zinc-400"/>
          </>)}
        <span className="truncate">{item.filename}</span>
      </div>

      {item.isDirectory && expanded.has(item._id) && item.children && (<div>
          {item.children.map(child => renderItem(child, level + 1))}
        </div>)}
    </div>);
    return (<div className="space-y-1 p-2">
      {items.length === 0 ? (<p className="text-xs text-zinc-500 px-2 py-4">Empty workspace</p>) : (items.map(item => renderItem(item)))}
    </div>);
}
//# sourceMappingURL=FileTree.js.map