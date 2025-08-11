// app/(marketing)/terms/page.tsx
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="bg-white">
      <header className="bg-white border-b border-slate-200">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
            <Link href="/"><h1 className="text-3xl font-bold text-slate-900">surecart</h1></Link>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto prose">
          <h1>Terms of Service</h1>
          <p>Last updated: August 7, 2025</p>
          <h2>Agreement to Terms</h2>
          <p>
            By using our services, you agree to be bound by these Terms. If you don’t agree to be bound by these Terms, do not use the Services.
          </p>
          {/* Add more sections as required */}
        </div>
      </main>
    </div>
  );
}