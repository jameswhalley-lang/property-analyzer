import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as cheerio from 'cheerio';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const url = req.query.url as string;
  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // Try to extract data from embedded JSON (Next.js __NEXT_DATA__)
    let lastSalePrice: number | null = null;
    let lastSaleDate: string | null = null;
    let bedrooms: number | null = null;
    let propertyType: string | null = null;

    // Try __NEXT_DATA__ first
    const nextDataScript = $('script#__NEXT_DATA__').html();
    if (nextDataScript) {
      try {
        const nextData = JSON.parse(nextDataScript);
        const pageProps = nextData?.props?.pageProps;
        if (pageProps) {
          const listingDetail = pageProps.listingDetail || pageProps.digitalData?.property;
          if (listingDetail) {
            bedrooms = listingDetail.bedrooms || listingDetail.beds || null;
            propertyType = listingDetail.propertyType || listingDetail.type || null;
          }
        }
      } catch {
        // Ignore JSON parse errors
      }
    }

    // Scrape property features
    if (!bedrooms) {
      const bedroomText = $('[data-testid="property-features-feature-beds"]').text() ||
        $('[data-testid="property-features"] span:contains("Bed")').prev().text();
      bedrooms = parseInt(bedroomText) || null;
    }

    // Scrape sale history
    const soldPriceEl = $('[data-testid="listing-details__summary-title"]');
    if (soldPriceEl.length) {
      const priceText = soldPriceEl.text().replace(/[^0-9]/g, '');
      lastSalePrice = parseInt(priceText) || null;
    }

    // Look for sold date
    const soldDateEl = $('[data-testid="listing-details__listing-tag"]');
    if (soldDateEl.length) {
      lastSaleDate = soldDateEl.text().trim();
    }

    // Fallback: look for price in meta tags
    if (!lastSalePrice) {
      const metaPrice = $('meta[property="og:price:amount"]').attr('content');
      if (metaPrice) {
        lastSalePrice = parseInt(metaPrice) || null;
      }
    }

    return res.status(200).json({
      lastSalePrice,
      lastSaleDate,
      bedrooms,
      propertyType,
    });
  } catch (error) {
    console.error('Property details error:', error);
    return res.status(500).json({
      message: 'Failed to fetch property details',
      lastSalePrice: null,
      lastSaleDate: null,
      bedrooms: null,
      propertyType: null,
    });
  }
}
