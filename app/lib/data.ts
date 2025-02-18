'use server';

import { Record, SeverityDateEntry, SeverityTimeEntry, CollisionsByRouteEntry } from './definitions';
import { format } from 'date-fns';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const collisionsPerPage = 150;
const severityMapping: { [key: number]: string } = {
    1: 'Fatal',
    2: 'Serious',
    3: 'Slight',
};

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

export async function fetchCollisionsTotalPages() {
    try {
        const data = await sql<{ count: number }[]>
                `SELECT 
                    c.first_road_class, 
                    c.first_road_number, 
                    c.police_force, 
                    c.local_authority_ons_district,
                    COUNT(*) AS count
                FROM collisions c
                WHERE c.first_road_class IN (1, 2, 3, 4, 5) 
                  AND (c.first_road_number IS NOT NULL AND c.first_road_number != 0)
                GROUP BY c.first_road_class, c.first_road_number, c.police_force, c.local_authority_ons_district`;
        const totalCollisions = data.count;
        return Math.ceil(totalCollisions / collisionsPerPage);
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function fetchCollisionsByRoute( currentPage: number ) {
    const offset = (currentPage - 1) * collisionsPerPage;
    try {
        const data = await sql<CollisionsByRouteEntry[]>`
            WITH collision_data AS (
                SELECT 
                    c.first_road_class, 
                    c.first_road_number, 
                    c.police_force, 
                    c.local_authority_ons_district,
                    COUNT(*) AS count
                FROM collisions c
                WHERE c.first_road_class IN (1, 2, 3, 4, 5) 
                  AND (c.first_road_number IS NOT NULL AND c.first_road_number != 0)
                GROUP BY c.first_road_class, c.first_road_number, c.police_force, c.local_authority_ons_district
            )
            SELECT 
                cd.first_road_class, 
                cd.first_road_number, 
                pf.police_force AS police_force, 
                od.area AS local_authority_ons_district, 
                cd.count
            FROM collision_data cd
            JOIN police_forces pf ON cd.police_force = pf.code
            JOIN ons_districts od ON cd.local_authority_ons_district = od.code
            ORDER BY cd.count DESC
            LIMIT ${collisionsPerPage}
            OFFSET ${offset}
        `;
        return data;
    }
    catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function fetchCollisionsByTime() {
    try {
        const data = await sql<{ time: string, severity: number, count: number }[]>`
            SELECT DATE_TRUNC('hour', to_timestamp(time_recorded, 'HH24:MI')::time) AS time, legacy_collision_severity AS severity, COUNT(*) AS count
            FROM collisions
            GROUP BY DATE_TRUNC('hour', to_timestamp(time_recorded, 'HH24:MI')::time), severity
            ORDER BY time, severity
        `;
        const reshapedData = data.reduce((acc, row) => {
            if (!row.time) {
                console.error('Invalid time value:', row.time);
                return acc;
            }

            const existingEntry = acc.find(entry => entry.time === row.time);
            const severityName = severityMapping[row.severity];
            
            if (existingEntry) {
                existingEntry[severityName] = Number(row.count);
            } else {
                acc.push({
                    time: row.time,
                    [severityName]: Number(row.count),
                } as SeverityTimeEntry);
            }
            return acc;
        }, [] as SeverityTimeEntry[]);

        return reshapedData;
    }
    catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch data.');
    }
}

export async function fetchCollisionsByMonth() {
    try {
        const data = await sql<{ date: string, severity: number, count: number }[]>`
            SELECT DATE_TRUNC('month', date_recorded)::date AS date, legacy_collision_severity AS severity, COUNT(*) AS count
            FROM collisions
            GROUP BY date, severity
            ORDER BY date, severity
        `;
        const reshapedData = data.reduce((acc, row) => {
            const formattedDate = format(new Date(row.date), 'MMM yy');
            const existingEntry = acc.find(entry => entry.date === formattedDate);
            
            const severityName = severityMapping[row.severity];

            if (existingEntry) {
                existingEntry[severityName] = Number(row.count);
            } else {
                acc.push({
                date: formattedDate,
                [severityName]: Number(row.count),
                } as SeverityDateEntry);
            }
            
            return acc;
        }, [] as SeverityDateEntry[]);
        
        return reshapedData;
    }
    catch (error) {
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