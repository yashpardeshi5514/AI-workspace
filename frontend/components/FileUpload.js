'use client';
import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '@/hooks/useAuthStore';
export function FileUpload({ workspaceId, onUpload, onError }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const { token } = useAuthStore();
    const handleUpload = async (file) => {
        if (!token) {
            onError?.('Not authenticated');
            return;
        }
        setIsLoading(true);
        try {
            const content = await file.text();
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/files/upload?workspaceId=${workspaceId}`, {
                filename: file.name,
                content,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            onUpload?.(response.data);
        }
        catch (err) {
            onError?.(err.response?.data?.error || 'Upload failed');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleUpload(files[0]);
        }
    };
    return (<div onDragOver={() => setIsDragging(true)} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} className={`p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-zinc-700 hover:border-zinc-600'}`}>
      <input ref={fileInputRef} type="file" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} className="hidden"/>
      <button onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="w-full flex items-center justify-center gap-2 text-sm text-zinc-300 hover:text-zinc-200 disabled:opacity-50">
        <Upload className="w-4 h-4"/>
        {isLoading ? 'Uploading...' : 'Drop files or click to upload'}
      </button>
    </div>);
}
//# sourceMappingURL=FileUpload.js.map