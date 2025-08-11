// app/(creator)/onboarding/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import the router
import { User, Instagram, Phone, UploadCloud } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { saveUserSession } from '@/lib/auth';


export default function OnboardingPage() {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const router = useRouter(); // Initialize the router

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  // Function to handle form submission
  const { user, updateUserSession } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    const profileData = {
        fullName: (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value,
        phone: (e.currentTarget.elements.namedItem('phone') as HTMLInputElement).value,
        instagramHandle: (e.currentTarget.elements.namedItem('instagram') as HTMLInputElement).value,
        profileImageUrl: profilePicture,
    };

    try {
        const res = await fetch(`http://localhost:3001/users/${user.id}/upgrade-to-creator`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData),
        });

        if (!res.ok) {
            throw new Error("Failed to upgrade profile.");
        }

        const updatedUser = await res.json();
        // This is the FIX: We update the central context with the new user data
        updateUserSession(updatedUser); 
        
        alert('Profile complete! Welcome to your creator dashboard.');
        router.push('/dashboard');

    } catch (error: any) {
        alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Welcome to surecart!</h1>
          <p className="mt-2 text-slate-600">Let's set up your creator profile.</p>
        </div>
        
        {/* Attach the handleSubmit function to the form's onSubmit event */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center space-y-4">
            <label htmlFor="dp-upload" className="cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed hover:border-indigo-500 transition-colors">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile preview" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <UploadCloud className="w-8 h-8 text-slate-700" />
                )}
              </div>
            </label>
            <input id="dp-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            <span className="text-sm text-slate-600">Upload a profile picture</span>
          </div>

          <div>
            {/* UI FIX: Increased label text color contrast */}
            <label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</label>
            {/* UI FIX: Increased icon and placeholder color contrast */}
            <div className="relative mt-1"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="w-5 h-5 text-slate-700" /></div><input type="text" id="name" required className="block w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg placeholder-slate-700" placeholder="Rishabh Singh" /></div>
          </div>
          
          <div>
            <label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone Number</label>
            <div className="relative mt-1"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="w-5 h-5 text-slate-700" /></div><input type="tel" id="phone" required className="block w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg placeholder-slate-700" placeholder="+91 98765 43210" /></div>
          </div>

          <div>
            <label htmlFor="instagram" className="text-sm font-medium text-slate-700">Instagram Handle</label>
            <div className="relative mt-1"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Instagram className="w-5 h-5 text-slate-700" /></div><input type="text" id="instagram" required className="block w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg placeholder-slate-700" placeholder="rishu_creates" /></div>
          </div>

          <button type="submit" className="w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Complete Profile
          </button>
        </form>
      </div>
    </div>
  );
}