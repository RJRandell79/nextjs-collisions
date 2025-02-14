"use client"

import React from "react"
import { DateRange, DateRangePicker } from "@/app/components/datepicker"

export const DateRangePickerYearNavigation = () => {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined,
  )
  return (
    <div className="flex items-center gap-y-4">
      <DateRangePicker
        enableYearNavigation
        value={dateRange}
        onChange={setDateRange}
        className="w-60 mr-3"
      />
      <p className="flex items-center rounded-md bg-gray-100 p-2 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-300">
        Selected Range:{" "}
        {dateRange
          ? `${dateRange.from?.toLocaleDateString()} – ${dateRange.to?.toLocaleDateString() ?? ""}`
          : "None"}
      </p>
    </div>
  )
}