import { Component, signal } from '@angular/core';
import { SITE } from '../core/site.config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly site = SITE;
  readonly tel = SITE.tel.replace(/\s+/g, '');
  readonly menu = signal(false);
  toggle() { this.menu.update((v) => !v); }
  close() { this.menu.set(false); }
}
