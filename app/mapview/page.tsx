import Link from 'next/link';
import { Suspense } from 'react';
import MapServer from '../lib/mapserver';
import { MapSkeleton } from '../ui/skeletons';

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4">
        <ul>
            <li><Link href="/">Home</Link></li>
            <li><strong>Map View</strong></li>
        </ul>
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-3/12 md:px-20">
        </div>
        <div className="flex items-stretch justify-center p-0 md:w-9/12 rounded-lg overflow-hidden">
        <Suspense fallback={<MapSkeleton />}>
          <MapServer center={[-0.16712, 51.54760]} />
        </Suspense>
        </div>
      </div>
    </main>
  );
}