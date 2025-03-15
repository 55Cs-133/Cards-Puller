import { remove, times } from 'lodash-es';
import { z } from 'zod';

import rawCards from '../ressources/cartes.json';
import rawSettings from '../ressources/paramètres.json';
import { CardSchema, SettingsSchema, Card, Settings, Foil, RarityRates } from './types';

// type Card = { id: string; rarity: string; foil: boolean | null };

// type RarityRates = Record<string, number>;
// type Foil = { percentage: number; max: number };

// type Settings = {
//   common: number;
//   uncommon: number;
//   rare: number;
//   eleventh: RarityRates;
//   twelfth: RarityRates;
//   foil: Foil;
//   [key: string]: RarityRates | Foil | number;
// };

// const parsedSettings = SettingsSchema.parse(rawSettings.booster);

// const parsedCards = z.array(CardSchema).parse(rawCards);

// const settings = parsedSettings;

// const cards: Card[] = parsedCards;

const parsedSettings = SettingsSchema.parse(rawSettings.booster);
const settings: Settings = parsedSettings;

export const foil: Foil | null = settings.foil ?? null;

export const rarityRates: Record<string, RarityRates> = Object.entries(settings)
  .filter(([_, value]) =>
    typeof value === 'object'
    && value !== null
    && Object.values(value).every((v) => typeof v === 'number')
    && !('percentage' in value && 'max' in value), // Exclure foil
  )
  .reduce((acc, [key, value]) => {
    acc[key] = value as RarityRates;
    return acc;
  }, {} as Record<string, RarityRates>);

export const fixedCards: Record<string, number> = Object.entries(settings)
  .filter(([_, value]) => typeof value === 'number')
  .reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, number>);

console.log('Foil:', foil);
console.log('Rarity Rates:', rarityRates);
console.log('Fixed Cards:', fixedCards);
