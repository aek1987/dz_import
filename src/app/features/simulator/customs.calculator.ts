import { SimulationInput, SimulationResult } from '../../core/models';

/**
 * Calcul du coût d'importation. Fonction pure : aucune dépendance Angular,
 * facile à tester. Tous les montants de sortie sont en DA.
 *
 * Valeur CIF = FOB + fret + assurance (assurance = % du FOB)
 * Base TVA   = CIF + DD + TCS + TIC
 */
export function calculate(i: SimulationInput): SimulationResult {
  const fob = i.fob * i.fx;
  const fret = i.fret * i.fx;

const ass = i.ass; 
  const cif = fob + fret + ass;

  const dd = (cif * i.dd) / 100;
  const tcs = (cif * i.tcs) / 100;
  const tic = (cif * i.tic) / 100;
  const red = (cif * i.red) / 100;

  const baseTva = cif + dd + tcs + tic;
  const tva = (baseTva * i.tva) / 100;
  const taxes = dd + tcs + tic + red + tva;

  return { fob, fret, ass, cif, dd, tcs, tic, red, baseTva, tva, taxes, frais: i.frais, total: cif + taxes + i.frais };
}
