export type VehicleType = 'occ' | 'neuf';
export type Currency = 'EUR' | 'USD' ;

export interface TariffLine {
  code: string;
  label: string;
  /** Droit de douane en % */
  dd: number;
}

export interface SimulationInput {
  /** Identification du véhicule (n'influence pas le calcul) */
  marque: string;
  modele: string;

  
  fob: number;
  fret: number;
  /** Assurance en % du FOB */
  ass: number;
  /** Taux de change : DA pour 1 unité de devise */
  fx: number;
  dd: number;
  tcs: number;
  tva: number;
  tic: number;
  red: number;
  /** Frais annexes en DA */
  frais: number;
}

export interface SimulationResult {
  fob: number;
  fret: number;
  ass: number;
  cif: number;
  dd: number;
  tcs: number;
  tic: number;
  red: number;
  baseTva: number;
  tva: number;
  taxes: number;
  frais: number;
  total: number;
}
