// app/(marketing)/for-brands/page.tsx
import Link from 'next/link';

export default function ForBrandsPage() {
  return (
    <div className="bg-slate-50 py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-extrabold text-slate-900">Partner with surecart</h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-700">
          Put your products in the hands of authentic creators. surecart is a performance-based marketing channel that drives direct sales with a clear ROI.
        </p>
        <div className="mt-10">
            <Link href="#" className="text-xl inline-flex items-center justify-center px-10 py-5 font-semibold text-white bg-indigo-600 rounded-lg shadow-md">
                Contact Sales
            </Link>
        </div>
      </div>
    </div>
  );
}