'use client';

const getRoadClassForNumber = (num: number, route: number): string => {
  switch (num) {
    case 1:
      return '<p class="motorway inline-block mb-1 py-0 px-2 rounded-sm text-white">M' + route + '</p>';
    case 2:
      return '<p class="am-road inline-block mb-1 py-0 px-2 rounded-sm text-white">A(M)' + route + '</p>';
    case 3:
      return '<p class="a-road inline-block mb-1 py-0 px-2 rounded-sm">A' + route + '</p>';
    case 4:
      return '<p class="b-road inline-block mb-1 py-0 px-2 rounded-sm">B' + route + '</p>';
    case 5:
      return '<p class="c-road inline-block mb-1 py-0 px-2 rounded-sm">C' + route + '</p>';
    case 6:
      return '<p class="unclassified inline-block mb-1 py-0 px-2 rounded-sm text-white bg-black">Unclassified</p>';
    default:
      return '<p class="data-missing inline-block mb-1 py-0 px-2 rounded-sm text-white bg-black">Data missing or out of range</p>';
  }
};

export default getRoadClassForNumber;