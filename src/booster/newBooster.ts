import { remove, times } from 'lodash-es';
import { number, z } from 'zod';

import rawCards from '../ressources/cartes.json';
import rawSettings from '../ressources/paramètres.json';
import { CardSchema, Card, Foil, FoilSchema, RarityRate, RarityRateSchema, FixedCard, FixedCardSchema } from './types';

// J'en suis au fait de transformer settings en plusieurs tableau avant de les passer à zod pour le parsing

const settings = Object.entries(rawSettings);
const parsedCardsPool: Card[] = z.array(CardSchema).parse(rawCards);
const parsedRarityRates: RarityRate[] = z.array(RarityRateSchema).parse(rawSettings.rarityRates);
const parsedFixedCards: FixedCard[] = z.array(FixedCardSchema).parse(rawSettings.fixedCards);
const parsedFoil: Foil = FoilSchema.parse(rawSettings.foil);

export default class Booster {
  private cardsPool = [...parsedCardsPool];
  private foil = parsedFoil;
  private rarityRates = [...parsedRarityRates];
  private fixedCards = [...parsedFixedCards];

  pickRarity(rates: RarityRate) {
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

  log() {
    console.table(this.cardsPool);
    console.table(this.foil);
    console.table(this.rarityRates);
    console.table(this.fixedCards);
  }

  drawCard(rarity: string, pool: Card[], foilSettings: Foil) {
    const theRarityPool = pool.filter((cards) => cards.rarity === rarity);
    const lenght = theRarityPool.length;
    const random = Math.floor(Math.random() * lenght);
    const flatPickedCard = theRarityPool[random];
    remove(this.cardsPool, (card: Card) => card.id === pickedCard.id);
    this.rawPickedCards.push(flatPickedCard);
  }
}
