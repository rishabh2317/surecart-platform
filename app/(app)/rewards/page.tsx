// app/(creator)/rewards/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CreatorPageHeader from '@/components/creator/CreatorPageHeader';
import { Copy, Check, Gift } from 'lucide-react';

// API Function
const getRewardsData = async (userId: string) => {
    const res = await fetch(`http://localhost:3001/users/${userId}/rewards`);
    if (!res.ok) throw new Error("Failed to fetch rewards");
    return res.json();
};

// --- Sub-Components for a clean structure ---
const CouponCard = ({ coupon }: { coupon: any }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(coupon.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col sm:flex-row">
            <img src={coupon.imageUrl} alt={coupon.description} className="h-48 w-full sm:h-auto sm:w-48 object-cover"/>
            <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                    <h3 className="font-bold text-lg text-slate-800">{coupon.description}</h3>
                    <p className="text-sm text-slate-500 mt-1">Use this code at checkout</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg px-4 py-2">
                        <span className="font-mono font-bold text-slate-700 tracking-widest">{coupon.code}</span>
                    </div>
                    <button 
                        onClick={handleCopy} 
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-sm ${copied ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
export default function RewardsPage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user && user.role !== 'CREATOR') {
            router.push('/'); // Redirect non-creators
        }
    }, [user, router]);

    const { data: rewards, isLoading } = useQuery({
        queryKey: ['rewards', user?.id],
        queryFn: () => getRewardsData(user.id),
        enabled: !!user,
    });

    if (isLoading || !user) return <div className="text-center p-12">Loading...</div>;

    const { wallet, coupons = [] } = rewards || {};

    return (
        <div className="min-h-screen bg-slate-50">
            <CreatorPageHeader title="My Rewards" />
            <main className="container mx-auto p-4 sm:p-8">
                {/* Wallet Section */}
                <section className="mb-12">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
                        <p className="font-semibold text-slate-300">Total Earnings</p>
                        <p className="text-5xl font-bold mt-2">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: wallet?.currency || 'INR' }).format(wallet?.balance || 0)}
                        </p>
                        <button className="mt-6 bg-white text-slate-800 font-bold px-6 py-3 rounded-lg hover:bg-slate-200">
                            Withdraw Funds
                        </button>
                    </div>
                </section>

                {/* Coupons Section */}
                <section>
                    <div className="flex items-center space-x-3 mb-6">
                        <Gift className="w-7 h-7 text-yellow-500" />
                        <h2 className="text-2xl font-bold text-slate-900">Your Exclusive Coupons</h2>
                    </div>
                    {coupons.length > 0 ? (
                        <div className="space-y-6">
                            {coupons.map((coupon: any) => <CouponCard key={coupon.id} coupon={coupon} />)}
                        </div>
                    ) : (
                        <p className="text-slate-600 text-center py-8">You don't have any coupons right now.</p>
                    )}
                </section>
            </main>
        </div>
    );
}