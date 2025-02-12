'use client';

import { useEffect, useState } from 'react';
import { Record } from '@/app/lib/definitions';
import { roadClass, reformatDate } from '@/app/lib/utils';
import getSeverity from '@/app/lib/severity';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import { FaKitMedical, FaCarBurst } from 'react-icons/fa6';

const MoreInfoSection = ({ featureId, mapData } : { featureId: string | null, mapData : Record[] | null }) => {
  const [feature, setFeature] = useState<Record | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (featureId && mapData) {
        const selectedFeature = mapData.find(record => record.collision_reference === featureId) as Record;
        setFeature(selectedFeature || null);
      }
    }, [featureId, mapData]);

  if (!isClient) return null;

  if (!feature) return <div>Click on a marker for more information.</div>;

  return (
    <div className="more-info px-4 pt-4 pb-2 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Details</h2>
      <div className="flex items-center mb-3">
        <div className="mr-1" dangerouslySetInnerHTML={{ __html: roadClass(Number(feature.first_road_class), Number(feature.first_road_number))}}></div>
        <div className="mr-1" dangerouslySetInnerHTML={{ __html: getSeverity(Number(feature.legacy_collision_severity))}}></div>
      </div>
      <div className="flex items-center justify-between">
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FaCalendarAlt className="mr-2" />
          <span>{reformatDate(feature.date_recorded)}</span>
        </div>
        <div className="flex items-center">
          <FaClock className="mr-2" />
          <span> {feature.time_recorded}</span>
        </div>
      </div>
      <div>
        <div className="flex items-center border-t mt-2 pt-2">
          <FaCarBurst className="mr-2" />
          <span className="flex justify-between w-full"><strong>No. of Vehicles:</strong> <span>{feature.number_of_vehicles}</span></span>
        </div>
        <div className="flex items-center border-t mt-2 pt-2">
          <FaKitMedical className="mr-2" />
          <span className="flex justify-between w-full"><strong>Casualties:</strong> <span>{feature.number_of_casualties}</span></span>
        </div>
        <div className="text-xs border-t mt-2 pt-1 text-right">
          <span>#{feature.collision_reference}</span>
        </div>
      </div>
    </div>
  );
};

export default MoreInfoSection;