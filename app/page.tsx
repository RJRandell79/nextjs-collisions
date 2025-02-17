'use client';

import Link from 'next/link';

export default function Home() {
  
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4">
        <ul>
          <li><Link href="/mapview">Map View</Link></li>
          <li><Link href="/dashboard">Dashboard</Link></li>
          <li><Link href="/route">By Route</Link></li>
        </ul>
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-3/12 md:px-20">
          Aside
        </div>
        <div className="flex items-center justify-center p-0 md:w-9/12 rounded-lg overflow-hidden">
          Content
        </div>
      </div>
    </main>
  );
}
