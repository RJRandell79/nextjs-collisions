import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import { parse } from 'csv-parse/sync';
import { Record } from '@/app/lib/definitions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { filePath } = req.query;

    if (typeof filePath !== 'string') {
        res.status(400).json({ error: 'Invalid file path' });
        return;
    }

    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const records: Record[] = parse(data, {
            columns: true,
            skip_empty_lines: true
        });
        res.setHeader('Cache-Control', 'no-store');
        res.status(200).json(records);
    } catch (error) {
        console.error(`Error reading data file:`, error);
        res.status(500).json({ error: 'Error reading data file' });
    }
}