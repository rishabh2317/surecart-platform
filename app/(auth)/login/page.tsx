// app/(auth)/login/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

function LoginComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, register } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If a logged-in shopper lands here trying to sign up, send them to onboarding
    if (user && user.role === 'SHOPPER' && searchParams.get('action') === 'signup') {
        router.push('/onboarding');
    }
    // If a guest clicks "Become a Creator", show the signup form
    if (searchParams.get('action') === 'signup') {
      setIsSignUp(true);
    }
  }, [searchParams, user, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        // Pass the CREATOR role when signing up from this flow
        await register({ email, password, username, role: 'CREATOR' });
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center"><h1 className="text-3xl font-bold text-slate-900">surecart</h1><p className="mt-2 text-slate-700">{isSignUp ? 'Create your creator account' : 'Welcome back'}</p></div>
        <form className="space-y-6" onSubmit={handleAuth}>
          {isSignUp && (<div><label className="text-sm font-medium text-slate-700">Username</label><input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-slate-50 border rounded-lg" /></div>)}
          <div><label className="text-sm font-medium text-slate-700">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-slate-50 border rounded-lg" /></div>
          <div><label className="text-sm font-medium text-slate-700">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-slate-50 border rounded-lg" /></div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="w-full py-3 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700">{isSignUp ? 'Sign Up & Continue' : 'Sign In'}</button>
        </form>
        <div className="text-center"><button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-indigo-600 hover:underline">{isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}</button></div>
      </div>
    </div>
  );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginComponent />
        </Suspense>
    )
}