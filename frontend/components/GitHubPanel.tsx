'use client';

import { useState } from 'react';
import { Github, GitBranch, GitCommit, Plus } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '@/hooks/useAuthStore';

interface GitHubPanelProps {
  workspaceId: string;
  isOpen: boolean;
  onClose?: () => void;
}

export function GitHubPanel({ workspaceId, isOpen, onClose }: GitHubPanelProps) {
  const [repos, setRepos] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const { token } = useAuthStore();

  const handleConnect = async () => {
    if (!githubToken || !token) return;

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/github/user`,
        { githubToken },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Fetch user repos
      const reposRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/github/repos/${res.data.login}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { githubToken },
        }
      );

      setRepos(reposRes.data);
      setShowTokenInput(false);
    } catch (err) {
      console.error('GitHub connection failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClone = async (repo: any) => {
    if (!token) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/github/clone`,
        {
          owner: repo.owner.login,
          repo: repo.name,
          workspaceId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedRepo(repo);
    } catch (err) {
      console.error('Clone failed:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h2 className="font-semibold flex items-center gap-2">
          <Github className="w-4 h-4" />
          GitHub
        </h2>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-300 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!repos.length ? (
          <div className="space-y-3">
            <p className="text-sm text-zinc-400">
              Connect your GitHub account to clone repos and create PRs.
            </p>

            {showTokenInput ? (
              <div className="space-y-2">
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="GitHub personal access token"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm outline-none focus:border-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="flex-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded text-sm transition-colors"
                  >
                    Connect
                  </button>
                  <button
                    onClick={() => setShowTokenInput(false)}
                    className="flex-1 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowTokenInput(true)}
                className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Connect GitHub
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm font-medium">Your Repositories</div>

            {repos.map(repo => (
              <button
                key={repo.id}
                onClick={() => handleClone(repo)}
                className="w-full p-3 bg-zinc-800 hover:bg-zinc-700 rounded text-left transition-colors text-sm"
              >
                <div className="font-medium">{repo.name}</div>
                <div className="text-xs text-zinc-400 mt-1">
                  {repo.description || 'No description'}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Repo */}
      {selectedRepo && (
        <div className="p-4 border-t border-zinc-800 bg-zinc-800/50 space-y-2">
          <div className="text-sm font-medium">Selected</div>
          <div className="px-3 py-2 bg-blue-900/20 border border-blue-700 rounded text-xs">
            <div className="flex items-center gap-2">
              <GitBranch className="w-3 h-3" />
              {selectedRepo.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
