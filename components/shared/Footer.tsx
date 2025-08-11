// components/shared/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-100 border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between items-center">
        <p className="text-slate-600">&copy; 2025 surecart. All rights reserved.</p>
        <div className="flex space-x-6">
          <Link href="/about" className="text-slate-600 hover:text-indigo-600">About</Link>
          <Link href="/for-creators" className="text-slate-600 hover:text-indigo-600">For Creators</Link>
          <Link href="/terms" className="text-slate-600 hover:text-indigo-600">Terms</Link>
          <Link href="/privacy" className="text-slate-600 hover:text-indigo-600">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}