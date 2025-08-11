// components/shared/ProfileDropdown.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ChevronDown, LogOut, Heart, PlusCircle } from 'lucide-react';

export default function ProfileDropdown() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
                <img src={user.profileImageUrl || `https://placehold.co/100x100/E2E8F0/475569?text=${user.username.charAt(0).toUpperCase()}`} alt="Profile" className="w-8 h-8 rounded-full" />
                <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2">
                   <div className="px-4 py-3 border-b">
    <div className="flex items-center space-x-3">
        <img src={user.profileImageUrl || `https://placehold.co/100x100/E2E8F0/475569?text=${user.username.charAt(0).toUpperCase()}`} alt="Profile" className="w-10 h-10 rounded-full" />
        <div>
            <p className="font-semibold text-slate-800">{user.username}</p>
            <p className="text-sm text-slate-500 truncate">{user.email}</p>
        </div>
    </div>
</div>
                    <div className="py-2">
                        {user.role === 'SHOPPER' && (
                            <Link href="/onboarding" className="flex items-center px-4 py-2 text-slate-700 hover:bg-slate-100">
                                <PlusCircle className="w-5 h-5 mr-3 text-teal-500" />
                                Become a Creator
                            </Link>
                        )}
                        <Link href="/likes" className="flex items-center px-4 py-2 text-slate-700 hover:bg-slate-100">
                            <Heart className="w-5 h-5 mr-3 text-red-500" />
                            Liked Collections
                        </Link>
                    </div>
                    <div className="border-t pt-2">
                        <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-slate-700 hover:bg-slate-100">
                            <LogOut className="w-5 h-5 mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}