'use client';

import { useEffect, useState } from 'react';
import { CollisionProperties, Record } from '@/app/lib/definitions';
import getRoadClassForNumber from '@/app/lib/roadclass';
import getSeverity from '@/app/lib/severity';
import { FaCalendarAlt, FaClock, FaCar, } from 'react-icons/fa';
import { FaKitMedical } from 'react-icons/fa6';

const MoreInfoSection = ({ featureId, mapData } : { featureId: string | null, mapData : Record[] | null }) => {
  const [feature, setFeature] = useState<CollisionProperties | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (featureId && mapData) {
        const selectedFeature = mapData.find(record => record.collision_reference === featureId) as CollisionProperties;
        setFeature(selectedFeature || null);
      }
    }, [featureId, mapData]);

  if (!isClient) return null;

  if (!feature) return <div>No information available</div>;

  return (
    <div className="more-info px-4 pt-4 pb-2 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Details</h2>
      <div className="flex items-center mb-4">
        <div className="mr-1" dangerouslySetInnerHTML={{ __html: getRoadClassForNumber(Number(feature.first_road_class), Number(feature.first_road_number))}}></div>
        <div className="mr-1" dangerouslySetInnerHTML={{ __html: getSeverity(Number(feature.legacy_collision_severity))}}></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FaCalendarAlt className="mr-2" />
          <span>{feature.date}</span>
        </div>
        <div className="flex items-center">
          <FaClock className="mr-2" />
          <span> {feature.time}</span>
        </div>
      </div>
      <div>
        <div className="flex items-center border-t mt-2 pt-2">
          <FaCar className="mr-2" />
          <span className="flex justify-between w-full"><strong>No. of Vehicles:</strong> <span>{feature.number_of_vehicles}</span></span>
        </div>
        <div className="text-xs border-t mt-2 pt-1 text-right">
          <span>#{feature.collision_reference}</span>
        </div>
      </div>
    </div>
  );
};

export default MoreInfoSection;