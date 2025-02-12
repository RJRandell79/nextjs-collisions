function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th'; // Special case for 11th to 13th
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

function getMonthName(month: number): string {
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return monthNames[month - 1];
}

export function reformatDate(dateTimeString: string): string {
    const dateString = dateTimeString.split('T')[0];
    const [year, month, day] = dateString.split('-').map(Number);
    const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;
    const monthName = getMonthName(month);
    return `${dayWithSuffix} ${monthName} ${year}`;
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