import { Component } from '@angular/core';
import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';
import { SimulatorComponent } from './features/simulator/simulator.component';
import { StepsComponent } from './features/content/steps.component';
import { FaqComponent } from './features/content/faq.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, FooterComponent, SimulatorComponent, StepsComponent, FaqComponent],
  template: `
    <app-header />
    <main class="wrap" id="haut">
      <section class="intro">
        <h1>Combien coûte l’importation de votre véhicule en Algérie&nbsp;?</h1>
        <p>Renseignez le prix d’achat : le coût total rendu, taxes comprises, se calcule en direct.</p>
      </section>
      <app-simulator />
      <app-steps />
      <app-faq />
    </main>
    <app-footer />
  `,
  styles: `
    :host { display: block; padding-bottom: 72px; }
    .wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 20px; }
    .intro { padding: 26px 0 24px; max-width: 700px; }
    h1 { font-size: clamp(28px, 4.6vw, 44px); line-height: 1.12; letter-spacing: -0.025em; margin: 0 0 12px; font-weight: 800; color: var(--pine); }
    .intro p { margin: 0; color: var(--mute); font-size: 17px; }
    @media print { :host { padding: 0; } }
  `,
})
export class AppComponent {}
