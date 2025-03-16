import { z } from 'zod';

export const CardSchema = z.object({
  id: z.string(),
  rarity: z.string(),
  foil: z.boolean().nullable(),
}).strict();

export const FoilSchema = z.object({
  percentage: z.number(),
  max: z.number(),
}).strict();

export const FixedCardSchema = z.record(z.number());

export const RarityRateSchema = z.record(z.number()).refine(
  (data) => Object.keys(data).length >= 2,
  {
    message: 'Un taux de rareté doit contenir au moins deux entrées.',
  },
);

export const SettingsSchema = z.object({
  foil: FoilSchema,
}).catchall(
  z.union([z.number(), RarityRateSchema]),
);

export type Card = z.infer<typeof CardSchema>;
export type Foil = z.infer<typeof FoilSchema>;
export type FixedCard = z.infer<typeof FixedCardSchema>;
export type RarityRate = z.infer<typeof RarityRateSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
