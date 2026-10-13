import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">Page Not Found</h2>
      <p className="text-stone-600 mb-6">Could not find requested resource at Darbar Restaurant.</p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-lg transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
