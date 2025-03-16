import { remove, times } from 'lodash-es';
import { z } from 'zod';

import rawCards from '../ressources/cartes.json';
import rawSettings from '../ressources/paramètres.json';
import { CardSchema, SettingsSchema, Card, Settings, Foil, RarityRate, RarityRateSchema } from './types';

const boosterSettings: Settings = SettingsSchema.parse(rawSettings.booster);
const cardsPool: Card = CardSchema.parse(rawCards);
const { foil: maybeFoil, ...settings } = boosterSettings;

export default class Booster {
  private foil: Foil | null = maybeFoil;
  private fixedCardsAmount: FixedCards = Object.entries(settings).filter(([,value]) => typeof value === 'number');
  private rarityRates: RarityRate = Object.entries(settings).filter(([,value]) => RarityRateSchema.safeParse(value).success);
}
