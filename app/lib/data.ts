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