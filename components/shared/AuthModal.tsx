// components/shared/AuthModal.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context'; // Uses the one source of truth
import { X } from 'lucide-react';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        // Registers the user with a 'SHOPPER' role by default
        await register({ email, password, username, role: 'SHOPPER' });
        alert('Account created! You can now engage with collections.');
      } else {
        await login(email, password);
      }
      // The redirect is now handled by the context
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        <button onClick={closeAuthModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X />
        </button>
        <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-800">{isSignUp ? 'Join surecart' : 'Welcome Back'}</h3>
            <p className="text-slate-600 mt-2">Sign up to like, save, and follow creators.</p>
        </div>
        <form onSubmit={handleAuth} className="mt-6 space-y-4">
          {isSignUp && (
            <div>
              <label className="text-sm font-medium text-slate-700">Username</label>
              <input type="text" placeholder="Choose a username" value={username} onChange={e => setUsername(e.target.value)} required className="mt-1 w-full p-3 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-teal-500" />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full p-3 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full p-3 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-teal-500" />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button type="submit" className="w-full py-3 rounded-lg text-white font-semibold bg-teal-500 hover:bg-teal-600">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm mt-6">
          <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-teal-600 hover:underline">
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}