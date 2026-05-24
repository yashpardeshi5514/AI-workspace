'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
    ssr: false,
});
const LANGUAGE_MAP = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    json: 'json',
    md: 'markdown',
    html: 'html',
    css: 'css',
    sql: 'sql',
    sh: 'shell',
    yaml: 'yaml',
    yml: 'yaml',
};
function getLanguage(filename) {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    return LANGUAGE_MAP[ext] || 'plaintext';
}
export function CodeEditor({ filename, content, onChange, readOnly, }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return (<div className="flex items-center justify-center h-full bg-zinc-900">
        <p className="text-zinc-400">Loading editor...</p>
      </div>);
    }
    return (<MonacoEditor height="100%" language={getLanguage(filename)} value={content} onChange={(value) => onChange?.(value || '')} options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: 'Fira Code, monospace',
            theme: 'vs-dark',
            readOnly,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
        }} theme="vs-dark"/>);
}
//# sourceMappingURL=CodeEditor.js.map