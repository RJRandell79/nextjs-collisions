import { useEffect, useState } from 'react';
import { fetchData } from '@/app/lib/data';
import { Record } from '@/app/lib/definitions';
import proj4 from 'proj4';

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

const useFetchData = (filePath: string) => {
  const [data, setData] = useState<Record[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData(filePath);
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

        setData(convertedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filePath]);

  return { data, loading };
};

export default useFetchData;