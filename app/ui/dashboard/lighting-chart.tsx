'use client';

import { useEffect, useState } from "react";
import { fetchCollisionsByLighting, countAllCollisions } from "@/app/lib/data";
import { formatNumber } from "@/app/lib/utils";
import { CategoryBarCard } from "@/app/lib/charts/categorybarcard";
import { MapSkeleton } from "../skeletons";

export const RoadLightingChart = () => {
    const [loading, setLoading] = useState(true);
    const [totalCollisions, setTotalCollisions] = useState(0);
    const [data, setData] = useState<{ title: string, percentage: number, value: string, color: string }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetchCollisionsByLighting();
            const totalCollisions = await countAllCollisions();
            setData(response);
            setTotalCollisions(totalCollisions);
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }, []);

    if(loading) {
        return <MapSkeleton />
    }

    return (
        <CategoryBarCard
            title="Road Lighting"
            value={formatNumber(totalCollisions, 0, 0)}
            valueDescription="total collisions"
            subtitle="Collisions by Road Lighting"
            ctaDescription="Data available at"
            ctaText="Department for Transport"
            ctaLink="https://www.data.gov.uk/dataset/cb7ae6f0-4be6-4935-9277-47e5ce24a11f/road-accidents-safety-data"
            data={data}
        />
    )
}