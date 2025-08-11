// app/(marketing)/about/page.tsx
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-white">
      <header className="bg-white border-b border-slate-200">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
            <Link href="/"><h1 className="text-3xl font-bold text-slate-900">surecart</h1></Link>
            <div className="flex items-center space-x-4">
                <Link href="/login?action=signup" className="bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow hover:bg-indigo-700">Become a Creator</Link>
            </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-slate-900">Our Mission</h1>
          <p className="mt-6 text-xl text-slate-700 leading-8">
            We believe in the power of authentic voices. Our mission is to build the world's most scalable and intuitive platform that empowers creators of all sizes to monetize their expertise and share products they genuinely love. We're closing the gap between curation and commerce, making it seamless for creators to earn and for consumers to discover.
          </p>
        </div>
      </main>
    </div>
  );
}