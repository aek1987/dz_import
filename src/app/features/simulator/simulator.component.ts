import { Component, inject } from '@angular/core';
import { SimulatorStore } from './simulator.store';
import { SimulatorFormComponent } from './simulator-form/simulator-form.component';
import { SimulatorResultComponent } from './simulator-result/simulator-result.component';
import { DaPipe } from '../../shared/da.pipe';

@Component({
  selector: 'app-simulator',
  imports: [SimulatorFormComponent, SimulatorResultComponent, DaPipe],
  template: `
    <div class="grid" id="simulateur">
      <app-simulator-form />
      <app-simulator-result />
    </div>
    <div class="dock noprint" aria-hidden="true">
      <span>Total rendu</span><b>{{ store.result().total | da }} DA</b>
    </div>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: 1fr 440px; gap: 24px; align-items: start; scroll-margin-top: 84px; }
    app-simulator-result { position: sticky; top: 80px; }
    .dock { display: none; }
    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
      app-simulator-result { position: static; }
      .dock { display: flex; justify-content: space-between; align-items: center; position: fixed; left: 0; right: 0; bottom: 0; padding: 12px 20px calc(12px + env(safe-area-inset-bottom)); background: var(--pine); color: #fff; z-index: 5; }
      .dock b { font-size: 20px; }
    }
    @media print { .grid { grid-template-columns: 1fr; } app-simulator-result { position: static; } }
  `,
})
export class SimulatorComponent {
  readonly store = inject(SimulatorStore);
}
