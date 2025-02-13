import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { MapSkeleton } from '../ui/skeletons';
import { fetchCollisions } from '../lib/data';
import { Record } from '@/app/lib/definitions';

const MapClient = dynamic(() => import('@/app/components/mapclient'));

export default async function MapServer({ center }: { center: [number, number] }) {
  const mapData: Record[] = await fetchCollisions();
  return <MapClient initialData={mapData} />;
            
}