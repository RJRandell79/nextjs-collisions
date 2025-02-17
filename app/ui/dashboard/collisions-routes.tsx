"use client";

import { useEffect, useState } from "react";
import { fetchCollisionsByRoute } from "@/app/lib/data";
import { roadClassPrefixNo } from "@/app/lib/utils";
import { CollisionsByRouteEntry } from "@/app/lib/definitions";
import { MapSkeleton } from "../skeletons";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/app/lib/charts/table"

export const CollisionByRouteTable = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<CollisionsByRouteEntry[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
            const response = await fetchCollisionsByRoute();
            console.log(response);
            setData(response as CollisionsByRouteEntry[]);
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
    <>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-50">Routes</h3>
        <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">Overview of all collisions listed by route.</p>
      </div>
      <TableRoot className="mt-8">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Position</TableHeaderCell>
              <TableHeaderCell>Route</TableHeaderCell>
              <TableHeaderCell>Police Force</TableHeaderCell>
              <TableHeaderCell>Area</TableHeaderCell>
              <TableHeaderCell className="text-right">Recorded Collisions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell >{roadClassPrefixNo(item.first_road_class, item.first_road_number)}</TableCell>
                <TableCell>{item.police_force}</TableCell>
                <TableCell>{item.local_authority_ons_district}</TableCell>
                <TableCell className="text-right">{item.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>
    </>
  )
}