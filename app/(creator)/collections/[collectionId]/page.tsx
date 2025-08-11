// app/(creator)/collections/[collectionId]/page.tsx
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getCollection } from '@/lib/api';
import { ArrowLeft, Edit } from 'lucide-react';

export default function ViewCollectionPage() {
  const params = useParams();
  const collectionId = params.collectionId as string;

  const { data: collection, isLoading, error } = useQuery({
    queryKey: ['collection', collectionId],
    queryFn: () => getCollection(collectionId),
    enabled: !!collectionId, // only run query if collectionId exists
  });

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading Collection...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <h1 className="text-xl font-bold text-slate-800 truncate px-4">{collection.name}</h1>
            {/* The edit page doesn't exist yet, so this link will 404 for now */}
            <Link href={`/collections/${collection.id}/edit`} className="flex items-center justify-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {collection.products.map((product: any) => (
            <Link href={`/products/${product.id}`} key={product.id} className="bg-white p-4 rounded-2xl shadow-sm group block">
              <div className="aspect-square w-full bg-slate-100 rounded-xl overflow-hidden mb-4">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <h3 className="font-semibold text-slate-800 truncate">{product.name}</h3>
              <p className="text-sm text-slate-500">{product.brand}</p>
            </Link>
          ))}
          {collection.products.length === 0 && <p className="text-slate-500 col-span-full text-center">This collection has no products yet.</p>}
        </div>
      </main>
    </div>
  );
}