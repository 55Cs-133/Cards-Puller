import React, { useEffect, useState } from 'react';
interface Card {
  id: string;
  rarity: 'mythic' | 'superRare' | 'rare' | 'uncommon' | 'common' | string;
  foil: boolean | null;
}

function Shop() {
  const [result, setResult] = useState<{ total: number; validDisplays: Card[] } | null>(null);
  const xTimes = 100000;
  useEffect(() => {
    // -----------------------------
    // 1) Création des workers
    // -----------------------------
    const nbWorkers = 24;
    let completed = 0;
    let totalValidDisplays = 0;
    const validDisplays: Card[] = [];
    const workers = Array.from({ length: nbWorkers }, () => {
      return new Worker(new URL('./heavyWorker.ts', import.meta.url), { type: 'module' });
    });
    // -----------------------------
    // 2) Gestion des messages de retour
    // -----------------------------
    workers.forEach((worker, index) => {
      worker.onmessage = (event) => {
        const { validCount, validDisplay } = event.data;
        totalValidDisplays += validCount;
        validDisplays.push(validDisplay);
        worker.terminate();
        completed++;

        if (completed === nbWorkers) {
          setResult({ total: totalValidDisplays, validDisplays });
        }
      };
      // -----------------------------
      // 3) On envoie "start" au worker pour déclencher le calcul
      // -----------------------------
      worker.postMessage({
        start: index * (xTimes / nbWorkers),
        end: (index + 1) * (xTimes / nbWorkers),
      });
    });
    // -----------------------------
    // 4) Nettoyage si le composant unmount
    // -----------------------------
    return () => {
      workers.forEach((w) => w.terminate());
    };
  }, []);

  console.table(result?.validDisplays);

  return (
    <div>
      <h1>Gestion de Cartes et Boosters</h1>
      {result
        ? (
            <div>
              <p>
                Correct :
                {result.total}
              </p>
            </div>
          )
        : (
            <p>Calcul en cours ...</p>
          )}
    </div>
  );
}

export default Shop;
