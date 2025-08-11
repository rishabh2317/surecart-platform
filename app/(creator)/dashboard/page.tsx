'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDashboardData, deleteCollection } from '@/lib/api';
import { getUserSession, clearUserSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Plus, ChevronRight, Trash2, Share2, Check } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    const sessionUser = getUserSession();
    if (!sessionUser) router.push('/login');
    else setUser(sessionUser);
  }, [router]);

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard', user?.id],
    queryFn: () => getDashboardData(user.id),
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCollection,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['dashboard', user?.id] }); },
  });

  const handleDelete = (collectionId: string) => {
    if (window.confirm("Are you sure?")) deleteMutation.mutate(collectionId);
  };

  const handleShare = (collection: any) => {
    const link = `http://localhost:3000/${collection.username}/${collection.slug}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(collection.id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  if (!user || isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const collections = dashboardData?.collections || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-slate-900">My Collections</h2>
            <div className="flex items-center space-x-2 self-end sm:self-center">
                <Link href="/analytics"><button className="bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg flex items-center shadow-sm hover:bg-slate-50">View Analytics</button></Link>
                <Link href="/collections/new"><button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center shadow hover:bg-indigo-700"><Plus className="w-5 h-5 mr-2" />New Collection</button></Link>
            </div>
        </div>
        
        {/* --- NEW GRID LAYOUT --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col: any) => (
            <div key={col.id} className="bg-white p-5 rounded-lg shadow-sm flex flex-col group">
              <h3 className="font-semibold text-slate-800 text-lg mb-2">{col.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{col.productsCount} products</p>
              
              <div className="flex-grow grid grid-cols-3 gap-4 text-center border-t border-b py-4">
                  <div><p className="font-bold text-xl text-slate-800">{col.likes.toLocaleString()}</p><p className="text-xs text-slate-500">Likes</p></div>
                  <div><p className="font-bold text-xl text-slate-800">{col.shares.toLocaleString()}</p><p className="text-xs text-slate-500">Shares</p></div>
                  <div><p className="font-bold text-xl text-slate-800">N/A</p><p className="text-xs text-slate-500">Clicks</p></div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Link href={`/${col.username}/${col.slug}`} className="text-sm font-medium text-indigo-600 hover:underline">View Public Page</Link>
                <div className="flex items-center">
                    <button onClick={() => handleShare(col)} className="p-2 text-slate-400 hover:text-indigo-600">{copiedLink === col.id ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}</button>
                    <button onClick={() => handleDelete(col.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {collections.length === 0 && <p className="text-slate-600 text-center py-8">You haven't created any collections yet.</p>}
      </main>
    </div>
  );
}