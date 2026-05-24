'use client';

import { useState } from 'react';
import { Play, Loader, Copy, Check } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '@/hooks/useAuthStore';

interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  duration: number;
  language: string;
}

interface CodeRunnerProps {
  code: string;
  language?: string;
}

export function CodeRunner({ code, language = 'javascript' }: CodeRunnerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const { token } = useAuthStore();

  const handleRun = async () => {
    if (!token) return;

    setIsRunning(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/execute/execute`,
        { code, language },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err: any) {
      setResult({
        success: false,
        output: '',
        error: err.response?.data?.error || 'Execution failed',
        duration: 0,
        language,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    const text = result?.output || result?.error || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-400">
            {language.toUpperCase()}
          </span>
          <span className="text-xs text-zinc-500">• ~5s timeout</span>
        </div>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded text-sm transition-colors"
        >
          {isRunning ? (
            <>
              <Loader className="w-3 h-3 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-3 h-3" />
              Run
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-2 bg-zinc-800/50 border-b border-zinc-800">
            <span className="text-xs font-medium">
              {result.success ? '✓ Success' : '✗ Error'} ({result.duration}ms)
            </span>
            <button
              onClick={handleCopy}
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
          </div>

          <pre className="p-3 text-xs text-zinc-300 overflow-x-auto max-h-48">
            <code>
              {result.output || result.error || '(no output)'}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}
