'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import proj4 from 'proj4';
import { fetchData } from '@/app/lib/data';
import { Record, CollisionProperties } from '@/app/lib/definitions';
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
      return '<p class="motorway inline-block mb-1 py-0 px-2 rounded-sm text-white">M' + route + '</p>';
    case 2:
      return '<p class="am-road inline-block mb-1 py-0 px-2 rounded-sm text-white">A(M)' + route + '</p>';
    case 3:
      return '<p class="a-road inline-block mb-1 py-0 px-2 rounded-sm">A' + route + '</p>';
    case 4:
      return '<p class="b-road inline-block mb-1 py-0 px-2 rounded-sm">B' + route + '</p>';
    case 5:
      return '<p class="c-road inline-block mb-1 py-0 px-2 rounded-sm">C' + route + '</p>';
    case 6:
      return '<p class="unclassified inline-block mb-1 py-0 px-2 rounded-sm text-white bg-black">Unclassified</p>';
    default:
      return '<p class="data-missing inline-block mb-1 py-0 px-2 rounded-sm text-white bg-black">Data missing or out of range</p>';
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

      map.on('load', () => {
        map.addSource('collisions', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: mapData.map(record => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [record.longitude, record.latitude]
              },
              properties: {
                collision_reference: record.collision_reference,
                date: record.date,
                time: record.time,
                number_of_vehicles: record.number_of_vehicles,
                first_road_class: record.first_road_class,
                first_road_number: record.first_road_number,
                severity: record.legacy_collision_severity
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
              ['get', 'severity'],
              '1', '#000000', 
              '2', '#ff0000', 
              '3', '#ffa500',
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
            const properties = feature.properties as CollisionProperties;
            const { collision_reference, date, time, number_of_vehicles, first_road_class, first_road_number } = properties;

            new mapboxgl.Popup()
              .setLngLat(coordinates as [number, number])
              .setHTML(`${getRoadClassForNumber(Number(first_road_class), Number(first_road_number))}<p class="border-b border-grey-500">Date: ${date}</p><p>Time: ${time}</p><a class="block mt-2 py-1 px-2 rounded-sm text-white text-center bg-green-500 font-bold" href="#" id="${collision_reference}">More info</a>`)
              .addTo(map);
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
  }, [mapData]);

  if (loading) {
    return <div className="loading animate-pulse">Loading...</div>;
  }

  return <div ref={mapContainerRef} className="w-full h-full" />;
};

export default Map;