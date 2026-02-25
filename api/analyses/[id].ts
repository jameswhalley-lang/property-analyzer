import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../../db/index';
import { analyses } from '../../db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string;
  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  try {
    const db = getDb();

    if (req.method === 'GET') {
      const result = await db
        .select()
        .from(analyses)
        .where(eq(analyses.id, id))
        .limit(1);

      if (result.length === 0) {
        return res.status(404).json({ message: 'Analysis not found' });
      }

      return res.status(200).json(result[0]);
    }

    if (req.method === 'PUT') {
      const { name, propertyData, financialData, renovations, growthRates } = req.body;

      const result = await db
        .update(analyses)
        .set({
          ...(name && { name }),
          ...(propertyData && { propertyData }),
          ...(financialData && { financialData }),
          ...(renovations && { renovations }),
          ...(growthRates && { growthRates }),
          updatedAt: new Date(),
        })
        .where(eq(analyses.id, id))
        .returning({ id: analyses.id });

      if (result.length === 0) {
        return res.status(404).json({ message: 'Analysis not found' });
      }

      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const result = await db
        .delete(analyses)
        .where(eq(analyses.id, id))
        .returning({ id: analyses.id });

      if (result.length === 0) {
        return res.status(404).json({ message: 'Analysis not found' });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
