// app/(marketing)/privacy/page.tsx
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <header className="bg-white border-b border-slate-200">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
            <Link href="/"><h1 className="text-3xl font-bold text-slate-900">surecart</h1></Link>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto prose">
          <h1>Privacy Policy</h1>
          <p>Last updated: August 7, 2025</p>
          <p>
            Welcome to surecart. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>
          <h2>Collection of Your Information</h2>
          <p>
            We may collect information about you in a variety of ways. The information we may collect on the Site includes personal data, such as your name, email address, and demographic information, that you voluntarily give to us when you register with the Site.
          </p>
          {/* Add more sections as required by law */}
        </div>
      </main>
    </div>
  );
}