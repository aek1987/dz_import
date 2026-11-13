import { SimulationInput } from '../../core/models';
import { calculate } from './customs.calculator';

describe('calculate', () => {
  const base: SimulationInput = {
    fob: 10000, fret: 800, assPct: 0.5, fx: 150,
    dd: 30, tcs: 2, tva: 19, tic: 0, red: 0, frais: 60000,
  };

  it('calcule la valeur CIF (FOB + fret + assurance)', () => {
    // 1 500 000 + 120 000 + 7 500
    expect(calculate(base).cif).toBeCloseTo(1_627_500, 2);
  });

  it('applique DD et TCS sur la valeur CIF', () => {
    const r = calculate(base);
    expect(r.dd).toBeCloseTo(488_250, 2);
    expect(r.tcs).toBeCloseTo(32_550, 2);
  });

  it('applique la TVA sur CIF + DD + TCS + TIC', () => {
    const r = calculate(base);
    expect(r.baseTva).toBeCloseTo(2_148_300, 2);
    expect(r.tva).toBeCloseTo(408_177, 2);
  });

  it('total = CIF + taxes + frais annexes', () => {
    const r = calculate(base);
    expect(r.taxes).toBeCloseTo(928_977, 2);
    expect(r.total).toBeCloseTo(2_616_477, 2);
  });

  it('inclut TIC et redevance dans les taxes', () => {
    const r = calculate({ ...base, tic: 10, red: 1 });
    expect(r.tic).toBeCloseTo(162_750, 2);
    expect(r.red).toBeCloseTo(16_275, 2);
    expect(r.baseTva).toBeCloseTo(r.cif + r.dd + r.tcs + r.tic, 2);
    expect(r.taxes).toBeCloseTo(r.dd + r.tcs + r.tic + r.red + r.tva, 2);
  });

  it('retourne 0 partout quand tout est à zéro', () => {
    const z = calculate({ ...base, fob: 0, fret: 0, frais: 0 });
    expect(z.total).toBe(0);
    expect(z.taxes).toBe(0);
  });
});
