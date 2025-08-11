// components/shared/ShareModal.tsx
'use client';

import { useState } from 'react';
import { useCollections } from '@/lib/collections-context';
import { Check, Copy, X } from 'lucide-react';

export function ShareModal() {
  const { shareableLink, closeShareModal } = useCollections();
  const [copied, setCopied] = useState(false);

  if (!shareableLink) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center relative">
        <button onClick={closeShareModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X />
        </button>
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800">Published!</h3>
        <p className="mt-2 text-slate-600">Your collection is live. Share this link with your audience.</p>
        <div className="mt-6 flex rounded-lg shadow-sm">
          <input type="text" readOnly className="flex-1 block w-full px-3 py-2 rounded-none rounded-l-lg bg-slate-100 text-slate-700 sm:text-sm border border-slate-300" value={shareableLink} />
          <button onClick={handleCopy} className={`inline-flex items-center px-4 py-2 border border-l-0 rounded-r-lg text-sm font-medium text-white ${copied ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
        <button onClick={closeShareModal} className="mt-6 w-full px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200">
          Done
        </button>
      </div>
    </div>
  );
}