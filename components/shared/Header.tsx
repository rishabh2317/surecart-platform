// components/shared/Header.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Search } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown'; // We will create this next

export default function Header() {
    const { user, loading } = useAuth();

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 gap-4">
                <Link href="/" className="flex-shrink-0">
                    <h1 className="text-2xl font-bold text-teal-500">s</h1>
                </Link>
                <div className="flex-1">
                    <div className="relative">
                        <input type="search" placeholder="Search" className="w-full pl-10 pr-4 py-2 border-none bg-slate-100 rounded-full" />
                        <Search className="w-5 h-5 text-slate-500 absolute top-1/2 left-4 -translate-y-1/2" />
                    </div>
                </div>
                <div className="flex-shrink-0">
                    {!loading && (
                        <>
                            {user ? (
                                <ProfileDropdown />
                            ) : (
                                <Link href="/login" className="bg-teal-500 text-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-teal-600">
                                    Login
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}