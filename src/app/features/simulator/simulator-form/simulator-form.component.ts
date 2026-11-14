import { Component, inject } from '@angular/core';
import { SimulatorStore } from '../simulator.store';
import { SegmentedComponent, SegmentOption } from '../../../shared/segmented.component';
import { NumberFieldComponent } from '../../../shared/number-field.component';
import { CURRENCIES } from '../../../core/tariff.data';
import { Currency, VehicleType } from '../../../core/models';

@Component({
  selector: 'app-simulator-form',
  imports: [SegmentedComponent, NumberFieldComponent],
  templateUrl: './simulator-form.component.html',
  styleUrl: './simulator-form.component.css',
})
export class SimulatorFormComponent {
  readonly store = inject(SimulatorStore);

  readonly types: readonly SegmentOption<VehicleType>[] = [
    { value: 'occ', label: 'Occasion < 3 ans' },
    { value: 'neuf', label: 'Neuf' },
  ];
  readonly currencies: readonly SegmentOption<Currency>[] = CURRENCIES.map((c) => ({ value: c, label: c }));

  onLine(e: Event) {
    const i = (e.target as HTMLSelectElement).selectedIndex;
    this.store.selectLine(this.store.tariff[i]);
  }
}
