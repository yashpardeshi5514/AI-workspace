'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Activity, Zap } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '@/hooks/useAuthStore';
export function AnalyticsDashboard({ workspaceId }) {
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [days, setDays] = useState(30);
    const { token } = useAuthStore();
    useEffect(() => {
        loadAnalytics();
    }, [days, token]);
    const loadAnalytics = async () => {
        if (!token)
            return;
        try {
            setIsLoading(true);
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/analytics?workspaceId=${workspaceId}&days=${days}`, { headers: { Authorization: `Bearer ${token}` } });
            setAnalytics(res.data);
        }
        catch (err) {
            console.error('Failed to load analytics:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    if (isLoading) {
        return <div className="text-center py-8">Loading analytics...</div>;
    }
    if (!analytics) {
        return <div className="text-center py-8">No data available</div>;
    }
    const chartData = Object.entries(analytics.timeline).map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        events: count,
    }));
    const eventData = Object.entries(analytics.eventsByType).map(([event, count]) => ({
        name: event.replace('_', ' '),
        value: count,
    }));
    return (<div className="space-y-6 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Activity className="w-6 h-6"/>} label="Total Events" value={analytics.totalEvents}/>
        <StatCard icon={<Users className="w-6 h-6"/>} label="Active Users" value={analytics.activeUsers}/>
        <StatCard icon={<TrendingUp className="w-6 h-6"/>} label="Avg Daily" value={Math.round(analytics.totalEvents / days)}/>
        <StatCard icon={<Zap className="w-6 h-6"/>} label="Events/User" value={Math.round(analytics.totalEvents / Math.max(analytics.activeUsers, 1))}/>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {[7, 30, 90].map(d => (<button key={d} onClick={() => setDays(d)} className={`px-4 py-2 rounded ${days === d ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
            Last {d}d
          </button>))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="bg-zinc-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Events Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444"/>
              <XAxis dataKey="date" stroke="#888"/>
              <YAxis stroke="#888"/>
              <Tooltip contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #444' }}/>
              <Line type="monotone" dataKey="events" stroke="#3b82f6" strokeWidth={2}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Event Types */}
        <div className="bg-zinc-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Events by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444"/>
              <XAxis dataKey="name" stroke="#888" angle={-45} textAnchor="end" height={80}/>
              <YAxis stroke="#888"/>
              <Tooltip contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #444' }}/>
              <Bar dataKey="value" fill="#3b82f6"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>);
}
function StatCard({ icon, label, value, }) {
    return (<div className="bg-zinc-800 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-blue-400 opacity-50">{icon}</div>
      </div>
    </div>);
}
//# sourceMappingURL=AnalyticsDashboard.js.map