'use client';

const getSeverity = (num: number): string => {
  switch (num) {
    case 1:
      return '<p class="inline-block py-0 px-2 rounded-sm text-white bg-black">Fatal</p>';
    case 2:
      return '<p class="inline-block py-0 px-2 rounded-sm text-white bg-red-500">Serious</p>';
    default:
      return '<p class="inline-block py-0 px-2 rounded-sm text-white bg-orange-500">Slight</p>';
  }
};

export default getSeverity;
