import dynamic from 'next/dynamic';
import { fetchCollisions } from '../lib/data';
import { Record } from '@/app/lib/definitions';

const MapClient = dynamic(() => import('@/app/components/mapclient'));

export default async function MapServer() {
  const mapData: Record[] = await fetchCollisions();
  return <MapClient initialData={mapData} />;
            
}