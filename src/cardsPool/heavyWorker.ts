import { times } from 'lodash-es';

import { Display } from './Display.ts';

// --------------------------------------------------------
// Gestion du message reçu depuis Shop.tsx
// --------------------------------------------------------
self.onmessage = (event) => {
  const { start, end } = event.data;
  console.time('shop');
  const rangeSize = end - start;
  const shop = times(rangeSize, () => {
    const x = new Display();
    return x.isValid ? x : false;
  });

  console.timeEnd('shop');
  const valides = shop.filter((element) => element !== false);

  self.postMessage({
    validCount: valides.length,
    validDisplay: valides,
  });
};
