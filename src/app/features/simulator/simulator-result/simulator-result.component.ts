import { Component, computed, inject } from '@angular/core';
import { SimulatorStore } from '../simulator.store';
import { DaPipe } from '../../../shared/da.pipe';
import { SITE } from '../../../core/site.config';
import { TARIFF_META } from '../../../core/default.data';

@Component({
  selector: 'app-simulator-result',
  imports: [DaPipe],
  templateUrl: './simulator-result.component.html',
  styleUrl: './simulator-result.component.css',
})
export class SimulatorResultComponent {
  readonly store = inject(SimulatorStore);
  readonly meta = TARIFF_META;

  readonly whatsappUrl = computed(() => {
    const r = this.store.result();
    const da = new DaPipe();
    const text =
      `${SITE.nom} – Simulation\n${this.store.line().label} (${this.store.type() === 'occ' ? 'occasion' : 'neuf'})\n` +
      `CIF : ${da.transform(r.cif)} DA\nDroits et taxes : ${da.transform(r.taxes)} DA\nTotal rendu : ${da.transform(r.total)} DA`;
    return `https://wa.me/${SITE.wa}?text=${encodeURIComponent(text)}`;
  });

  print() { window.print(); }
}
