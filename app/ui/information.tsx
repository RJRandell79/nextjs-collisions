import { useEffect, useState } from 'react';
import { CollisionProperties, Record } from '@/app/lib/definitions';

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
    <div className="more-info">
      <h2>Collision Details</h2>
      <p><strong>Date:</strong> {feature.date}</p>
      <p><strong>Time:</strong> {feature.time}</p>
      <p><strong>Number of Vehicles:</strong> {feature.number_of_vehicles}</p>
      <p><strong>First Road Class:</strong> {feature.first_road_class}</p>
      <p><strong>First Road Number:</strong> {feature.first_road_number}</p>
      <p><strong>Collision Reference:</strong> {feature.collision_reference}</p>
    </div>
  );
};

export default MoreInfoSection;