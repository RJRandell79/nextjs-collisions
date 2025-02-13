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

export function roadClass(num: number, route: number): string {
    switch (num) {
      case 1:
        return '<p class="motorway inline-block py-0 px-2 rounded-sm text-white">M' + route + '</p>';
      case 2:
        return '<p class="am-road inline-block py-0 px-2 rounded-sm text-white">A(M)' + route + '</p>';
      case 3:
        return '<p class="a-road inline-block py-0 px-2 rounded-sm">A' + route + '</p>';
      case 4:
        return '<p class="b-road inline-block py-0 px-2 rounded-sm">B' + route + '</p>';
      case 5:
        return '<p class="c-road inline-block py-0 px-2 rounded-sm">C' + route + '</p>';
      case 6:
        return '<p class="unclassified inline-block py-0 px-2 rounded-sm text-white bg-black">Unclassified</p>';
      default:
        return '<p class="data-missing inline-block py-0 px-2 rounded-sm text-white bg-black">Data missing or out of range</p>';
    }
  };