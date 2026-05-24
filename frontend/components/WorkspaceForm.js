'use client';
import { useState } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { validators, validateForm } from '@/utils/validation';
import { AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/hooks/useAuthStore';
export function CreateWorkspaceForm({ onSuccess, onClose, }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const { token } = useAuthStore();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        const validationErrors = validateForm({ name }, { name: validators.workspaceName });
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }
        setIsLoading(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/workspaces`, { name, description }, { headers: { Authorization: `Bearer ${token}` } });
            onSuccess?.();
            onClose?.();
        }
        catch (err) {
            setErrors([
                {
                    field: 'submit',
                    message: err.response?.data?.message || 'Failed to create workspace',
                },
            ]);
        }
        finally {
            setIsLoading(false);
        }
    };
    const getFieldError = (field) => errors.find(e => e.field === field)?.message;
    return (<form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Workspace Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={`w-full px-3 py-2 bg-zinc-900 border rounded outline-none focus:border-blue-500 transition-colors ${getFieldError('name') ? 'border-red-600' : 'border-zinc-700'}`} placeholder="My Project" disabled={isLoading}/>
        {getFieldError('name') && (<p className="mt-1 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3"/>
            {getFieldError('name')}
          </p>)}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description (optional)</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded outline-none focus:border-blue-500 transition-colors resize-none" placeholder="What is this workspace for?" rows={3} disabled={isLoading}/>
      </div>

      {getFieldError('submit') && (<div className="p-3 bg-red-900/20 border border-red-700 rounded">
          <p className="text-sm text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0"/>
            {getFieldError('submit')}
          </p>
        </div>)}

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 rounded hover:bg-zinc-800 transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded font-medium transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4"/>
          {isLoading ? 'Creating...' : 'Create Workspace'}
        </button>
      </div>
    </form>);
}
//# sourceMappingURL=WorkspaceForm.js.map