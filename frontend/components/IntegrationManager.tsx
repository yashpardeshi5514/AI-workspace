'use client';

import { useState, useEffect } from 'react';
import { Zap, Copy, Trash2, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '@/hooks/useAuthStore';

interface Integration {
  _id: string;
  type: 'slack' | 'discord' | 'webhook' | 'api_key';
  name: string;
  enabled: boolean;
  apiKey: string;
  usageCount: number;
  lastUsed?: string;
}

interface IntegrationsProps {
  workspaceId: string;
}

export function IntegrationManager({ workspaceId }: IntegrationsProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [integrationType, setIntegrationType] = useState('webhook');
  const [integrationName, setIntegrationName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    loadIntegrations();
  }, [token]);

  const loadIntegrations = async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/integrations?workspaceId=${workspaceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIntegrations(res.data);
    } catch (err) {
      console.error('Failed to load integrations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!integrationName || !token) return;

    setIsCreating(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/integrations`,
        {
          workspaceId,
          type: integrationType,
          name: integrationName,
          config: {},
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIntegrationName('');
      await loadIntegrations();
    } catch (err) {
      console.error('Create failed:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    setCopied(apiKey);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = async (integrationId: string) => {
    if (!token || !window.confirm('Delete integration?')) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/integrations/${integrationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await loadIntegrations();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const integrationDocs = {
    slack: 'https://api.slack.com/docs',
    discord: 'https://discord.com/developers',
    webhook: 'https://docs.example.com/webhooks',
    api_key: 'https://docs.example.com/api',
  };

  return (
    <div className="space-y-6 p-6">
      {/* Create Form */}
      <div className="bg-zinc-800 p-4 rounded-lg">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Add Integration
        </h3>
        <form onSubmit={handleCreate} className="flex gap-2">
          <select
            value={integrationType}
            onChange={(e) => setIntegrationType(e.target.value)}
            className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded outline-none focus:border-blue-500"
          >
            <option value="webhook">Webhook</option>
            <option value="api_key">API Key</option>
            <option value="slack">Slack</option>
            <option value="discord">Discord</option>
          </select>
          <input
            type="text"
            value={integrationName}
            onChange={(e) => setIntegrationName(e.target.value)}
            placeholder="Integration name"
            className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded outline-none focus:border-blue-500"
            disabled={isCreating}
          />
          <button
            type="submit"
            disabled={isCreating || !integrationName}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded transition-colors"
          >
            Add
          </button>
        </form>
      </div>

      {/* Integrations List */}
      <div className="space-y-4">
        {integrations.map(integration => (
          <div key={integration._id} className="bg-zinc-800 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{integration.name}</span>
                  <span className="text-xs bg-zinc-700 px-2 py-1 rounded">
                    {integration.type}
                  </span>
                  {integration.enabled && (
                    <span className="text-xs bg-green-900/20 text-green-400 px-2 py-1 rounded">
                      Enabled
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-zinc-900 px-2 py-1 rounded text-xs font-mono text-zinc-300 truncate">
                      {integration.apiKey}
                    </code>
                    <button
                      onClick={() => handleCopy(integration.apiKey)}
                      className="text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      {copied === integration.apiKey ? (
                        <span className="text-xs">✓ Copied</span>
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="text-xs text-zinc-400 space-y-1">
                    <p>Usage: {integration.usageCount} calls</p>
                    {integration.lastUsed && (
                      <p>Last used: {new Date(integration.lastUsed).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={integrationDocs[integration.type]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleDelete(integration._id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {integrations.length === 0 && !isLoading && (
          <div className="text-center py-8 text-zinc-500">
            No integrations created yet
          </div>
        )}
      </div>
    </div>
  );
}
