import { Record } from './definitions';

export async function fetchData(filePath: string): Promise<Record[]> {
    try {
        const response = await fetch(`/api/fetch-data?filePath=${encodeURIComponent(filePath)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const records: Record[] = await response.json();
        return records;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Error fetching data');
    }
}