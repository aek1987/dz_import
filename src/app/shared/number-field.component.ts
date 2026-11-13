import { Component, input, output } from '@angular/core';

/** Champ numérique avec libellé et unité. Émet 0 si le champ est vidé. */
@Component({
  selector: 'app-number-field',
  template: `
    <label [attr.for]="id()">{{ label() }}</label>
    <div class="inp">
      <input [id]="id()" type="number" inputmode="decimal" min="0" [step]="step()"
        [value]="value()" (input)="onInput($event)">
      <span>{{ unit() }}</span>
    </div>
  `,
  styles: `
    :host { display: block; }
    label { display: block; font-weight: 600; font-size: 14px; margin: 16px 0 6px; }
    .inp { display: flex; align-items: center; overflow: hidden; width: 100%; border: 1px solid #c5ccc7; border-radius: 10px; background: #fff; min-height: 48px; }
    .inp:focus-within { border-color: var(--pine2); box-shadow: 0 0 0 3px rgba(27, 90, 69, 0.18); }
    input { flex: 1; min-width: 0; border: 0; outline: 0; padding: 0 12px; font: 600 16px var(--font); color: var(--ink); background: transparent; height: 46px; }
    span { padding: 0 12px; color: var(--mute); font-size: 13px; white-space: nowrap; background: var(--paper); align-self: stretch; display: flex; align-items: center; border-left: 1px solid var(--line); }
  `,
})
export class NumberFieldComponent {
  id = input.required<string>();
  label = input.required<string>();
  unit = input.required<string>();
  value = input.required<number>();
  step = input<number | string>('any');
  valueChange = output<number>();

  onInput(e: Event) {
    const n = (e.target as HTMLInputElement).valueAsNumber;
    this.valueChange.emit(Number.isFinite(n) && n >= 0 ? n : 0);
  }
}
