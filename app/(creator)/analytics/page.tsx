// app/(creator)/analytics/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ArrowUpRight, MousePointerClick, DollarSign, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

// --- API Function ---
const getAnalyticsData = async (userId: string) => {
    const res = await fetch(`http://localhost:3001/dashboard/${userId}/analytics`);
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return res.json();
};

// --- Sub-Components for a clean structure ---
const StatCard = ({ title, value, icon: Icon, prefix = '', suffix = '' }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">{title}</p><Icon className="w-5 h-5 text-slate-400" /></div>
        <p className="mt-2 text-3xl font-bold text-slate-900">{prefix}{value.toLocaleString()}{suffix}</p>
    </div>
);

// --- MAIN PAGE ---
export default function AnalyticsPage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    const { data: analytics, isLoading } = useQuery({
        queryKey: ['analytics', user?.id],
        queryFn: () => getAnalyticsData(user.id),
        enabled: !!user,
    });

   // This is the FIX: Provide default values to prevent destructuring undefined
   const { 
    summary = { totalClicks: 0, totalEarnings: 0, totalConversions: 0, avgConversionRate: 0 }, 
    clicksOverTime = [], 
    topCollections = [] 
} = analytics || {};

if (isLoading || !user) {
    return (
        <div className="flex items-center justify-center h-[80vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
        </div>
    );
}

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="container mx-auto p-4 sm:p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Performance</h1>
                
                {/* Summary Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Clicks" value={summary.totalClicks} icon={MousePointerClick} />
                    <StatCard title="Total Earnings" value={summary.totalEarnings.toFixed(2)} icon={DollarSign} prefix="$" />
                    <StatCard title="Total Conversions" value={summary.totalConversions} icon={ShoppingCart} />
                    <StatCard title="Conversion Rate" value={summary.avgConversionRate} icon={ArrowUpRight} suffix="%" />
                </div>

                {/* Main Performance Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Clicks (Last 7 Days)</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={clicksOverTime}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }} />
                                <Bar dataKey="clicks" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Collections Table */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Top Collections</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-sm font-semibold text-slate-500 border-b">
                                    <th className="p-3">Collection</th>
                                    <th className="p-3 text-right">Clicks</th>
                                    <th className="p-3 text-right">Likes</th>
                                    <th className="p-3 text-right">Earnings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topCollections.map((col: any) => (
                                    <tr key={col.id} className="border-b last:border-b-0">
                                        <td className="p-3 font-medium text-slate-800">{col.name}</td>
                                        <td className="p-3 text-right text-slate-600">{col.clicks.toLocaleString()}</td>
                                        <td className="p-3 text-right text-slate-600">{col.likes.toLocaleString()}</td>
                                        <td className="p-3 text-right font-semibold text-indigo-600">${col.earnings.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}