import { times } from 'lodash-es';

// import Booster from './Booster.ts';
import { Display } from './Display.ts';

function Shop() {
  console.time('shop');
  const shop = times(100000000, () => {
    const x = new Display();
    if (!x.isValid) {
      return false;
    }
    if (x.isValid) {
      return x;
    }
  });
  console.timeEnd('shop');

  // const x = new Booster();
  // const shop = new Display();
  const shopContainTrue = shop.filter((display) => display.isValid === true);
  const hourra = shop.filter((element) => element !== false);
  console.table(hourra);
  console.log(hourra.length);

  return (
    <h1>Gestion de Cartes et Boosters</h1>
  );
}

export default Shop;
