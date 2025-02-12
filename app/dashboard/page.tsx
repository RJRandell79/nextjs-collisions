'use client';

import Link from 'next/link';

export default function Home() {
  
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4">
        <ul>
            <li><Link href="/">Home</Link></li>
            <li><strong>Dashboard</strong></li>
        </ul>
      </div>
      <div className="mt-4 w-full h-full flex items-center justify-center">
        
      </div>
    </main>
  );
}
