import cards from '../ressources/cartes.json';
import rate from '../ressources/taux.json';

export const cardsCatalog = Object.values(cards);
export const rarityRate = rate;

type RarityRates = Record<string, number>;

export function pickRarity(rates: RarityRates) {
  const rarityEntries = Object.entries(rates);

  const rateSum = rarityEntries.reduce((sum, [, rate]) => sum + rate, 0);

  let random = Math.floor(Math.random() * rateSum);

  const selectedRarity = rarityEntries.reduce((acc, [rarity, rate]) => {
    if (acc) return acc;
    random -= rate;
    return random < 0 ? rarity : null;
  }, null as string | null);

  if (!selectedRarity) {
    throw new Error('Aucune rareté sélectionnée - vérifiez le fichier taux.json! Les valeurs numériques doivent être supérieur à 0');
  }

  if (selectedRarity === 'ultra-légendaire') {
    console.log('yayks');
  }

  return selectedRarity;
};
