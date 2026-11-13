import { Pipe, PipeTransform } from '@angular/core';

const nf = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

@Pipe({ name: 'da' })
export class DaPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return nf.format(Number.isFinite(value) ? (value as number) : 0);
  }
}
