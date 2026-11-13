import { Component } from '@angular/core';
import { FAQ } from './content.data';

@Component({
  selector: 'app-faq',
  template: `
    <section id="faq">
      <h2>Questions fréquentes</h2>
      @for (item of faq; track item.q) {
        <details><summary>{{ item.q }}</summary><p>{{ item.a }}</p></details>
      }
    </section>
  `,
  styles: `
    section { margin-top: 56px; scroll-margin-top: 84px; }
    h2 { font-size: clamp(22px, 3.4vw, 30px); letter-spacing: -0.02em; color: var(--pine); margin: 0 0 18px; }
    details { background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 16px 20px; margin-bottom: 10px; }
    summary { cursor: pointer; font-weight: 700; font-size: 16px; list-style: none; display: flex; justify-content: space-between; }
    summary::after { content: '+'; color: var(--mute); font-weight: 500; }
    details[open] > summary::after { content: '−'; }
    p { margin: 10px 0 0; color: var(--mute); max-width: 70ch; }
  `,
})
export class FaqComponent {
  readonly faq = FAQ;
}
