import { fetchCollisions } from '../lib/data';
import MapClient from './mapclient';
import { CollisionMarkerProperties } from '@/app/lib/definitions';

export default async function MapServer({ center }: { center: [number, number] }) {
  const mapData: CollisionMarkerProperties[] = await fetchCollisions();
  return <MapClient center={center} initialData={mapData} />;
}