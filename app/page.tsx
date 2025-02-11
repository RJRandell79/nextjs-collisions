'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import MoreInfoSection from './ui/information';
import SearchForm from './ui/searchform';
import useFetchData from './hooks/usefetchdata';

const Map = dynamic(() => import('./lib/map'));

export default function Home() {
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-0.16712, 51.54760]);
  const { data: mapData, loading } = useFetchData('app/data/sample.csv');

  const handleFeatureClick = (id: string) => {
    setSelectedFeatureId(id);
  }

  const handleSearch = async (location: string) => {
    try {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`);
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        setMapCenter([longitude, latitude]);
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      alert('Error fetching location');
    }
  };
  
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4">
        Logo
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-3/12 md:px-20">
          <SearchForm onSearch={handleSearch} />
          <MoreInfoSection featureId={selectedFeatureId} mapData={mapData} />
        </div>
        <div className="flex items-center justify-center p-0 md:w-9/12 rounded-lg overflow-hidden">
          <Map onFeatureClick={handleFeatureClick} mapData={mapData} loading={loading} center={mapCenter} />
        </div>
      </div>
    </main>
  );
}
