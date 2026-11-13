import { Injectable } from '@angular/core';

export interface SousPosition { code: string; label: string; dd: number; }
export interface Input { fob: number; fret: number; assPct: number; fx: number; dd: number; tcs: number; tva: number; tic: number; red: number; frais: number; }
export interface Result { fob: number; fret: number; ass: number; cif: number; dd: number; tcs: number; tic: number; red: number; baseTva: number; tva: number; taxes: number; frais: number; total: number; }

@Injectable({ providedIn: 'root' })
export class CustomsService {
  // Taux DD indicatifs : à confirmer auprès de la Douane algérienne
  readonly sousPositions: SousPosition[] = [
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

  calculate(i: Input): Result {
    const fob = i.fob * i.fx, fret = i.fret * i.fx, ass = fob * i.assPct / 100;
    const cif = fob + fret + ass;
    const dd = cif * i.dd / 100, tcs = cif * i.tcs / 100, tic = cif * i.tic / 100, red = cif * i.red / 100;
    const baseTva = cif + dd + tcs + tic;
    const tva = baseTva * i.tva / 100;
    const taxes = dd + tcs + tic + red + tva;
    return { fob, fret, ass, cif, dd, tcs, tic, red, baseTva, tva, taxes, frais: i.frais, total: cif + taxes + i.frais };
  }
}
