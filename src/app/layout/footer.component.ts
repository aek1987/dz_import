import { Component } from '@angular/core';
import { SITE } from '../core/site.config';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="foot" id="contact">
      <b>{{ site.nom }}</b>
      <span>{{ site.tel }}</span>
      <span>{{ site.email }}</span>
      <a [href]="'https://wa.me/' + site.wa" target="_blank" rel="noopener">WhatsApp</a>
    </footer>
  `,
  styles: `
    .foot { max-width: var(--maxw); margin: 36px auto 0; padding: 22px 20px; border-top: 1px solid var(--line); display: flex; flex-wrap: wrap; gap: 8px 28px; color: var(--mute); font-size: 14px; scroll-margin-top: 84px; }
    .foot b { color: var(--ink); }
    .foot a { color: var(--pine); font-weight: 700; text-decoration: none; }
  `,
})
export class FooterComponent {
  readonly site = SITE;
}
