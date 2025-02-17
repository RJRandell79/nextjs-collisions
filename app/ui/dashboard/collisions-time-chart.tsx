"use client"

import { useEffect, useState } from "react";
import { fetchCollisionsByTime } from "@/app/lib/data";
import { BarChart } from "@/app/lib/charts/barchart";
import { MapSkeleton } from "../skeletons";

export const CollisionsByTimeChart = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{ time: string, Fatal: number, Serious: number, Slight: number, }[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
            const response = await fetchCollisionsByTime();
            console.log(response);
            setData(response as { time: string; Fatal: number; Serious: number; Slight: number; }[]);
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
        <div>
            <h3 className="font-bold text-gray-900 sm:text-sm dark:text-gray-50">Total collisions by time of day</h3>
            <BarChart
                type={"stacked"}
                className="h-80"
                data={data}
                index="time"
                categories={["Fatal", "Serious", "Slight"]}
                colors={["fatal", "serious", "slight"]}
                valueFormatter={(number: number) =>
                `${Intl.NumberFormat("us").format(number).toString()}`
                }
                onValueChange={(v) => console.log(v)}
                xAxisLabel="Time"
                yAxisLabel="Number of collisions"
            />
        </div>
    )
}