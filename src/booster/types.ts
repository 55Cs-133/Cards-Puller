import { z } from 'zod';

export const CardSchema = z.object({
  id: z.string(),
  rarity: z.string(),
  foil: z.boolean().nullable(),
}).strict();

export const RarityRatesSchema = z.record(z.number());

export const FoilSchema = z.object({
  percentage: z.number(),
  max: z.number(),
}).strict();

export const SettingsSchema = z.object({
  common: z.number(),
  uncommon: z.number(),
  rare: z.number(),
  eleventh: RarityRatesSchema,
  foil: FoilSchema,
}).passthrough();

export type Card = z.infer<typeof CardSchema>;
export type RarityRates = z.infer<typeof RarityRatesSchema>;
export type Foil = z.infer<typeof FoilSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
