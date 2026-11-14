import { Currency, TariffLine } from './models';

/**
 * Taux indicatifs. À VÉRIFIER avec la loi de finances en vigueur
 * avant toute mise en production, puis mettre à jour `updatedAt` et `source`.
 */
export const TARIFF_META = {
  updatedAt: 'À renseigner',
  source: 'À compléter : loi de finances / circulaire de la Douane algérienne',
};

export const TARIFF: readonly TariffLine[] = [
  { code: '8703.21', label: 'Essence ≤ 1 000 cm³', dd: 15 },
  { code: '8703.22', label: 'Essence 1 000–1 500 cm³', dd: 15 },
  { code: '8703.23', label: 'Essence 1 500–3 000 cm³', dd: 30 },
  { code: '8703.24', label: 'Essence > 3 000 cm³', dd: 30 },
  { code: '8703.31', label: 'Diesel ≤ 1 500 cm³', dd: 15 },
  { code: '8703.32', label: 'Diesel 1 500–2 500 cm³', dd: 30 },
  { code: '8703.33', label: 'Diesel > 2 500 cm³', dd: 30 },
  { code: '8703.40/50', label: 'Hybride non rechargeable', dd: 30 },
  { code: '8703.60/70', label: 'Hybride rechargeable', dd: 30 },
  { code: '8703.80', label: 'Électrique', dd: 15 },
  { code: '8704.21/31', label: 'Utilitaire ≤ 5 t', dd: 30 },
];

export const DEFAULT_TARIFF_INDEX = 2;

export const DEFAULT_RATES = { tcs: 2, tva: 19, tic: 0, red: 0 } as const;

/** Taux de change par défaut (DA pour 1 unité). À ajuster selon le marché. */
export const DEFAULT_FX: Record<Currency, number> = { EUR: 150, USD: 135 };

export const CURRENCIES: readonly Currency[] = ['EUR', 'USD'];
