"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import Pagination from '@/app/ui/dashboard/pagination';
import { fetchCollisionsTotalPages, fetchCollisionsByRoute } from "@/app/lib/data";
import { positioningByPage, roadClassPrefixNo } from "@/app/lib/utils";
import { CollisionsByRouteEntry, CollisionsByRouteTableProps } from "@/app/lib/definitions";
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

export const CollisionByRouteTable = ({ selectedDistrict }: CollisionsByRouteTableProps) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<CollisionsByRouteEntry[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    useEffect(() => {
        const fetchData = async () => {
            try {
              setLoading(true);
              const totalPagesResponse = await fetchCollisionsTotalPages(selectedDistrict?.code);
              const response = await fetchCollisionsByRoute(currentPage, selectedDistrict?.code);
              setData(response as CollisionsByRouteEntry[]);
              setTotalPages(totalPagesResponse);
            } catch (error) {
              console.error('Error fetching data:', error);
            } finally {
              setLoading(false);
            }
        };
        fetchData();
        }, [currentPage, selectedDistrict]);

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
                <TableCell>{positioningByPage(currentPage, index)}</TableCell>
                <TableCell >{roadClassPrefixNo(item.first_road_class, item.first_road_number)}</TableCell>
                <TableCell>{item.police_force}</TableCell>
                <TableCell>{item.local_authority_ons_district}</TableCell>
                <TableCell className="text-right">{item.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  )
}