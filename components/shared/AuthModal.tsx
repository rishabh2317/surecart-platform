// components/shared/AuthModal.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context'; // We will create this next

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
        await register({ email, password, username, role: 'SHOPPER' });
        alert('Account created! You can now like and save collections.');
      } else {
        await login(email, password);
        alert('Welcome back!');
      }
      closeAuthModal();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        <button onClick={closeAuthModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">&times;</button>
        <h3 className="text-2xl font-bold text-slate-800 text-center">{isSignUp ? 'Join surecart' : 'Welcome Back'}</h3>
        <p className="text-center text-slate-600 mt-2">Sign up to like, save, and follow creators.</p>
        <form onSubmit={handleAuth} className="mt-6 space-y-4">
          {isSignUp && <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required className="w-full p-3 border rounded-lg" />}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 border rounded-lg" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 border rounded-lg" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="w-full py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700">{isSignUp ? 'Create Account' : 'Sign In'}</button>
        </form>
        <p className="text-center text-sm mt-4">
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-indigo-600 hover:underline">
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}