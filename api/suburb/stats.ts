import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as cheerio from 'cheerio';
import { getDb } from '../../db/index.js';
import { scrapeCache } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const suburb = req.query.suburb as string;
  const state = (req.query.state as string)?.toLowerCase();
  const postcode = req.query.postcode as string;

  if (!suburb || !state || !postcode) {
    return res.status(400).json({ message: 'suburb, state, and postcode are required' });
  }

  const cacheKey = `suburb:${state}:${suburb.toLowerCase().replace(/\s+/g, '-')}:${postcode}`;

  // Check cache
  try {
    const db = getDb();
    const cached = await db
      .select()
      .from(scrapeCache)
      .where(eq(scrapeCache.cacheKey, cacheKey))
      .limit(1);

    if (cached.length > 0 && new Date(cached[0].expiresAt!) > new Date()) {
      return res.status(200).json(cached[0].data);
    }
  } catch {
    // DB not available, proceed with scraping
  }

  try {
    const slugSuburb = suburb.toLowerCase().replace(/\s+/g, '-');
    const url = `https://www.domain.com.au/suburb-profile/${slugSuburb}-${state}-${postcode}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    let medianPrice = 0;
    let annualGrowth = 0;
    let threeYearGrowth = 0;
    let fiveYearGrowth = 0;
    let medianRent: number | null = null;

    // Try to parse embedded JSON data
    const scripts = $('script').toArray();
    for (const script of scripts) {
      const content = $(script).html() || '';
      if (content.includes('medianSoldPrice') || content.includes('suburbProfile')) {
        try {
          const jsonMatch = content.match(/\{[\s\S]*medianSoldPrice[\s\S]*\}/);
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            medianPrice = data.medianSoldPrice || data.medianPrice || 0;
            annualGrowth = data.annualGrowth || data.yearGrowth || 0;
          }
        } catch {
          // Continue with HTML parsing
        }
      }
    }

    // Fallback: parse HTML elements
    if (!medianPrice) {
      const medianEl = $('[data-testid="median-price"]').first();
      if (medianEl.length) {
        const priceText = medianEl.text().replace(/[^0-9]/g, '');
        medianPrice = parseInt(priceText) || 0;
      }
    }

    // Parse growth rates from the page
    $('[data-testid*="growth"]').each((_, el) => {
      const text = $(el).text();
      const value = parseFloat(text.replace(/[^0-9.-]/g, ''));
      if (!isNaN(value)) {
        if (!annualGrowth) annualGrowth = value;
      }
    });

    const result = {
      medianPrice,
      annualGrowth,
      threeYearGrowth: threeYearGrowth || annualGrowth * 3,
      fiveYearGrowth: fiveYearGrowth || annualGrowth * 5,
      medianRent,
    };

    // Store in cache (24hr TTL)
    try {
      const db = getDb();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await db
        .insert(scrapeCache)
        .values({ cacheKey, data: result, expiresAt })
        .onConflictDoUpdate({
          target: scrapeCache.cacheKey,
          set: { data: result, scrapedAt: new Date(), expiresAt },
        });
    } catch {
      // Cache store failure is non-fatal
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Suburb stats error:', error);
    return res.status(500).json({
      message: 'Failed to fetch suburb stats',
      medianPrice: 0,
      annualGrowth: 0,
      threeYearGrowth: 0,
      fiveYearGrowth: 0,
      medianRent: null,
    });
  }
}
