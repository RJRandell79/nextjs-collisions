'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import proj4 from 'proj4';
import { fetchData } from '@/app/lib/data';
import { Record } from '@/app/lib/definitions';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

proj4.defs([
  [
    'EPSG:27700',
    '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs'
  ],
  [
    'EPSG:4326',
    '+proj=longlat +datum=WGS84 +no_defs'
  ]
]);

const osgb36 = 'EPSG:27700';
const wgs84 = 'EPSG:4326';

const getRoadClassForNumber = (num: number, route: number): string | undefined => {
  switch (num) {
    case 1:
      return '<p class="motorway inline-block py-0 px-2 rounded-sm text-white">M' + route + '</p>';
    case 2:
      return '<p class="am-road inline-block py-0 px-2 rounded-sm text-white">A(M)' + route + '</p>';
    case 3:
      return '<p class="a-road inline-block py-0 px-2 rounded-sm">A' + route + '</p>';
    case 4:
      return '<p class="b-road inline-block py-0 px-2 rounded-sm">B' + route + '</p>';
    case 5:
      return '<p class="c-road inline-block py-0 px-2 rounded-sm">C' + route + '</p>';
    case 6:
      return '<p class="unclassified inline-block py-0 px-2 rounded-sm text-white bg-black">Unclassified</p>';
    default:
      return '<p class="data-missing inline-block py-0 px-2 rounded-sm text-white bg-black">Data missing or out of range</p>';
  }
};

const Map = () => {
  const [mapData, setMapData] = useState<Record[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData('app/data/sample.csv');
        const convertedData = data.map(record => {
          const easting = Number(record.location_easting_osgr);
          const northing = Number(record.location_northing_osgr);

          if (isNaN(easting) || isNaN(northing)) {
            console.warn('Invalid coordinates:', record);
            return null;
          }

          const [longitude, latitude] = proj4(osgb36, wgs84, [easting, northing]);

          return {
            ...record, longitude, latitude
          };
        }).filter(record => record !== null);

        setMapData(convertedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (mapContainerRef.current && mapData) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-0.16712, 51.54760],
        zoom: 11
      });

      mapData.forEach(record => {
        if (record && isFinite(record.longitude) && isFinite(record.latitude)) {
          console.log('Adding marker:', record);
          new mapboxgl.Marker()
            .setLngLat([record.longitude, record.latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>Date: ${record.date}</h3><p>Time: ${record.time}</p><p>No. of vehicles: ${record.number_of_vehicles}</p>${getRoadClassForNumber(Number(record.first_road_class), Number(record.first_road_number))}<a class="block" href="#" id="${record.collision_reference}">More info</a>`))
            .addTo(map);
        } else {
          console.warn('Skipping invalid coordinates:', record);
        }
      });

      return () => map.remove();
    }
  }, [mapData]);

  if (loading) {
    return <div className="loading animate-pulse">Loading...</div>;
  }

  return <div ref={mapContainerRef} className="w-full h-full" />;
};

export default Map;