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

const parsedSettings = SettingsSchema.parse(rawSettings.booster);

const parsedCards = z.array(CardSchema).parse(rawCards);

const settings = parsedSettings;

const cards: Card[] = parsedCards;

export default class Booster {
  private settings = settings;
  private fixCardsPool = Object.values(cards);
  private cardsPool = [...this.fixCardsPool];
  public pickedCards: Card[] = [];

  // public get pickedCard(): Card[] {
  // }

  applyFoil(card: Card, foilSettings: Foil) {
    if (Math.floor(Math.random() * 100) <= foilSettings.percentage) {
      return { ...card, foil: true };
    } else { return card; }
  }

  drawCard(rarity: string, pool: Card[], foilSettings: Foil) {
    const theRarityPool = pool.filter((cards) => cards.rarity === rarity);
    const lenght = theRarityPool.length;
    const random = Math.floor(Math.random() * lenght);
    const flatPickedCard = theRarityPool[random];
    const pickedCard = this.applyFoil(flatPickedCard, foilSettings);
    remove(this.cardsPool, (card: Card) => card.id === pickedCard.id);
    this.rawPickedCards.push(pickedCard);
  }

  pickRarity(rates: RarityRates) {
    const rarityEntries = Object.entries(rates);

    const rateSum = rarityEntries.reduce((sum, [, rate]) => sum + rate, 0);

    let random = Math.floor(Math.random() * rateSum);

    const selectedRarity = rarityEntries.reduce((acc, [rarity, rate]) => {
      if (acc) return acc;
      random -= rate;
      return random < 0 ? rarity : null;
    }, null as string | null);

    return selectedRarity;
  };

  constructor() {
    this.processSettings(this.settings);
  }

  private processSettings(settings: Settings): Record<string, any> {
    const result: Record<string, any> = {};

    Object.entries(settings).forEach(([key, value]) => {
      result[key] = this.processSetting(key, value);
    });
    return result;
  }

  private processSetting(key: string, value: number | RarityRates | Foil | null) {
    if (typeof value === 'number') {
      times(value, () => this.drawCard(key, this.cardsPool, this.settings.foil));
    } else if (typeof
    value === 'object'
    && value !== null
    && Object.values(value).every((value) => typeof value === 'number')
    && !('percentage' in value && 'max' in value)) {
      this.drawCard(this.pickRarity(value), this.cardsPool, this.settings.foil);
    }
    return value;
  }

  logPickedCardsWithoutFoil() {
    console.table(this.rawPickedCards);
  }
}
