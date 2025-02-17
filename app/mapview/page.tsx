import Link from 'next/link';
import MapServer from '../lib/mapserver';
import { Suspense } from 'react';

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4">
        <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/route">By Route</Link></li>
            <li><strong>Map View</strong></li>
        </ul>
      </div>
      <Suspense fallback={<div className="w-full h-full mt-4 relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm">Loading...</div>}>
        <MapServer />
      </Suspense>
    </main>
  );
}