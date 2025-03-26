import { shuffle, remove, times } from 'lodash-es';
import { z } from 'zod';

import rawCards from '../ressources/cartes.json';
import rawSettings from '../ressources/paramètres.json';
import { CardSchema, Card, Foil, FoilSchema, RarityRate, RarityRateSchema, FixedCard, FixedCardSchema } from './types';

const parsedCardsPool: Card[] = z.array(CardSchema).parse(rawCards);
const parsedRarityRates: RarityRate[] = z.array(RarityRateSchema).parse(Object.values(rawSettings.rarityRates));
const parsedFixedCards: FixedCard[] = z.array(FixedCardSchema).parse(Object.entries(rawSettings.fixedCards).map(([key, value]) => ({ key, value })));
const parsedFoil: Foil = FoilSchema.parse(rawSettings.foil);

export default class Booster {
  private cardsPool = [...parsedCardsPool];
  private foil = { ...parsedFoil };
  private rarityRates = [...parsedRarityRates];
  private fixedCards = [...parsedFixedCards];
  private pickedCards: Card[] = [];
  private finalCards: Card[] = [];

  constructor() {
    this.drawFixedCards();
    this.drawRatedCards();
    this.applyFoil();
  }

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

  logFinalCards() {
    console.log('Final cards:');
    console.table(this.finalCards);
  }

  obtainCards() {
    return this.finalCards;
  }

  drawCard(rarity: string | null) {
    if (rarity === null) {
      console.warn('Rarity is NULL');
      return;
    }
    const theRarityPool = this.cardsPool.filter((cards) => cards.rarity === rarity);
    const lenght = theRarityPool.length;
    const random = Math.floor(Math.random() * lenght);
    const pickedCard = theRarityPool[random];
    remove(this.cardsPool, (card: Card) => card.id === pickedCard.id);
    this.pickedCards.push(pickedCard);
  }

  drawFixedCards() {
    this.fixedCards.forEach((fixedCard) => times(fixedCard.value, () => this.drawCard(fixedCard.key)));
  }

  drawRatedCards() {
    this.rarityRates.forEach((rarityRate) => this.drawCard(this.pickRarity(rarityRate)));
  }

  mayBeFoil() {
    return Math.floor(Math.random() * 100) < this.foil.percentage;
  }

  applyFoil() {
    const alreadyFoiledCard = [...this.pickedCards.filter((card) => card.foil === true)].length;
    if (alreadyFoiledCard >= this.foil.max) {
      return;
    }
    const foilAvailable = this.foil.max - alreadyFoiledCard;
    const nonFoilPickedCards = [...this.pickedCards.filter((card) => card.foil !== true)];
    const candidatesCards = shuffle(nonFoilPickedCards.filter(() => this.mayBeFoil()));
    const cardsToFoil
    = candidatesCards.length <= foilAvailable
      ? candidatesCards
      : candidatesCards.slice(0, foilAvailable);
    this.finalCards = this.pickedCards.map((card) =>
      cardsToFoil.some((selected) => selected.id === card.id)
        ? { ...card, foil: true }
        : card,
    );
  }
}
