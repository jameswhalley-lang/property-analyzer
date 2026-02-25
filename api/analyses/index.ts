import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../../db/index.js';
import { analyses } from '../../db/schema.js';
import { desc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = getDb();

    if (req.method === 'GET') {
      const result = await db
        .select({
          id: analyses.id,
          name: analyses.name,
          createdAt: analyses.createdAt,
          updatedAt: analyses.updatedAt,
        })
        .from(analyses)
        .orderBy(desc(analyses.updatedAt));

      return res.status(200).json({ analyses: result });
    }

    if (req.method === 'POST') {
      const { name, propertyData, financialData, renovations, growthRates } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }

      const result = await db
        .insert(analyses)
        .values({
          name,
          propertyData: propertyData || {},
          financialData: financialData || {},
          renovations: renovations || [],
          growthRates: growthRates || [],
        })
        .returning({ id: analyses.id });

      return res.status(201).json({ id: result[0].id });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Analyses error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
