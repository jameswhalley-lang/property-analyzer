import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as cheerio from 'cheerio';
import { getDb } from '../../db/index.js';
import { scrapeCache, suburbData } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const suburb = req.query.suburb as string;
  const state = (req.query.state as string)?.toUpperCase();
  const bedrooms = parseInt(req.query.bedrooms as string) || 2;

  if (!suburb || !state) {
    return res.status(400).json({ message: 'suburb and state are required' });
  }

  // First check suburb_data table for reference data
  try {
    const db = getDb();
    const suburbRef = await db
      .select()
      .from(suburbData)
      .where(
        and(
          eq(suburbData.suburb, suburb),
          eq(suburbData.bedrooms, bedrooms)
        )
      )
      .limit(1);

    if (suburbRef.length > 0) {
      const ref = suburbRef[0];
      return res.status(200).json({
        nightlyRateLow: parseFloat(ref.nightlyRateLow || '0'),
        nightlyRateMid: parseFloat(ref.nightlyRateMid || '0'),
        nightlyRateHigh: parseFloat(ref.nightlyRateHigh || '0'),
        occupancyLow: parseFloat(ref.occupancyLow || '0'),
        occupancyMid: parseFloat(ref.occupancyMid || '0'),
        occupancyHigh: parseFloat(ref.occupancyHigh || '0'),
        source: 'database',
      });
    }
  } catch {
    // DB not available, try scraping
  }

  const cacheKey = `airbnb:${state.toLowerCase()}:${suburb.toLowerCase().replace(/\s+/g, '-')}:${bedrooms}`;

  // Check scrape cache
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
    // Cache not available
  }

  try {
    // Scrape Airbnb search results
    const searchUrl = `https://www.airbnb.com.au/s/${encodeURIComponent(suburb)}--${encodeURIComponent(state)}--Australia/homes?adults=2&min_bedrooms=${bedrooms}&max_bedrooms=${bedrooms}`;

    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);
    const prices: number[] = [];

    // Try to extract prices from listing cards
    $('[data-testid="listing-card-subtitle"]').each((_, el) => {
      const text = $(el).text();
      const priceMatch = text.match(/\$(\d+)/);
      if (priceMatch) {
        prices.push(parseInt(priceMatch[1]));
      }
    });

    // Fallback: look for price in various formats
    if (prices.length === 0) {
      $('span').each((_, el) => {
        const text = $(el).text();
        if (text.match(/^\$\d+\s*(AUD)?$/)) {
          const price = parseInt(text.replace(/[^0-9]/g, ''));
          if (price > 50 && price < 2000) {
            prices.push(price);
          }
        }
      });
    }

    // Also try embedded JSON
    if (prices.length === 0) {
      const scripts = $('script[type="application/json"]').toArray();
      for (const script of scripts) {
        const content = $(script).html() || '';
        const priceMatches = content.match(/"priceString":"\\?\$(\d+)"/g);
        if (priceMatches) {
          for (const match of priceMatches) {
            const price = parseInt(match.replace(/[^0-9]/g, ''));
            if (price > 50 && price < 2000) {
              prices.push(price);
            }
          }
        }
      }
    }

    let result;
    if (prices.length > 0) {
      prices.sort((a, b) => a - b);
      const low = prices[Math.floor(prices.length * 0.25)];
      const mid = prices[Math.floor(prices.length * 0.5)];
      const high = prices[Math.floor(prices.length * 0.75)];

      result = {
        nightlyRateLow: low,
        nightlyRateMid: mid,
        nightlyRateHigh: high,
        occupancyLow: 55,
        occupancyMid: 68,
        occupancyHigh: 80,
        source: 'scraped',
      };
    } else {
      // Provide reasonable defaults based on bedrooms
      const baseRate = 100 + bedrooms * 50;
      result = {
        nightlyRateLow: Math.round(baseRate * 0.7),
        nightlyRateMid: baseRate,
        nightlyRateHigh: Math.round(baseRate * 1.5),
        occupancyLow: 55,
        occupancyMid: 68,
        occupancyHigh: 80,
        source: 'estimated',
      };
    }

    // Store in cache (48hr TTL)
    try {
      const db = getDb();
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
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
    console.error('Airbnb rates error:', error);
    const baseRate = 100 + bedrooms * 50;
    return res.status(200).json({
      nightlyRateLow: Math.round(baseRate * 0.7),
      nightlyRateMid: baseRate,
      nightlyRateHigh: Math.round(baseRate * 1.5),
      occupancyLow: 55,
      occupancyMid: 68,
      occupancyHigh: 80,
      source: 'fallback',
    });
  }
}
