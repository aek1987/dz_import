import { Component, ElementRef, input, output, viewChildren } from '@angular/core';

export interface SegmentOption<T extends string> { value: T; label: string; }

@Component({
  selector: 'app-segmented',
  template: `
    <div class="seg" role="radiogroup" [attr.aria-label]="label()">
      @for (o of options(); track o.value; let i = $index) {
        <button #btn type="button" role="radio"
          [attr.aria-checked]="o.value === value()"
          [attr.tabindex]="o.value === value() ? 0 : -1"
          [class.on]="o.value === value()"
          (click)="valueChange.emit(o.value)"
          (keydown)="onKey($event, i)">{{ o.label }}</button>
      }
    </div>
  `,
  styles: `
    .seg { display: flex; background: var(--paper); border-radius: 10px; padding: 4px; gap: 4px; }
    button { flex: 1; border: 0; background: transparent; padding: 10px 8px; border-radius: 7px; font: 600 14px var(--font); color: var(--mute); cursor: pointer; min-height: 44px; }
    button.on { background: #fff; color: var(--pine); box-shadow: 0 1px 3px rgba(14, 59, 46, 0.18); }
  `,
})
export class SegmentedComponent<T extends string = string> {
  label = input.required<string>();
  options = input.required<readonly SegmentOption<T>[]>();
  value = input.required<T>();
  valueChange = output<T>();
  private buttons = viewChildren<ElementRef<HTMLButtonElement>>('btn');

  /** Navigation clavier : flèches comme un vrai groupe radio. */
  onKey(e: KeyboardEvent, index: number) {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const opts = this.options();
    const next = (index + dir + opts.length) % opts.length;
    this.valueChange.emit(opts[next].value);
    this.buttons()[next]?.nativeElement.focus();
  }
}
