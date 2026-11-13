import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomsService, Input, Result, SousPosition } from './customs.service';
import { CONTACT } from './config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  template: `
  <header class="nav-h noprint">
    <div class="nav-in">
      <a class="brand" href="#haut" (click)="menu=false"><span class="mark">DZ</span><b>DZ Import</b></a>
      <button class="burger" type="button" (click)="menu=!menu" [attr.aria-expanded]="menu" aria-controls="nav" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
      <nav id="nav" [class.show]="menu">
        <a href="#simulateur" (click)="menu=false">Simulateur</a>
        <a href="#etapes" (click)="menu=false">Étapes</a>
        <a href="#faq" (click)="menu=false">Questions</a>
        <a href="#contact" (click)="menu=false">Contact</a>
        <a class="cta" [href]="'tel:' + contact.tel.replace(' ', '')">Appeler</a>
      </nav>
    </div>
  </header>

  <main class="wrap" id="haut">
    <section class="intro">
      <h1>Combien coûte l’importation de votre véhicule en Algérie&nbsp;?</h1>
      <p>Renseignez le prix d’achat : le coût total rendu, taxes comprises, se calcule en direct.</p>
    </section>

    <div class="grid" id="simulateur">
      <form class="col" (submit)="$event.preventDefault()">
        <fieldset class="card">
          <legend>1. Véhicule</legend>
          <div class="seg" role="radiogroup" aria-label="État du véhicule">
            <button type="button" role="radio" [attr.aria-checked]="type==='occ'" [class.on]="type==='occ'" (click)="type='occ'">Occasion &lt; 3 ans</button>
            <button type="button" role="radio" [attr.aria-checked]="type==='neuf'" [class.on]="type==='neuf'" (click)="type='neuf'">Neuf</button>
          </div>
          <label for="sp">Motorisation et cylindrée</label>
          <select id="sp" [ngModel]="sp" name="sp" (ngModelChange)="onSp($event)">
            @for (s of svc.sousPositions; track s.code) { <option [ngValue]="s">{{ s.label }} (SH {{ s.code }})</option> }
          </select>
          <p class="hint">Droit de douane appliqué : {{ f.dd }} %</p>
        </fieldset>

        <fieldset class="card">
          <legend>2. Prix et transport</legend>
          <div class="seg" role="radiogroup" aria-label="Devise">
            @for (c of ['EUR','USD','DZD']; track c) {
              <button type="button" role="radio" [attr.aria-checked]="cur===c" [class.on]="cur===c" (click)="onCur(c)">{{ c }}</button>
            }
          </div>
          <label for="fob">Prix d’achat du véhicule (FOB)</label>
          <div class="inp"><input id="fob" name="fob" type="number" inputmode="decimal" min="0" [(ngModel)]="f.fob"><span>{{ cur }}</span></div>
          <div class="two">
            <div><label for="fret">Fret maritime</label>
              <div class="inp"><input id="fret" name="fret" type="number" inputmode="decimal" min="0" [(ngModel)]="f.fret"><span>{{ cur }}</span></div></div>
            <div><label for="ass">Assurance</label>
              <div class="inp"><input id="ass" name="ass" type="number" inputmode="decimal" min="0" step="0.01" [(ngModel)]="f.assPct"><span>% FOB</span></div></div>
          </div>
          @if (cur !== 'DZD') {
            <label for="fx">Taux de change</label>
            <div class="inp"><input id="fx" name="fx" type="number" inputmode="decimal" min="0" step="0.01" [(ngModel)]="f.fx"><span>DA pour 1 {{ cur }}</span></div>
          }
          <label for="frais">Port, transitaire, homologation</label>
          <div class="inp"><input id="frais" name="frais" type="number" inputmode="decimal" min="0" [(ngModel)]="f.frais"><span>DA</span></div>
        </fieldset>

        <details class="card adv">
          <summary>3. Taux de taxes (modifiables)</summary>
          <div class="two">
            <div><label for="dd">Droit de douane</label><div class="inp"><input id="dd" name="dd" type="number" min="0" step="0.01" [(ngModel)]="f.dd"><span>%</span></div></div>
            <div><label for="tcs">TCS</label><div class="inp"><input id="tcs" name="tcs" type="number" min="0" step="0.01" [(ngModel)]="f.tcs"><span>%</span></div></div>
            <div><label for="tva">TVA</label><div class="inp"><input id="tva" name="tva" type="number" min="0" step="0.01" [(ngModel)]="f.tva"><span>%</span></div></div>
            <div><label for="tic">Taxe additionnelle (TIC)</label><div class="inp"><input id="tic" name="tic" type="number" min="0" step="0.01" [(ngModel)]="f.tic"><span>%</span></div></div>
            <div><label for="red">Redevance douanière</label><div class="inp"><input id="red" name="red" type="number" min="0" step="0.01" [(ngModel)]="f.red"><span>%</span></div></div>
          </div>
        </details>
      </form>

      <aside class="col result" aria-live="polite">
        <div class="card sum">
          <p class="lab">Coût total rendu, {{ type === 'occ' ? 'occasion < 3 ans' : 'neuf' }}</p>
          <p class="total">{{ n(r.total) }} <small>DA</small></p>
          <p class="sub">Dont {{ n(r.taxes) }} DA de droits et taxes, soit {{ pct(r.taxes, r.cif) }} % de la valeur CIF.</p>

          <div class="bar" role="img" [attr.aria-label]="'Répartition du coût total'">
            @for (s of parts; track s.k) { <i [style.width.%]="share(s.v)" [style.background]="s.c"></i> }
          </div>
          <ul class="leg">
            @for (s of parts; track s.k) { <li><i [style.background]="s.c"></i>{{ s.k }}<b>{{ n(s.v) }} DA</b></li> }
          </ul>
        </div>

        <details class="card det">
          <summary>Voir le détail du calcul</summary>
          <table>
            <tr><td>Prix FOB</td><td>{{ n(r.fob) }}</td></tr>
            <tr><td>Fret</td><td>{{ n(r.fret) }}</td></tr>
            <tr><td>Assurance</td><td>{{ n(r.ass) }}</td></tr>
            <tr class="b"><td>Valeur CIF</td><td>{{ n(r.cif) }}</td></tr>
            <tr><td>Droit de douane ({{ f.dd }} %)</td><td>{{ n(r.dd) }}</td></tr>
            <tr><td>TCS ({{ f.tcs }} %)</td><td>{{ n(r.tcs) }}</td></tr>
            @if (f.tic) { <tr><td>TIC ({{ f.tic }} %)</td><td>{{ n(r.tic) }}</td></tr> }
            @if (f.red) { <tr><td>Redevance ({{ f.red }} %)</td><td>{{ n(r.red) }}</td></tr> }
            <tr><td>TVA ({{ f.tva }} % sur {{ n(r.baseTva) }})</td><td>{{ n(r.tva) }}</td></tr>
            <tr class="b"><td>Total droits et taxes</td><td>{{ n(r.taxes) }}</td></tr>
            <tr><td>Frais annexes</td><td>{{ n(r.frais) }}</td></tr>
            <tr class="b t"><td>Total (DA)</td><td>{{ n(r.total) }}</td></tr>
          </table>
        </details>

        <div class="acts noprint">
          <button class="pri" type="button" (click)="print()">Imprimer ou enregistrer en PDF</button>
          <a class="sec" [href]="wa" target="_blank" rel="noopener">Envoyer sur WhatsApp</a>
          <button class="lnk" type="button" (click)="reset()">Réinitialiser</button>
        </div>
        <p class="warn">Simulation indicative. Les taux varient selon la cylindrée, la motorisation, l’origine et la loi de finances. Confirmez-les auprès de la Douane ou d’un transitaire.</p>
      </aside>
    </div>
    <section class="sec2" id="etapes">
      <h2>Importer en 4 étapes</h2>
      <ol class="steps">
        <li><b>Choisir le véhicule</b><span>Neuf ou occasion de moins de 3 ans, selon la réglementation en vigueur.</span></li>
        <li><b>Estimer le coût</b><span>Utilisez le simulateur pour connaître le budget total, taxes comprises.</span></li>
        <li><b>Réunir les documents</b><span>Facture d’achat, titre de propriété et connaissement du transport.</span></li>
        <li><b>Dédouaner</b><span>Confiez les formalités à un transitaire, puis procédez à l’immatriculation.</span></li>
      </ol>
    </section>

    <section class="sec2" id="faq">
      <h2>Questions fréquentes</h2>
      <details><summary>Qu’est-ce que la valeur CIF ?</summary><p>C’est le prix du véhicule (FOB) plus le fret et l’assurance. Les droits de douane et les taxes se calculent à partir de cette valeur.</p></details>
      <details><summary>Les taux utilisés sont-ils officiels ?</summary><p>Non, ils sont indicatifs. Ils changent selon la cylindrée, la motorisation, l’origine et la loi de finances. Vous pouvez les modifier dans le simulateur.</p></details>
      <details><summary>Quel taux de change choisir ?</summary><p>Utilisez le taux appliqué par votre banque ou votre transitaire le jour du paiement, car il influence directement le total.</p></details>
    </section>
  </main>

  <footer class="foot" id="contact"><b>{{ contact.nom }}</b><span>{{ contact.tel }}</span><span>{{ contact.email }}</span><a [href]="wa" target="_blank" rel="noopener">WhatsApp</a></footer>

  <div class="dock noprint"><span>Total rendu</span><b>{{ n(r.total) }} DA</b></div>`,
  styles: [`
  :host{display:block;padding-bottom:72px}
  .wrap{max-width:1120px;margin:0 auto;padding:0 20px}
  .intro{padding:26px 0 24px;max-width:700px}
  h1{font-size:clamp(28px,4.6vw,44px);line-height:1.12;letter-spacing:-.025em;margin:0 0 12px;font-weight:800;color:var(--pine)}
  .intro p{margin:0;color:var(--mute);font-size:17px}
  .grid{display:grid;grid-template-columns:1fr 440px;gap:24px;align-items:start}
  .col{display:flex;flex-direction:column;gap:16px;min-width:0;border:0;padding:0;margin:0}
  .result{position:sticky;top:16px}
  .card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:22px;margin:0;min-width:0}
  legend{font-weight:700;font-size:17px;padding:0;float:left;width:100%;margin-bottom:14px}
  fieldset.card>*:not(legend){clear:both}
  label{display:block;font-weight:600;font-size:14px;margin:16px 0 6px}
  .hint{margin:8px 0 0;color:var(--mute);font-size:13px}
  .two{display:grid;grid-template-columns:1fr 1fr;gap:0 14px}
  .seg{display:flex;background:var(--paper);border-radius:10px;padding:4px;gap:4px}
  .seg button{flex:1;border:0;background:transparent;padding:10px 8px;border-radius:7px;font:600 14px Manrope,sans-serif;color:var(--mute);cursor:pointer;min-height:44px}
  .seg button.on{background:#fff;color:var(--pine);box-shadow:0 1px 3px rgba(14,59,46,.18)}
  select,.inp{width:100%;border:1px solid #c5ccc7;border-radius:10px;background:#fff;min-height:48px}
  select{padding:0 12px;font:500 15px Manrope,sans-serif;color:var(--ink)}
  .inp{display:flex;align-items:center;overflow:hidden}
  .inp:focus-within,select:focus{border-color:var(--pine2);box-shadow:0 0 0 3px rgba(27,90,69,.18)}
  .inp input{flex:1;min-width:0;border:0;outline:0;padding:0 12px;font:600 16px Manrope,sans-serif;color:var(--ink);background:transparent;height:46px}
  .inp span{padding:0 12px;color:var(--mute);font-size:13px;white-space:nowrap;background:var(--paper);align-self:stretch;display:flex;align-items:center;border-left:1px solid var(--line)}
  summary{cursor:pointer;font-weight:700;font-size:17px;list-style:none;display:flex;justify-content:space-between}
  summary::after{content:'+';color:var(--mute);font-weight:500}
  details[open]>summary::after{content:'−'}
  .sum{background:var(--pine);color:#fff;border-color:var(--pine)}
  .lab{margin:0;color:#bcd3c8;font-size:14px}
  .total{margin:4px 0 2px;font-size:clamp(34px,6vw,46px);font-weight:800;letter-spacing:-.03em;line-height:1.1}
  .total small{font-size:20px;font-weight:600;color:#bcd3c8}
  .sub{margin:0 0 18px;color:#d7e5de;font-size:14px}
  .bar{display:flex;height:14px;border-radius:7px;overflow:hidden;gap:2px;background:rgba(255,255,255,.12)}
  .bar i{display:block;transition:width .35s ease}
  .leg{list-style:none;margin:16px 0 0;padding:0;display:grid;gap:8px}
  .leg li{display:flex;align-items:center;gap:10px;font-size:14px;color:#e8f0ec}
  .leg li i{width:11px;height:11px;border-radius:3px;flex:none}
  .leg b{margin-left:auto;font-weight:700;color:#fff}
  table{width:100%;border-collapse:collapse;margin-top:14px;font-size:14px}
  td{padding:9px 0;border-bottom:1px solid var(--line)}
  td:last-child{text-align:right;font-weight:600;white-space:nowrap;padding-left:12px}
  tr.b td{font-weight:700;color:var(--pine)}
  tr.t td{border-bottom:0;font-size:16px}
  .acts{display:grid;gap:10px}
  .pri,.sec{min-height:48px;border-radius:10px;font:700 15px Manrope,sans-serif;display:flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer}
  .pri{background:var(--gold);color:#fff;border:0}
  .pri:hover{background:#a37622}
  .sec{background:#fff;color:var(--pine);border:1px solid var(--pine)}
  .lnk{background:none;border:0;color:var(--mute);font:600 14px Manrope,sans-serif;text-decoration:underline;cursor:pointer;padding:8px}
  .warn{margin:0;font-size:13px;color:var(--mute)}
  .foot{max-width:1120px;margin:36px auto 0;padding:22px 20px;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;gap:8px 28px;color:var(--mute);font-size:14px}
  .foot b{color:var(--ink)}
  .nav-h{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.88);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
  .nav-in{max-width:1120px;margin:0 auto;padding:0 20px;height:64px;display:flex;align-items:center;justify-content:space-between;position:relative}
  .brand{display:flex;align-items:center;gap:10px;font-size:19px;letter-spacing:-.01em;color:var(--pine);text-decoration:none}
  .mark{display:grid;place-items:center;width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--pine),var(--pine2));color:#fff;font-weight:800;font-size:14px}
  nav{display:flex;align-items:center;gap:4px}
  nav a{color:var(--ink);text-decoration:none;font-weight:600;font-size:15px;padding:9px 14px;border-radius:999px;transition:background .2s}
  nav a:hover{background:var(--paper)}
  nav a.cta{background:var(--pine);color:#fff;margin-left:8px}
  nav a.cta:hover{background:var(--pine2)}
  .burger{display:none;width:44px;height:44px;border:1px solid var(--line);background:#fff;border-radius:12px;cursor:pointer;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding:0}
  .burger span{display:block;width:18px;height:2px;background:var(--pine);border-radius:2px;transition:transform .25s,opacity .25s}
  .burger[aria-expanded=true] span:nth-child(1){transform:translateY(7px) rotate(45deg)}
  .burger[aria-expanded=true] span:nth-child(2){opacity:0}
  .burger[aria-expanded=true] span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
  .sec2{margin-top:56px;scroll-margin-top:84px}
  .sec2 h2{font-size:clamp(22px,3.4vw,30px);letter-spacing:-.02em;color:var(--pine);margin:0 0 18px}
  .steps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,1fr);gap:14px;counter-reset:s}
  .steps li{background:#fff;border:1px solid var(--line);border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:6px;counter-increment:s}
  .steps li::before{content:counter(s);display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--pine);color:#fff;font-weight:800;font-size:14px;margin-bottom:6px}
  .steps span{color:var(--mute);font-size:14px}
  #faq details{background:#fff;border:1px solid var(--line);border-radius:12px;padding:16px 20px;margin-bottom:10px}
  #faq summary{font-size:16px}
  #faq p{margin:10px 0 0;color:var(--mute);max-width:70ch}
  .grid{scroll-margin-top:84px}
  .foot a{color:var(--pine);font-weight:700;text-decoration:none}
  @media(max-width:900px){
    .burger{display:flex}
    nav{display:none;position:absolute;top:64px;left:0;right:0;flex-direction:column;align-items:stretch;gap:2px;background:#fff;border-bottom:1px solid var(--line);padding:10px 20px 16px;box-shadow:0 12px 24px rgba(14,59,46,.12)}
    nav.show{display:flex}
    nav a{padding:13px 14px;border-radius:10px}
    nav a.cta{margin:8px 0 0;text-align:center}
    .steps{grid-template-columns:1fr 1fr}
  }
  @media(max-width:520px){.steps{grid-template-columns:1fr}}
  .dock{display:none}
  @media(max-width:900px){
    .grid{grid-template-columns:1fr}.result{position:static}
    .card{padding:18px}
    .dock{display:flex;justify-content:space-between;align-items:center;position:fixed;left:0;right:0;bottom:0;padding:12px 20px calc(12px + env(safe-area-inset-bottom));background:var(--pine);color:#fff;z-index:5}
    .dock b{font-size:20px}
  }
  @media(max-width:420px){.two{grid-template-columns:1fr}}
  @media print{:host{padding:0}.grid{grid-template-columns:1fr}.result{position:static}.sum{color:#000;background:#fff}.sum *{color:#000!important}details>*{display:block}}
  `],
})
export class AppComponent {
  svc: CustomsService;
  contact = CONTACT;
  menu = false;
  type: 'occ' | 'neuf' = 'occ';
  cur = 'EUR';
  sp: SousPosition;
  f: Input = { fob: 10000, fret: 800, assPct: 0.5, fx: 150, dd: 30, tcs: 2, tva: 19, tic: 0, red: 0, frais: 60000 };
  private rates: Record<string, number> = { EUR: 150, USD: 135, DZD: 1 };
  private nf = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

  constructor(svc: CustomsService) {
    this.svc = svc;
    this.sp = svc.sousPositions[2];
    this.f.dd = this.sp.dd;
  }
  get r(): Result { return this.svc.calculate({ ...this.f, fx: this.cur === 'DZD' ? 1 : this.f.fx }); }
  get parts() {
    const r = this.r;
    return [
      { k: 'Valeur CIF', v: r.cif, c: '#e9efe9' },
      { k: 'Droit de douane', v: r.dd, c: '#d9a441' },
      { k: 'TCS, TIC, redevance', v: r.tcs + r.tic + r.red, c: '#8fae9d' },
      { k: 'TVA', v: r.tva, c: '#6f93b5' },
      { k: 'Frais annexes', v: r.frais, c: '#5f7f71' },
    ];
  }
  get wa(): string {
    const r = this.r;
    const t = `DZ Import – Simulation\n${this.sp.label} (${this.type === 'occ' ? 'occasion' : 'neuf'})\nCIF : ${this.n(r.cif)} DA\nDroits et taxes : ${this.n(r.taxes)} DA\nTotal rendu : ${this.n(r.total)} DA`;
    return `https://wa.me/${this.contact.wa}?text=${encodeURIComponent(t)}`;
  }
  n(v: number) { return this.nf.format(Number.isFinite(v) ? v : 0); }
  pct(a: number, b: number) { return b ? (a / b * 100).toFixed(1).replace('.', ',') : '0'; }
  share(v: number) { const t = this.r.total; return t ? Math.max(v, 0) / t * 100 : 0; }
  onSp(s: SousPosition) { this.sp = s; this.f.dd = s.dd; }
  onCur(c: string) { this.cur = c; this.f.fx = this.rates[c]; }
  reset() { this.type = 'occ'; this.cur = 'EUR'; this.sp = this.svc.sousPositions[2]; this.f = { fob: 10000, fret: 800, assPct: 0.5, fx: 150, dd: this.sp.dd, tcs: 2, tva: 19, tic: 0, red: 0, frais: 60000 }; }
  print() { window.print(); }
}
