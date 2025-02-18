'use client';

import { useState, useEffect } from "react"
import { Button } from "@/app/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/select"
import { MapSkeleton } from "../skeletons"
import { OnsDistrictsEntry, SelectOnsDistrictInputProps } from "@/app/lib/definitions";
import { fetchAllOnsDistricts } from "@/app/lib/data";

export function SelectOnsDistrictsInput({ onSelect }: SelectOnsDistrictInputProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<OnsDistrictsEntry[]>([]);
  const [selectedItem, setSelectedItem] = useState<OnsDistrictsEntry | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchAllOnsDistricts();
        setData(response as OnsDistrictsEntry[]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
          setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    onSelect(selectedItem);
  }, [selectedItem, onSelect]);
  
  if(loading) {
      return <MapSkeleton />
  }

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Select value={selectedItem?.code || ""} onValueChange={(code) => {
          const item = data.find((item) => item.code === code);
          setSelectedItem(item || null);
        }}>
          <SelectTrigger className="mx-auto h-10">
            <SelectValue placeholder="Select" aria-label={selectedItem?.area || ""} />
          </SelectTrigger>
          <SelectContent>
            {data.map((item) => (
              <SelectItem key={item.code} value={item.code}>
                <span className="flex items-center gap-x-2">{item.area}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          className="h-10 whitespace-nowrap"
          variant="secondary"
          onClick={() => setSelectedItem(null)}
        >
          Reset selection
        </Button>
      </div>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
        Selected area: {selectedItem?.area || "None"}
      </p>
    </>
  )
}