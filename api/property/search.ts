import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as cheerio from 'cheerio';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const query = req.query.q as string;
  if (!query || query.length < 3) {
    return res.status(400).json({ message: 'Query must be at least 3 characters' });
  }

  try {
    const response = await fetch(
      `https://suggest.domain.com.au/suggestions?terms=${encodeURIComponent(query)}&max=6&channel=All`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      // Fallback: try scraping Domain search page
      const searchResponse = await fetch(
        `https://www.domain.com.au/sale/?ssubs=0&searchterm=${encodeURIComponent(query)}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          },
        }
      );
      const html = await searchResponse.text();
      const $ = cheerio.load(html);
      const results: Array<{ address: string; suburb: string; state: string; postcode: string; url: string }> = [];

      $('[data-testid="listing-card-wrapper"]').each((_, el) => {
        const link = $(el).find('a').first();
        const addressEl = $(el).find('[data-testid="address-line1"]');
        const suburbEl = $(el).find('[data-testid="address-line2"]');
        if (addressEl.length && link.attr('href')) {
          const fullAddress = `${addressEl.text().trim()}, ${suburbEl.text().trim()}`;
          const suburbParts = suburbEl.text().trim().split(/[\s,]+/);
          results.push({
            address: fullAddress,
            suburb: suburbParts.slice(0, -2).join(' '),
            state: suburbParts[suburbParts.length - 2] || '',
            postcode: suburbParts[suburbParts.length - 1] || '',
            url: `https://www.domain.com.au${link.attr('href')}`,
          });
        }
      });

      return res.status(200).json({ results });
    }

    const data = await response.json();
    const results = (data || []).map((item: Record<string, string>) => ({
      address: item.display || item.address || query,
      suburb: item.suburb || '',
      state: item.state || '',
      postcode: item.postcode || '',
      url: item.url || '',
    }));

    return res.status(200).json({ results });
  } catch (error) {
    console.error('Property search error:', error);
    return res.status(500).json({ message: 'Failed to search properties', results: [] });
  }
}
