import {
  pgTable,
  serial,
  text,
  jsonb,
  timestamp,
  integer,
  numeric,
  uuid,
} from 'drizzle-orm/pg-core';

export const scrapeCache = pgTable('scrape_cache', {
  id: serial('id').primaryKey(),
  cacheKey: text('cache_key').unique().notNull(),
  data: jsonb('data').notNull(),
  scrapedAt: timestamp('scraped_at', { withTimezone: true }).defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

export const analyses = pgTable('analyses', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  propertyData: jsonb('property_data').notNull(),
  financialData: jsonb('financial_data').notNull(),
  renovations: jsonb('renovations').notNull(),
  growthRates: jsonb('growth_rates').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const suburbData = pgTable('suburb_data', {
  id: serial('id').primaryKey(),
  postcode: text('postcode').notNull(),
  suburb: text('suburb').notNull(),
  state: text('state').notNull(),
  bedrooms: integer('bedrooms').notNull(),
  nightlyRateLow: numeric('nightly_rate_low'),
  nightlyRateMid: numeric('nightly_rate_mid'),
  nightlyRateHigh: numeric('nightly_rate_high'),
  occupancyLow: numeric('occupancy_low'),
  occupancyMid: numeric('occupancy_mid'),
  occupancyHigh: numeric('occupancy_high'),
  councilRatesLow: numeric('council_rates_low'),
  councilRatesHigh: numeric('council_rates_high'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
