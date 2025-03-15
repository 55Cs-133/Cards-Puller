import './App.css';

import { times } from 'lodash-es';

import Booster from './booster/Booster';
import { pickRarity } from './booster/engine';
import { rarityRate } from './booster/engine';
import newBooster from './booster/newBooster';
import { foil, rarityRates, fixedCards } from './booster/newBooster';

console.log('Foil:', foil);
console.log('Rarity Rates:', rarityRates);
console.log('Fixed Cards:', fixedCards);

const x = new Booster();
x.logPickedCardsWithoutFoil();

function App() {
  return (
    <>
    </>
  );
}

export default App;
