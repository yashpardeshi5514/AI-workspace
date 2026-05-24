'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Shield, Mail } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '@/hooks/useAuthStore';
export function TeamManagement({ workspaceId }) {
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('member');
    const [isSending, setIsSending] = useState(false);
    const { token } = useAuthStore();
    useEffect(() => {
        loadMembers();
    }, [token]);
    const loadMembers = async () => {
        if (!token)
            return;
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/team?workspaceId=${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } });
            setMembers(res.data);
        }
        catch (err) {
            console.error('Failed to load members:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleInvite = async (e) => {
        e.preventDefault();
        if (!inviteEmail || !token)
            return;
        setIsSending(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/team/invite`, { workspaceId, email: inviteEmail, role: inviteRole }, { headers: { Authorization: `Bearer ${token}` } });
            setInviteEmail('');
            await loadMembers();
        }
        catch (err) {
            console.error('Invite failed:', err);
        }
        finally {
            setIsSending(false);
        }
    };
    const handleRemove = async (memberId) => {
        if (!token || !window.confirm('Remove team member?'))
            return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/team/${memberId}`, { headers: { Authorization: `Bearer ${token}` } });
            await loadMembers();
        }
        catch (err) {
            console.error('Remove failed:', err);
        }
    };
    return (<div className="space-y-6 p-6">
      {/* Invite Form */}
      <div className="bg-zinc-800 p-4 rounded-lg">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4"/>
          Invite Team Member
        </h3>
        <form onSubmit={handleInvite} className="flex gap-2">
          <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="user@example.com" className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded outline-none focus:border-blue-500" disabled={isSending}/>
          <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded outline-none focus:border-blue-500">
            <option value="viewer">Viewer</option>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" disabled={isSending || !inviteEmail} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded transition-colors">
            Invite
          </button>
        </form>
      </div>

      {/* Members List */}
      <div className="bg-zinc-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-zinc-700">
          <h3 className="font-semibold">Team Members ({members.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
                  Joined
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-zinc-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (<tr key={member._id} className="border-b border-zinc-700 hover:bg-zinc-700/50">
                  <td className="px-4 py-3 text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4 text-zinc-500"/>
                    {member.email}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4"/>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${member.status === 'active'
                ? 'bg-green-900/20 text-green-400'
                : member.status === 'invited'
                    ? 'bg-yellow-900/20 text-yellow-400'
                    : 'bg-red-900/20 text-red-400'}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-400">
                    {member.joinedAt
                ? new Date(member.joinedAt).toLocaleDateString()
                : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleRemove(member._id)} className="text-red-400 hover:text-red-300 transition-colors">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>

        {members.length === 0 && (<div className="p-8 text-center text-zinc-500">
            {isLoading ? 'Loading team members...' : 'No team members yet'}
          </div>)}
      </div>
    </div>);
}
//# sourceMappingURL=TeamManagement.js.map