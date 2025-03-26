interface Card {
  id: string;
  rarity: 'mythic' | 'superRare' | 'rare' | 'uncommon' | 'common' | string;
  foil: boolean | null;
}
import { shuffle, pull } from 'lodash-es';

import data from '../ressources/cartesAnarax.json';

const repartition: Record<'mythic' | 'superRare' | 'rare' | 'uncommon' | 'common', number> = {
  mythic: 25,
  superRare: 50,
  rare: 75,
  uncommon: 150,
  common: 300,
};

const mythic: Card[] = (data.filter((card) => card.rarity === 'mythic'));
const superRare: Card[] = (data.filter((card) => card.rarity === 'superRare'));
const rare: Card[] = (data.filter((card) => card.rarity === 'rare'));
const uncommon: Card[] = (data.filter((card) => card.rarity === 'uncommon'));
const common: Card[] = (data.filter((card) => card.rarity === 'common'));

const nonLegalRarity: Card[] = data.filter(
  (card) =>
    card.rarity !== 'mythic'
    && card.rarity !== 'superRare'
    && card.rarity !== 'rare'
    && card.rarity !== 'uncommon'
    && card.rarity !== 'common',
);

const numbersOfCards = {
  mythic: mythic.length,
  superRare: superRare.length,
  rare: rare.length,
  uncommon: uncommon.length,
  common: common.length,
};

const erreurs: string[] = [];
Object.entries(numbersOfCards).forEach(([rarity, numberOfCards]) => {
  const key = rarity as keyof typeof repartition;
  if (numberOfCards !== repartition[key]) {
    erreurs.push(`${rarity} (${numberOfCards} au lieu de ${repartition[key]})`);
  }
});

if (erreurs.length > 0) {
  throw new Error(`Erreur dans la répartition des cartes: ${erreurs.join(', ')}`);
}

if (nonLegalRarity.length !== 0) {
  console.table(nonLegalRarity);
  throw console.error('Carte(s) incorrect(s)!');
}

export class Display {
  public boosterNumber: number = 50;
  public isValid: boolean;
  private mythic: Card[];
  private superRare: Card[];
  private rare: Card[];
  private uncommon: Card[];
  private common: Card[];

  public display: Array<Array<Card | undefined>>;

  constructor() {
    this.mythic = shuffle([...mythic]);
    this.superRare = shuffle([...superRare]);
    this.rare = shuffle([...rare]);
    this.uncommon = shuffle([...uncommon]);
    this.common = shuffle([...common]);

    this.display = this.crackDisplay();
    this.isValid = this.validate(this.display);
  }

  private crackDisplay(): Array<Array<Card | undefined>> {
    const display: Array<Array<Card | undefined>> = [];

    for (let i = 0; i < this.boosterNumber / 2; i++) {
      display.push(this.booster1());
    }

    for (let i = 0; i < this.boosterNumber / 2; i++) {
      display.push(this.booster2());
    }

    return display;
  }

  private booster1(): Array<Card | undefined> {
    const boosterPart1 = [];
    const twelfth = this.mythic.shift();
    const eleventh = this.superRare.shift();
    const tenth = this.rare.shift();
    const ninth = this.uncommon.shift();
    const [eighth] = pull(this.uncommon, this.uncommon.find((card) => card.id === ninth?.id));
    const [seventh] = pull(this.uncommon, this.uncommon.find((card) => card.id === eighth?.id));
    const sixth = this.common.shift();
    const [fifth] = pull(this.common, this.common.find((card) => card.id === sixth?.id));
    const [fourth] = pull(this.common, this.common.find((card) => card.id === fifth?.id));
    const [third] = pull(this.common, this.common.find((card) => card.id === fourth?.id));
    const [second] = pull(this.common, this.common.find((card) => card.id === third?.id));
    const [first] = pull(this.common, this.common.find((card) => card.id === second?.id));
    boosterPart1.push(twelfth, eleventh, tenth, ninth, eighth, seventh, sixth, fifth, fourth, third, second, first);
    return boosterPart1;
  }

  private booster2(): Array<Card | undefined> {
    const boosterPart2 = [];
    const twelfth = this.superRare.shift();
    const eleventh = this.rare.shift();
    const [tenth] = pull(this.rare, this.rare.find((card) => card.id === eleventh?.id));
    const ninth = this.uncommon.shift();
    const [eighth] = pull(this.uncommon, this.uncommon.find((card) => card.id === ninth?.id));
    const [seventh] = pull(this.uncommon, this.uncommon.find((card) => card.id === eighth?.id));
    const sixth = this.common.shift();
    const [fifth] = pull(this.common, this.common.find((card) => card.id === sixth?.id));
    const [fourth] = pull(this.common, this.common.find((card) => card.id === fifth?.id));
    const [third] = pull(this.common, this.common.find((card) => card.id === fourth?.id));
    const [second] = pull(this.common, this.common.find((card) => card.id === third?.id));
    const [first] = pull(this.common, this.common.find((card) => card.id === second?.id));
    boosterPart2.push(twelfth, eleventh, tenth, ninth, eighth, seventh, sixth, fifth, fourth, third, second, first);
    return boosterPart2;
  }

  private validate(display: Array<Array<Card | undefined>>): boolean {
    const x = this.noTwinRule(display);
    const y = this.foilRule(display);
    return x === true && y === true;
  }

  // private validate(display: Array<Array<Card | undefined>>): boolean {
  //   const x = this.noTwinRule(display);
  //   // const y = this.foilRule(display);
  //   return x;
  // }

  private noTwinRule(display: Array<Array<Card | undefined>>): boolean {
    return display.every((booster) => {
      const validCards = booster.filter((card): card is Card => card !== undefined);
      const baseIds = validCards.map((card) =>
        card.id.includes('-') ? card.id.split('-')[0] : card.id,
      );
      const uniqueBaseIds = new Set(baseIds);
      return uniqueBaseIds.size === baseIds.length;
    });
  }

  private foilRule(display: any[]) {
    const foil: boolean[] = [];

    display.forEach((booster) => {
      const foilPerBooster = booster.filter((card: { foil: boolean }) => card && card.foil === true).length;
      foil.push(foilPerBooster <= 4);
    });

    return foil.every((bool) => bool === true);
  }
}
