'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { CollisionMarkerProperties } from '@/app/lib/definitions';
import { reformatDate, roadClass } from '@/app/lib/utils';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export default function MapClient({ center, initialData }: { center: [number, number], initialData: CollisionMarkerProperties[] }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && initialData.length > 0) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: 11
      });

      mapRef.current = map;

      map.on('load', () => {
        map.addSource('collisions', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: initialData.map(record => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [record.latitude, record.longitude]
              },
              properties: {
                collision_reference: record.collision_reference,
                date_recorded: record.date_recorded,
                time_recorded: record.time_recorded,
                first_road_class: record.first_road_class,
                first_road_number: record.first_road_number,
                legacy_collision_severity: record.legacy_collision_severity
              }
            }))
          },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50
        });

        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'collisions',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              100,
              '#f1f075',
              750,
              '#f28cb1'
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              100,
              30,
              750,
              40
            ]
          }
        });

        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'collisions',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          }
        });

        map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'collisions',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': [
              'match',
              ['get', 'legacy_collision_severity'],
              1, '#000000', 
              2, '#ff0000', 
              3, '#ff6900',
              '#11b4da'
            ],
            'circle-radius': 8,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });

        map.on('click', 'clusters', (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          });

          if (features[0]?.properties == null) {
            console.warn('Cluster ID is null or undefined:', features[0]);
            return;
          }

          if (!map.getSource('collisions')) {
            console.warn('Source collisions is null or undefined');
            return;
          }

          const clusterId = features[0].properties.cluster_id;
          const source = map.getSource('collisions') as mapboxgl.GeoJSONSource;

          source.getClusterExpansionZoom(
            clusterId,
            (err: Error | null | undefined, zoom: number | null | undefined) => {
              if (err || zoom == null) return;

              const geometry = features[0].geometry;
              if (geometry.type === 'Point') {
                const coordinates = geometry.coordinates;
                if (Array.isArray(coordinates) && coordinates.length === 2) {
                  map.easeTo({
                    center: coordinates as [number, number],
                    zoom: zoom
                  });
                } else {
                  console.warn('Coordinates are not in the expected format:', coordinates);
                }
              } else {
                console.warn('Geometry is not of type Point:', geometry);
              }
            }
          );
        });

        map.on('click', 'unclustered-point', (e) => {
          if(!e.features) return;

          const feature = e.features[0];
          const geometry = feature.geometry;

          if(geometry.type === 'Point') {
            const coordinates = geometry.coordinates.slice();
            const properties = feature.properties as CollisionMarkerProperties;
            const { collision_reference, date_recorded, time_recorded, first_road_class, first_road_number } = properties;

            new mapboxgl.Popup()
              .setLngLat(coordinates as [number, number])
              .setHTML(`${roadClass(Number(first_road_class), Number(first_road_number))}<p class="border-b border-grey-500">Date: ${reformatDate(date_recorded)}</p><p>Time: ${time_recorded}</p><a class="block mt-2 py-1 px-2 rounded-sm text-white text-center bg-green-500 font-bold" href="#" id="${collision_reference}">More info</a>`)
              .addTo(map);

            document.getElementById(collision_reference)?.addEventListener('click', (event) => {
              event.preventDefault();
              console.log('Clicked on:', collision_reference);
            });
          }
        });

        map.on('mouseenter', 'clusters', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', () => {
          map.getCanvas().style.cursor = '';
        });
      });

      return () => map.remove();
    }
  }, [initialData]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({center: center, essential: true});
    }
  }, [center]);

  if (initialData.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return <div ref={mapContainerRef} className="w-full h-full" />;
};