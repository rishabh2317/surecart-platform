// app/page.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useQuery } from '@tanstack/react-query';
import { Search, Heart, Zap, Clock } from 'lucide-react';

// --- API Functions (Preserved from your original code) ---
async function getHomepageData() {
    try {
        const res = await fetch(`http://localhost:3001/public/home`);
        if (!res.ok) return { new: [], trending: [] };
        return res.json();
    } catch (error) {
        console.error("Could not fetch homepage data:", error);
        return { new: [], trending: [] };
    }
}

async function getLikedCollections(userId: string) {
    const res = await fetch(`http://localhost:3001/users/${userId}/likes`);
    if (!res.ok) return [];
    return res.json();
}

// --- Sub Components (Preserved from your original code) ---
const CollectionCard = ({ collection }: { collection: any }) => (
    <div className="break-inside-avoid mb-4">
        <Link href={`/${collection.author}/${collection.slug}`} className="block group relative">
            <img
                src={collection.coverImage}
                alt={collection.name}
                className="w-full rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
                <div className="absolute bottom-0 left-0 p-4 flex items-center space-x-3">
                    <img src={collection.authorAvatar} alt={collection.author} className="w-8 h-8 rounded-full border-2 border-white" />
                    <div>
                        <h3 className="font-semibold text-white text-sm leading-tight">{collection.name}</h3>
                        <p className="text-xs text-slate-200">by {collection.author}</p>
                    </div>
                </div>
            </div>
        </Link>
    </div>
);

const LikedCollectionsSection = ({ userId }: { userId: string }) => {
    const { data: likedCollections = [], isLoading } = useQuery({
        queryKey: ['likedCollections', userId],
        queryFn: () => getLikedCollections(userId),
    });

    if (isLoading || likedCollections.length === 0) {
        return null;
    }

    return (
        <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
                <Heart className="w-7 h-7 text-red-500" />
                <h3 className="text-2xl font-bold text-slate-900">Your Liked Collections</h3>
            </div>
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
                {likedCollections.map((col: any) => <CollectionCard key={col.id} collection={col} />)}
            </div>
        </section>
    );
};

// --- MAIN PAGE (Preserved from your original code, adapted for new layout) ---
export default function HomePage() {
    const { user } = useAuth();

    const { data: homepageData, isLoading } = useQuery({
        queryKey: ['homepageData'],
        queryFn: getHomepageData
    });

    const newCollections = homepageData?.new || [];
    const trendingCollections = homepageData?.trending || [];

    return (
        // The <header> and <footer> are now correctly handled by the root layout.
        // The <main> tag is also in the layout, so we just return the content.
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            {/* The hero/search section from your original code is preserved */}
            <section className="text-center py-12">
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Discover Collections, Curated by Experts.</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-700">Find products hand-picked by creators you trust.</p>
            </section>

            {/* The conditional rendering of the Liked section is preserved */}
            {user && user.role === 'SHOPPER' && <LikedCollectionsSection userId={user.id} />}
            
            {isLoading ? <div>Loading collections...</div> : (
                <>
                    {trendingCollections.length > 0 && (
                        <section>
                            <div className="flex items-center space-x-3 mb-6"><Zap className="w-7 h-7 text-yellow-500" /><h3 className="text-2xl font-bold text-slate-900">Trending Now</h3></div>
                            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">{trendingCollections.map((col: any) => <CollectionCard key={col.id} collection={col} />)}</div>
                        </section>
                    )}
                    {newCollections.length > 0 && (
                        <section className="mt-12">
                            <div className="flex items-center space-x-3 mb-6"><Clock className="w-7 h-7 text-blue-500" /><h3 className="text-2xl font-bold text-slate-900">Newest Collections</h3></div>
                            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">{newCollections.map((col: any) => <CollectionCard key={col.id} collection={col} />)}</div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
}