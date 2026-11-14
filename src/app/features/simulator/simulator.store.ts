import { Injectable, computed, signal } from '@angular/core';
import { Currency, SimulationInput, TariffLine, VehicleType } from '../../core/models';
import { DEFAULT_FRET, DEFAULT_FX, DEFAULT_RATES, DEFAULT_TARIFF_INDEX, TARIFF } from '../../core/default.data';
import { CATALOGUE, MARQUES } from '../../core/vehicles.data'; // AJOUT
import { calculate } from './customs.calculator';

@Injectable({ providedIn: 'root' })
export class SimulatorStore {
  readonly tariff = TARIFF;

  readonly type = signal<VehicleType>('occ');
  readonly currency = signal<Currency>('EUR');
  readonly line = signal<TariffLine>(TARIFF[DEFAULT_TARIFF_INDEX]);
  readonly form = signal<SimulationInput>(this.defaults(TARIFF[DEFAULT_TARIFF_INDEX]));

  // AJOUT : liste des marques et modèles de la marque choisie
  readonly marques = MARQUES;
  readonly modeles = computed(() => CATALOGUE[this.form().marque] ?? []);

  readonly result = computed(() => calculate(this.form()));

  readonly taxShare = computed(() => {
    const r = this.result();
    return r.cif ? ((r.taxes / r.cif) * 100).toFixed(1).replace('.', ',') : '0';
  });

  readonly parts = computed(() => {
    const r = this.result();
    return [
      { k: 'Valeur CIF', v: r.cif, c: 'var(--c-cif)' },
      { k: 'Droit de douane', v: r.dd, c: 'var(--c-dd)' },
      { k: 'TCS, TIC, redevance', v: r.tcs + r.tic + r.red, c: 'var(--c-tcs)' },
      { k: 'TVA', v: r.tva, c: 'var(--c-tva)' },
      { k: 'Frais annexes', v: r.frais, c: 'var(--c-frais)' },
    ];
  });

  readonly shares = computed(() => {
    const t = this.result().total;
    return this.parts().map((p) => (t ? (Math.max(p.v, 0) / t) * 100 : 0));
  });

  patch(p: Partial<SimulationInput>) {
    this.form.update((f) => ({ ...f, ...p }));
  }

  // AJOUT : changer la marque remet le modèle à zéro
  setMarque(marque: string) {
    this.patch({ marque, modele: '' });
  }

  selectLine(l: TariffLine) {
    this.line.set(l);
    this.patch({ dd: l.dd });
  }
setCurrency(c: Currency) {
  this.currency.set(c);
  this.patch({ fx: DEFAULT_FX[c], fret: DEFAULT_FRET[c] });
}

  reset() {
    const l = TARIFF[DEFAULT_TARIFF_INDEX];
    this.type.set('occ');
    this.currency.set('EUR');
    this.line.set(l);
    this.form.set(this.defaults(l));
  }

  private defaults(l: TariffLine): SimulationInput {
    return {
      marque: '', // AJOUT
      modele: '', // AJOUT
      fob: 10000,
      fret: 800,
      // après
      ass: 7500,
      fx: DEFAULT_FX.EUR,
      dd: l.dd,
      ...DEFAULT_RATES,
      frais: 60000,
    };
  }
}