'use client';
import { Code2 } from 'lucide-react';
import { useState } from 'react';
import { EditorPanel } from './EditorPanel';
const WORKSPACE_ID = 'default-workspace';
export function EditorButton() {
    const [isOpen, setIsOpen] = useState(false);
    return (<>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-zinc-900 transition-colors text-sm text-zinc-300" title="Open code editor">
        <Code2 className="w-4 h-4"/>
        Editor
      </button>
      <EditorPanel workspaceId={WORKSPACE_ID} isOpen={isOpen} onClose={() => setIsOpen(false)}/>
    </>);
}
//# sourceMappingURL=EditorButton.js.map