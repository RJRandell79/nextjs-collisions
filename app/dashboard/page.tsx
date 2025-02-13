import Link from 'next/link';
import { SeverityChart } from '../ui/dashboard/severity-chart';
import { RoadClassChart } from '../ui/dashboard/roadclass-chart';
import { MapSkeleton } from '../ui/skeletons';
import { Suspense } from 'react';

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-screen-2xl">
      <nav className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <aside className="flex-grow flex flex-col gap-4 p-4 bg-gray-50 rounded-lg shadow-md">
          <nav className="flex flex-1 flex-col space-y-10" aria-label="core navigation">
            <ul role="list" className="space-y-0.5">
              <li><Link href="/">Home</Link></li>
              <li><strong>Dashboard</strong></li>
            </ul>
          </nav>
        </aside>
      </nav>
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-2 shadow-sm sm:gap-x-6 sm:px-4 lg:hidden dark:border-gray-800 dark:bg-gray-950">
        <button type="button" className="flex items-center gap-x-1.5 rounded-md p-2 hover:bg-gray-100 focus:outline-none hover:dark:bg-gray-900">
          <span className="flex aspect-square size-7 items-center justify-center rounded bg-indigo-600 p-2 text-xs font-medium text-white dark:bg-indigo-500">RA</span>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="remixicon size-4 shrink-0 text-gray-500"><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path></svg>
          <div className="flex w-full items-center justify-between gap-x-3 truncate">
            <p className="truncate whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-50">Retail analytics</p>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="remixicon size-4 shrink-0 text-gray-500"><path d="M18.2072 9.0428 12.0001 2.83569 5.793 9.0428 7.20721 10.457 12.0001 5.66412 16.793 10.457 18.2072 9.0428ZM5.79285 14.9572 12 21.1643 18.2071 14.9572 16.7928 13.543 12 18.3359 7.20706 13.543 5.79285 14.9572Z"></path></svg>
          </div>
        </button>
        <div className="flex items-center gap-1 sm:gap-2">
          <button className="relative justify-center whitespace-nowrap border text-center transition-all duration-100 ease-in-out disabled:pointer-events-none disabled:shadow-none outline outline-offset-2 outline-0 focus-visible:outline-2 outline-indigo-500 dark:outline-indigo-500 shadow-none border-transparent dark:text-gray-50 bg-transparent disabled:text-gray-400 disabled:dark:text-gray-600 group flex items-center rounded-md p-1 text-sm font-medium text-gray-900 hover:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10" aria-label="User settings" type="button" id="radix-:r2:" aria-haspopup="menu" aria-expanded="false" data-state="closed">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300" aria-hidden="true">ES</span>
          </button>
          <button className="relative justify-center whitespace-nowrap border text-center transition-all duration-100 ease-in-out disabled:pointer-events-none disabled:shadow-none outline outline-offset-2 outline-0 focus-visible:outline-2 outline-indigo-500 dark:outline-indigo-500 shadow-none border-transparent text-gray-900 dark:text-gray-50 bg-transparent disabled:text-gray-400 disabled:dark:text-gray-600 group flex items-center rounded-md p-2 text-sm font-medium hover:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10" aria-label="open sidebar" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:R59kq:" data-state="closed">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="remixicon size-6 shrink-0 sm:size-5"><path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path></svg>
          </button>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button className="relative justify-center whitespace-nowrap border text-center transition-all duration-100 ease-in-out disabled:pointer-events-none disabled:shadow-none outline outline-offset-2 outline-0 focus-visible:outline-2 outline-indigo-500 dark:outline-indigo-500 shadow-none border-transparent dark:text-gray-50 bg-transparent disabled:text-gray-400 disabled:dark:text-gray-600 group flex items-center rounded-md p-1 text-sm font-medium text-gray-900 hover:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10" aria-label="User settings" type="button" id="radix-:r2:" aria-haspopup="menu" aria-expanded="false" data-state="closed">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300" aria-hidden="true">ES</span>
          </button>
          <button className="relative justify-center whitespace-nowrap border text-center transition-all duration-100 ease-in-out disabled:pointer-events-none disabled:shadow-none outline outline-offset-2 outline-0 focus-visible:outline-2 outline-indigo-500 dark:outline-indigo-500 shadow-none border-transparent text-gray-900 dark:text-gray-50 bg-transparent disabled:text-gray-400 disabled:dark:text-gray-600 group flex items-center rounded-md p-2 text-sm font-medium hover:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10" aria-label="open sidebar" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:R59kq:" data-state="closed">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="remixicon size-6 shrink-0 sm:size-5"><path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path></svg>
          </button>
        </div>
      </div>
      <main className="lg:pl-72">
        <div className="relative">
          <div className="p-4 sm:px-6 sm:pb-10 sm:pt-10 lg:px-10 lg:pt-7">
            <section aria-labelledby="">
              <h1 id="current-billing-cycle" className="scroll-mt-10 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">Statistics</h1>
              <div className="mt-4 grid grid-cols-1 gap-14 sm:mt-8 sm:grid-cols-2 lg:mt-10 xl:grid-cols-3">
                <div className="flex flex-col justify-between">
                  <div className="h-[310px] w-full">
                    <Suspense fallback={<MapSkeleton />}>
                      <SeverityChart />
                    </Suspense>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <div className="h-[310px] w-full">
                    <Suspense fallback={<MapSkeleton />}>
                      <RoadClassChart />
                    </Suspense>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
