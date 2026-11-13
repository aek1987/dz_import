import { TestBed } from '@angular/core/testing';
import { SimulatorStore } from './simulator.store';

describe('SimulatorStore', () => {
  let store: SimulatorStore;
  beforeEach(() => { store = TestBed.inject(SimulatorStore); store.reset(); });

  it('met à jour le droit de douane quand on change de motorisation', () => {
    store.selectLine(store.tariff[0]);
    expect(store.form().dd).toBe(15);
  });

  it('ignore le taux de change en DZD', () => {
    store.setCurrency('DZD');
    expect(store.result().fob).toBe(store.form().fob);
  });

  it('recalcule le total quand le prix change', () => {
    const before = store.result().total;
    store.patch({ fob: 20000 });
    expect(store.result().total).toBeGreaterThan(before);
  });

  it('réinitialise les valeurs par défaut', () => {
    store.patch({ fob: 1 });
    store.reset();
    expect(store.form().fob).toBe(10000);
  });
});
