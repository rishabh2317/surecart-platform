// app/(marketing)/for-creators/page.tsx
import Link from 'next/link';

export default function ForCreatorsPage() {
  return (
    <div className="bg-slate-50 py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-extrabold text-slate-900">Your Influence, Your Income.</h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-700">
          Stop just recommending products. Start earning from them. surecart gives you the tools to build beautiful, shoppable collections in minutes. No contracts, no negotiations. Just curate, share, and earn.
        </p>
        <div className="mt-10">
            <Link href="/login?action=signup" className="text-xl inline-flex items-center justify-center px-10 py-5 font-semibold text-white bg-indigo-600 rounded-lg shadow-md">
                Create Your First Collection for Free
            </Link>
        </div>
      </div>
    </div>
  );
}