'use server';

import { Record } from './definitions';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchCollisions() {
    try {
        const data = await sql<[Record]>`SELECT collisions.collision_reference, collisions.latitude, collisions.longitude, collisions.time_recorded, collisions.date_recorded, collisions.number_of_vehicles, collisions.first_road_class, collisions.first_road_number, collisions.legacy_collision_severity, collisions.number_of_casualties FROM collisions`;
        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function fetchCollisionById(id: string) {
    try {
        const data = await sql<Record[]>`SELECT * FROM collisions WHERE collision_reference = ${id} LIMIT 1`;
        return data[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function countAllCollisions() {
    try {
        const data = await sql<{ count: number }[]>`SELECT COUNT(*) FROM collisions`;
        return data[0].count;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function fetchCollisionsByLighting() {
    try {
        const totalCollisions = await countAllCollisions();
        const data = await sql<{ light_conditions: number, count: number }[]>`
            SELECT light_conditions, COUNT(*) AS count
            FROM collisions
            WHERE light_conditions IN (1, 4, 5, 6, 7)
            GROUP BY light_conditions
        `;
        const result = data.map(row => {
            let label = 'Unknown Lighting';
            let colour = 'bg-black';
            switch (row.light_conditions) {
                case 1:
                    label = 'Daylight';
                    colour = 'bg-blue-500';
                    break;
                case 4:
                    label = 'Darkness - lights lit';
                    colour = 'bg-yellow-500';
                    break;
                case 5:
                    label = 'Darkness - lights unlit';
                    colour = 'bg-gray-500';
                    break;
                case 6:
                    label = 'Darkness - no lighting';
                    colour = 'bg-black';
                    break;
                case 7:
                    label = 'Darkness - lighting unknown';
                    colour = 'bg-orange-500';
                    break;
                default:
                    label = 'Data missing or out of range';
                    colour = 'bg-red-500';
            }
            return { title: label, percentage: Number(row.count) / totalCollisions * 100, value: row.count.toString(), color: colour };
        });
        return result;
    }
    catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function fetchCollisionsByRoadClass() {
    try {
        const totalCollisions = await countAllCollisions();
        const data = await sql<{ first_road_class: number, count: number }[]>`
            SELECT first_road_class, COUNT(*) AS count
            FROM collisions
            WHERE first_road_class IN (1, 2, 3, 4, 5, 6)
            GROUP BY first_road_class
            ORDER BY first_road_class
        `;
        const result = data.map(row => {
            let label = 'Data missing or out of range';
            let colour = 'bg-black';
            switch (row.first_road_class) {
                case 1:
                    label = 'Motorway';
                    colour = 'bg-[#0079c1]';
                    break;
                case 2:
                    label = 'A(M)';
                    colour = 'bg-[#0079c1]';
                    break;
                case 3:
                    label = 'A';
                    colour = 'bg-[#00703c]';
                    break;
                case 4:
                    label = 'B';
                    colour = 'bg-[#00703c]';
                    break;
                case 5:
                    label = 'C';
                    colour = 'bg-[#f8e027]';
                    break;
                case 6:
                    label = 'Unclassified';
                    colour = 'bg-[#333333]';
                    break;
                default:
                    label = 'Data missing or out of range';
                    colour = 'bg-black';
            }
            return { title: label, percentage: Number(row.count) / totalCollisions * 100, value: row.count.toString(), color: colour };
        });
        return result;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function fetchSeverity() {
    try {
        const totalCollisions = await countAllCollisions();
        const data = await sql<{ severity: number, count: number }[]>`
            SELECT legacy_collision_severity AS severity, COUNT(*) AS count
            FROM collisions
            WHERE legacy_collision_severity IN (1, 2, 3)
            GROUP BY legacy_collision_severity
        `;
        
        const result = data.map(row => {
            let label = 'Unknown Severity';
            let colour = 'bg-white';
            switch (row.severity) {
                case 1:
                    label = 'Fatal';
                    colour = 'bg-black';
                    break;
                case 2:
                    label = 'Serious';
                    colour = 'bg-red-500';
                    break;
                case 3:
                    label = 'Slight';
                    colour = 'bg-orange-500';
                    break;
                default:
                    label = 'Unknown Severity';
                    colour = 'bg-white';
            }
            return { title: label, percentage: Number(row.count) / totalCollisions * 100, value: row.count.toString(), color: colour };
        });
        return result;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch severity data.');
    }
  }