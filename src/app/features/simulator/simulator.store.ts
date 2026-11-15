import { Injectable, computed, signal } from '@angular/core';
import { Currency, SimulationInput, TariffLine, VehicleType } from '../../core/models';
import {
  DEFAULT_FRET,
  DEFAULT_FX,
  DEFAULT_RATES,
  DEFAULT_TARIFF_INDEX,
  TARIFF,
} from '../../core/default.data';
import {
  AGE_INDEX,
  AgeKey,
  MARQUES,
  RefValue,
  modelesOf,
  versionsOf,
} from '../../core/vehicles';
import { calculate } from './customs.calculator';

@Injectable({ providedIn: 'root' })
export class SimulatorStore {
  readonly tariff = TARIFF;

  readonly type = signal<VehicleType>('occ');
  readonly currency = signal<Currency>('EUR');
  readonly line = signal<TariffLine>(TARIFF[DEFAULT_TARIFF_INDEX]);
  readonly form = signal<SimulationInput>(this.defaults(TARIFF[DEFAULT_TARIFF_INDEX]));

  // Âge du véhicule (colonne de prix de référence) et version choisie
  readonly age = signal<AgeKey>('u1');
  readonly version = signal<RefValue | null>(null);

  // Listes en cascade : marque → modèle → version
  readonly marques = MARQUES;
  readonly modeles = computed(() => modelesOf(this.form().marque));
  readonly versions = computed(() => versionsOf(this.form().marque, this.form().modele));

  /** true si la version choisie n'a pas de prix pour l'âge sélectionné */
  readonly refUnavailable = computed(() => {
    const v = this.version();
    return !!v && v.fob[AGE_INDEX[this.age()]] == null;
  });

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

  // ── Véhicule ─────────────────────────────────────────

  setMarque(marque: string) {
    this.version.set(null);
    this.patch({ marque, modele: '' });
  }

  setModele(modele: string) {
    this.patch({ modele });
    const v = this.versions();
    // une seule version possible : on la sélectionne directement
    this.version.set(v.length === 1 ? v[0] : null);
    this.applyRef();
  }

  /** Choix d'une version, identifiée par son n° dans le document de la Douane */
  selectVersion(n: number) {
    this.version.set(this.versions().find((v) => v.n === n) ?? null);
    this.applyRef();
  }

  /** « Neuf » ou « Occasion » : l'occasion démarre sur la colonne « moins d'un an » */
  setType(t: VehicleType) {
    this.type.set(t);
    this.setAge(t === 'neuf' ? 'neuf' : 'u1');
  }

  setAge(a: AgeKey) {
    this.age.set(a);
    this.applyRef();
  }

  /** Remplit le FOB (et la devise du document) selon la version et l'âge choisis */
  private applyRef() {
    const v = this.version();
    if (!v) return;
    const fob = v.fob[AGE_INDEX[this.age()]];
    if (fob == null) return;

    if (this.currency() !== v.devise) {
      this.currency.set(v.devise);
      this.patch({ fx: DEFAULT_FX[v.devise], fret: DEFAULT_FRET[v.devise] });
    }
    this.patch({ fob });
  }

  // ── Tarif, devise, réinitialisation ──────────────────

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
    this.age.set('u1');
    this.version.set(null);
    this.currency.set('EUR');
    this.line.set(l);
    this.form.set(this.defaults(l));
  }

  private defaults(l: TariffLine): SimulationInput {
    return {
      marque: '',
      modele: '',
      fob: 10000,
      fret: DEFAULT_FRET.EUR,
      ass: 7500, // assurance en DA
      fx: DEFAULT_FX.EUR,
      dd: l.dd,
      ...DEFAULT_RATES,
      frais: 60000,
    };
  }
}