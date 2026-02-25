import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { suburbData } from './schema';

const SEED_DATA = [
  // Sydney - NSW
  { postcode: '2000', suburb: 'Sydney', state: 'NSW', bedrooms: 1, nightlyRateLow: '150', nightlyRateMid: '200', nightlyRateHigh: '300', occupancyLow: '65', occupancyMid: '75', occupancyHigh: '85', councilRatesLow: '1200', councilRatesHigh: '2500' },
  { postcode: '2000', suburb: 'Sydney', state: 'NSW', bedrooms: 2, nightlyRateLow: '200', nightlyRateMid: '280', nightlyRateHigh: '400', occupancyLow: '65', occupancyMid: '75', occupancyHigh: '85', councilRatesLow: '1200', councilRatesHigh: '2500' },
  { postcode: '2000', suburb: 'Sydney', state: 'NSW', bedrooms: 3, nightlyRateLow: '280', nightlyRateMid: '380', nightlyRateHigh: '550', occupancyLow: '60', occupancyMid: '70', occupancyHigh: '80', councilRatesLow: '1200', councilRatesHigh: '2500' },
  { postcode: '2026', suburb: 'Bondi Beach', state: 'NSW', bedrooms: 2, nightlyRateLow: '220', nightlyRateMid: '320', nightlyRateHigh: '480', occupancyLow: '70', occupancyMid: '80', occupancyHigh: '90', councilRatesLow: '1400', councilRatesHigh: '2800' },
  { postcode: '2026', suburb: 'Bondi Beach', state: 'NSW', bedrooms: 3, nightlyRateLow: '300', nightlyRateMid: '420', nightlyRateHigh: '600', occupancyLow: '65', occupancyMid: '75', occupancyHigh: '85', councilRatesLow: '1400', councilRatesHigh: '2800' },
  { postcode: '2060', suburb: 'North Sydney', state: 'NSW', bedrooms: 2, nightlyRateLow: '180', nightlyRateMid: '250', nightlyRateHigh: '350', occupancyLow: '65', occupancyMid: '75', occupancyHigh: '82', councilRatesLow: '1300', councilRatesHigh: '2600' },
  { postcode: '2010', suburb: 'Surry Hills', state: 'NSW', bedrooms: 2, nightlyRateLow: '180', nightlyRateMid: '260', nightlyRateHigh: '380', occupancyLow: '70', occupancyMid: '78', occupancyHigh: '86', councilRatesLow: '1200', councilRatesHigh: '2400' },
  { postcode: '2011', suburb: 'Potts Point', state: 'NSW', bedrooms: 1, nightlyRateLow: '140', nightlyRateMid: '190', nightlyRateHigh: '280', occupancyLow: '70', occupancyMid: '80', occupancyHigh: '88', councilRatesLow: '1100', councilRatesHigh: '2200' },
  { postcode: '2031', suburb: 'Coogee', state: 'NSW', bedrooms: 2, nightlyRateLow: '200', nightlyRateMid: '280', nightlyRateHigh: '400', occupancyLow: '68', occupancyMid: '76', occupancyHigh: '84', councilRatesLow: '1400', councilRatesHigh: '2800' },
  { postcode: '2095', suburb: 'Manly', state: 'NSW', bedrooms: 2, nightlyRateLow: '220', nightlyRateMid: '310', nightlyRateHigh: '450', occupancyLow: '70', occupancyMid: '80', occupancyHigh: '88', councilRatesLow: '1500', councilRatesHigh: '3000' },
  { postcode: '2500', suburb: 'Wollongong', state: 'NSW', bedrooms: 3, nightlyRateLow: '150', nightlyRateMid: '220', nightlyRateHigh: '320', occupancyLow: '55', occupancyMid: '65', occupancyHigh: '75', councilRatesLow: '1800', councilRatesHigh: '3200' },
  { postcode: '2300', suburb: 'Newcastle', state: 'NSW', bedrooms: 3, nightlyRateLow: '160', nightlyRateMid: '230', nightlyRateHigh: '340', occupancyLow: '55', occupancyMid: '65', occupancyHigh: '75', councilRatesLow: '1600', councilRatesHigh: '3000' },
  // Melbourne - VIC
  { postcode: '3000', suburb: 'Melbourne', state: 'VIC', bedrooms: 1, nightlyRateLow: '120', nightlyRateMid: '170', nightlyRateHigh: '250', occupancyLow: '65', occupancyMid: '75', occupancyHigh: '85', councilRatesLow: '1000', councilRatesHigh: '2200' },
  { postcode: '3000', suburb: 'Melbourne', state: 'VIC', bedrooms: 2, nightlyRateLow: '170', nightlyRateMid: '240', nightlyRateHigh: '350', occupancyLow: '65', occupancyMid: '75', occupancyHigh: '85', councilRatesLow: '1000', councilRatesHigh: '2200' },
  { postcode: '3141', suburb: 'South Yarra', state: 'VIC', bedrooms: 2, nightlyRateLow: '160', nightlyRateMid: '230', nightlyRateHigh: '340', occupancyLow: '65', occupancyMid: '74', occupancyHigh: '82', councilRatesLow: '1200', councilRatesHigh: '2500' },
  { postcode: '3182', suburb: 'St Kilda', state: 'VIC', bedrooms: 2, nightlyRateLow: '150', nightlyRateMid: '220', nightlyRateHigh: '320', occupancyLow: '68', occupancyMid: '76', occupancyHigh: '84', councilRatesLow: '1100', councilRatesHigh: '2400' },
  { postcode: '3206', suburb: 'Albert Park', state: 'VIC', bedrooms: 3, nightlyRateLow: '220', nightlyRateMid: '320', nightlyRateHigh: '480', occupancyLow: '60', occupancyMid: '70', occupancyHigh: '80', councilRatesLow: '1400', councilRatesHigh: '2800' },
  { postcode: '3220', suburb: 'Geelong', state: 'VIC', bedrooms: 3, nightlyRateLow: '140', nightlyRateMid: '200', nightlyRateHigh: '300', occupancyLow: '55', occupancyMid: '65', occupancyHigh: '75', councilRatesLow: '1800', councilRatesHigh: '3200' },
  // Brisbane - QLD
  { postcode: '4000', suburb: 'Brisbane City', state: 'QLD', bedrooms: 1, nightlyRateLow: '120', nightlyRateMid: '170', nightlyRateHigh: '250', occupancyLow: '65', occupancyMid: '75', occupancyHigh: '85', councilRatesLow: '1200', councilRatesHigh: '2400' },
  { postcode: '4000', suburb: 'Brisbane City', state: 'QLD', bedrooms: 2, nightlyRateLow: '160', nightlyRateMid: '230', nightlyRateHigh: '340', occupancyLow: '65', occupancyMid: '75', occupancyHigh: '85', councilRatesLow: '1200', councilRatesHigh: '2400' },
  { postcode: '4217', suburb: 'Surfers Paradise', state: 'QLD', bedrooms: 2, nightlyRateLow: '150', nightlyRateMid: '220', nightlyRateHigh: '350', occupancyLow: '70', occupancyMid: '78', occupancyHigh: '86', councilRatesLow: '1800', councilRatesHigh: '3200' },
  { postcode: '4217', suburb: 'Surfers Paradise', state: 'QLD', bedrooms: 3, nightlyRateLow: '200', nightlyRateMid: '300', nightlyRateHigh: '450', occupancyLow: '65', occupancyMid: '75', occupancyHigh: '83', councilRatesLow: '1800', councilRatesHigh: '3200' },
  { postcode: '4567', suburb: 'Noosa Heads', state: 'QLD', bedrooms: 3, nightlyRateLow: '250', nightlyRateMid: '380', nightlyRateHigh: '550', occupancyLow: '65', occupancyMid: '75', occupancyHigh: '85', councilRatesLow: '2200', councilRatesHigh: '3800' },
  { postcode: '4810', suburb: 'Townsville', state: 'QLD', bedrooms: 3, nightlyRateLow: '120', nightlyRateMid: '170', nightlyRateHigh: '250', occupancyLow: '55', occupancyMid: '65', occupancyHigh: '75', councilRatesLow: '2000', councilRatesHigh: '3500' },
  { postcode: '4870', suburb: 'Cairns', state: 'QLD', bedrooms: 2, nightlyRateLow: '130', nightlyRateMid: '190', nightlyRateHigh: '280', occupancyLow: '60', occupancyMid: '70', occupancyHigh: '80', councilRatesLow: '1800', councilRatesHigh: '3200' },
  // Adelaide - SA
  { postcode: '5000', suburb: 'Adelaide', state: 'SA', bedrooms: 2, nightlyRateLow: '120', nightlyRateMid: '170', nightlyRateHigh: '250', occupancyLow: '60', occupancyMid: '70', occupancyHigh: '80', councilRatesLow: '1200', councilRatesHigh: '2400' },
  { postcode: '5000', suburb: 'Adelaide', state: 'SA', bedrooms: 3, nightlyRateLow: '160', nightlyRateMid: '230', nightlyRateHigh: '340', occupancyLow: '55', occupancyMid: '65', occupancyHigh: '75', councilRatesLow: '1200', councilRatesHigh: '2400' },
  { postcode: '5063', suburb: 'Eastwood', state: 'SA', bedrooms: 3, nightlyRateLow: '140', nightlyRateMid: '200', nightlyRateHigh: '300', occupancyLow: '55', occupancyMid: '65', occupancyHigh: '75', councilRatesLow: '1400', councilRatesHigh: '2800' },
  // Perth - WA
  { postcode: '6000', suburb: 'Perth', state: 'WA', bedrooms: 2, nightlyRateLow: '140', nightlyRateMid: '200', nightlyRateHigh: '300', occupancyLow: '60', occupancyMid: '70', occupancyHigh: '80', councilRatesLow: '1400', councilRatesHigh: '2800' },
  { postcode: '6000', suburb: 'Perth', state: 'WA', bedrooms: 3, nightlyRateLow: '180', nightlyRateMid: '260', nightlyRateHigh: '380', occupancyLow: '55', occupancyMid: '65', occupancyHigh: '75', councilRatesLow: '1400', councilRatesHigh: '2800' },
  { postcode: '6160', suburb: 'Fremantle', state: 'WA', bedrooms: 2, nightlyRateLow: '150', nightlyRateMid: '220', nightlyRateHigh: '320', occupancyLow: '63', occupancyMid: '72', occupancyHigh: '80', councilRatesLow: '1600', councilRatesHigh: '3000' },
  { postcode: '6530', suburb: 'Geraldton', state: 'WA', bedrooms: 3, nightlyRateLow: '120', nightlyRateMid: '170', nightlyRateHigh: '250', occupancyLow: '50', occupancyMid: '60', occupancyHigh: '70', councilRatesLow: '1800', councilRatesHigh: '3200' },
  // Hobart - TAS
  { postcode: '7000', suburb: 'Hobart', state: 'TAS', bedrooms: 2, nightlyRateLow: '140', nightlyRateMid: '200', nightlyRateHigh: '300', occupancyLow: '65', occupancyMid: '75', occupancyHigh: '85', councilRatesLow: '1600', councilRatesHigh: '3000' },
  { postcode: '7000', suburb: 'Hobart', state: 'TAS', bedrooms: 3, nightlyRateLow: '180', nightlyRateMid: '260', nightlyRateHigh: '380', occupancyLow: '60', occupancyMid: '70', occupancyHigh: '80', councilRatesLow: '1600', councilRatesHigh: '3000' },
  { postcode: '7250', suburb: 'Launceston', state: 'TAS', bedrooms: 3, nightlyRateLow: '130', nightlyRateMid: '190', nightlyRateHigh: '280', occupancyLow: '55', occupancyMid: '65', occupancyHigh: '75', councilRatesLow: '1400', councilRatesHigh: '2800' },
  // Darwin - NT
  { postcode: '0800', suburb: 'Darwin', state: 'NT', bedrooms: 2, nightlyRateLow: '130', nightlyRateMid: '190', nightlyRateHigh: '280', occupancyLow: '60', occupancyMid: '70', occupancyHigh: '80', councilRatesLow: '1600', councilRatesHigh: '3000' },
  { postcode: '0800', suburb: 'Darwin', state: 'NT', bedrooms: 3, nightlyRateLow: '170', nightlyRateMid: '240', nightlyRateHigh: '360', occupancyLow: '55', occupancyMid: '65', occupancyHigh: '75', councilRatesLow: '1600', councilRatesHigh: '3000' },
  // Canberra - ACT
  { postcode: '2600', suburb: 'Canberra', state: 'ACT', bedrooms: 2, nightlyRateLow: '140', nightlyRateMid: '200', nightlyRateHigh: '300', occupancyLow: '60', occupancyMid: '70', occupancyHigh: '80', councilRatesLow: '2000', councilRatesHigh: '3500' },
  { postcode: '2600', suburb: 'Canberra', state: 'ACT', bedrooms: 3, nightlyRateLow: '180', nightlyRateMid: '260', nightlyRateHigh: '380', occupancyLow: '55', occupancyMid: '65', occupancyHigh: '75', councilRatesLow: '2000', councilRatesHigh: '3500' },
  // Regional/Tourist areas
  { postcode: '2261', suburb: 'The Entrance', state: 'NSW', bedrooms: 3, nightlyRateLow: '140', nightlyRateMid: '200', nightlyRateHigh: '300', occupancyLow: '55', occupancyMid: '65', occupancyHigh: '75', councilRatesLow: '1600', councilRatesHigh: '3000' },
  { postcode: '2780', suburb: 'Katoomba', state: 'NSW', bedrooms: 3, nightlyRateLow: '180', nightlyRateMid: '260', nightlyRateHigh: '400', occupancyLow: '60', occupancyMid: '70', occupancyHigh: '80', councilRatesLow: '2000', councilRatesHigh: '3500' },
  { postcode: '2540', suburb: 'Jervis Bay', state: 'NSW', bedrooms: 3, nightlyRateLow: '200', nightlyRateMid: '300', nightlyRateHigh: '450', occupancyLow: '55', occupancyMid: '68', occupancyHigh: '80', councilRatesLow: '2000', councilRatesHigh: '3500' },
  { postcode: '2548', suburb: 'Merimbula', state: 'NSW', bedrooms: 3, nightlyRateLow: '160', nightlyRateMid: '230', nightlyRateHigh: '350', occupancyLow: '50', occupancyMid: '62', occupancyHigh: '74', councilRatesLow: '1800', councilRatesHigh: '3200' },
  { postcode: '3929', suburb: 'Lorne', state: 'VIC', bedrooms: 3, nightlyRateLow: '200', nightlyRateMid: '300', nightlyRateHigh: '450', occupancyLow: '55', occupancyMid: '68', occupancyHigh: '80', councilRatesLow: '2200', councilRatesHigh: '3800' },
  { postcode: '3943', suburb: 'Portsea', state: 'VIC', bedrooms: 3, nightlyRateLow: '250', nightlyRateMid: '380', nightlyRateHigh: '550', occupancyLow: '50', occupancyMid: '65', occupancyHigh: '78', councilRatesLow: '2500', councilRatesHigh: '4000' },
  { postcode: '4573', suburb: 'Coolum Beach', state: 'QLD', bedrooms: 3, nightlyRateLow: '180', nightlyRateMid: '260', nightlyRateHigh: '400', occupancyLow: '60', occupancyMid: '72', occupancyHigh: '82', councilRatesLow: '2000', councilRatesHigh: '3500' },
  { postcode: '4802', suburb: 'Airlie Beach', state: 'QLD', bedrooms: 2, nightlyRateLow: '160', nightlyRateMid: '240', nightlyRateHigh: '380', occupancyLow: '65', occupancyMid: '75', occupancyHigh: '85', councilRatesLow: '2200', councilRatesHigh: '3800' },
  { postcode: '6280', suburb: 'Margaret River', state: 'WA', bedrooms: 3, nightlyRateLow: '180', nightlyRateMid: '280', nightlyRateHigh: '420', occupancyLow: '55', occupancyMid: '68', occupancyHigh: '78', councilRatesLow: '1800', councilRatesHigh: '3200' },
  { postcode: '7116', suburb: 'Port Arthur', state: 'TAS', bedrooms: 3, nightlyRateLow: '150', nightlyRateMid: '220', nightlyRateHigh: '330', occupancyLow: '50', occupancyMid: '62', occupancyHigh: '74', councilRatesLow: '1400', councilRatesHigh: '2800' },
];

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is required');
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  console.log('Seeding suburb data...');

  for (const row of SEED_DATA) {
    await db.insert(suburbData).values(row).onConflictDoNothing();
  }

  console.log(`Seeded ${SEED_DATA.length} suburb data entries`);
}

seed().catch(console.error);
