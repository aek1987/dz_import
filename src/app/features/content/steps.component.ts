import { Component } from '@angular/core';
import { STEPS } from './content.data';

@Component({
  selector: 'app-steps',
  template: `
    <section id="etapes">
      <h2>Importer en 4 étapes</h2>
      <ol class="steps">
        @for (s of steps; track s.title) {
          <li><b>{{ s.title }}</b><span>{{ s.text }}</span></li>
        }
      </ol>
    </section>
  `,
  styles: `
    section { margin-top: 56px; scroll-margin-top: 84px; }
    h2 { font-size: clamp(22px, 3.4vw, 30px); letter-spacing: -0.02em; color: var(--pine); margin: 0 0 18px; }
    .steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; counter-reset: s; }
    li { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 20px; display: flex; flex-direction: column; gap: 6px; counter-increment: s; }
    li::before { content: counter(s); display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: var(--pine); color: #fff; font-weight: 800; font-size: 14px; margin-bottom: 6px; }
    span { color: var(--mute); font-size: 14px; }
    @media (max-width: 900px) { .steps { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 520px) { .steps { grid-template-columns: 1fr; } }
  `,
})
export class StepsComponent {
  readonly steps = STEPS;
}
