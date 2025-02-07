import { inter } from '@/app/ui/fonts';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./lib/map'));

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4">
        Logo
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-3/12 md:px-20">
          <p className={`${inter.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome</strong> to your new app!
          </p>
        </div>
        <div className="flex items-center justify-center p-0 md:w-9/12 rounded-lg overflow-hidden">
          <Map />
        </div>
      </div>
    </main>
  );
}
