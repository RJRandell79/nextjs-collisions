// Tremor Raw cx [v0.0.0]
import clsx, { type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cx(...args: ClassValue[]) {
  return twMerge(clsx(...args))
}

// Tremor Raw focusInput [v0.0.1]
export const focusInput = [
  // base
  "focus:ring-2",
  // ring color
  "focus:ring-blue-200 focus:dark:ring-blue-700/30",
  // border color
  "focus:border-blue-500 focus:dark:border-blue-700",
]

// Tremor Raw focusRing [v0.0.1]
export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-blue-500 dark:outline-blue-500",
]

// Tremor Raw hasErrorInput [v0.0.1]
export const hasErrorInput = [
  // base
  "ring-2",
  // border color
  "border-red-500 dark:border-red-700",
  // ring color
  "ring-red-200 dark:ring-red-700/30",
]

export function reformatDateWithSuffix(dateString: string): string {
  const date = new Date(dateString);
  const day = date.toLocaleString('en-US', { weekday: 'long' });
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  const dateNumber = date.getDate();

  let suffix = 'th';
  if (dateNumber === 1 || dateNumber === 21 || dateNumber === 31) {
    suffix = 'st';
  } else if (dateNumber === 2 || dateNumber === 22) {
    suffix = 'nd';
  } else if (dateNumber === 3 || dateNumber === 23) {
    suffix = 'rd';
  }

  return `${day} ${dateNumber}${suffix} ${month} ${year}`;
}

export function positioningByPage(pageNumber: number, index: number): number {
  return (pageNumber > 1 ? (pageNumber - 1) * 150 : 0) + index + 1;
}

export function formatNumber(number: number, min: number, max: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  }).format(number);
}

export function roadClassPrefixNo(num: number, route: number): string {
  let str = 'Data missing or out of range';
  switch (num) {
    case 1:
      str = 'M' + route;
      break;
    case 2:
      str = 'A(M)' + route;
      break;
    case 3:
      str = 'A' + route;
      break;
    case 4:
      str = 'B' + route;
      break;
    case 5:
      str = 'C' + route;
      break;
    case 6:
      str = 'Unclassified';
      break;
    default:
      str = 'Data missing or out of range';
  }
  return str;
}

export function roadClassHTML(num: number, route: number): string {
    let html = '<p class="data-missing inline-block py-0 px-2 rounded-sm text-white bg-black">Data missing or out of range</p>';
    switch (num) {
      case 1:
        html = '<p class="motorway inline-block py-0 px-2 rounded-sm text-white">M' + route + '</p>';
        break;
      case 2:
        html = '<p class="am-road inline-block py-0 px-2 rounded-sm text-white">A(M)' + route + '</p>';
        break;
      case 3:
        html = '<p class="a-road inline-block py-0 px-2 rounded-sm">A' + route + '</p>';
        break;
      case 4:
        html = '<p class="b-road inline-block py-0 px-2 rounded-sm">B' + route + '</p>';
        break;
      case 5:
        html = '<p class="c-road inline-block py-0 px-2 rounded-sm">C' + route + '</p>';
        break;
      case 6:
        html = '<p class="unclassified inline-block py-0 px-2 rounded-sm text-white bg-black">Unclassified</p>';
        break;
      default:
        html = '<p class="data-missing inline-block py-0 px-2 rounded-sm text-white bg-black">Data missing or out of range</p>';
    }
    return html;
  };

export const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};