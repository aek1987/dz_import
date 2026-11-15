/**
* Valeurs de référence minimales FOB, Direction Générale des Douanes (période 2025).
* Source : pages 19, 21, 22 et extraits (n° 1-28, 85-112, 281-308, 365-392, 505-532, 561-593).
*
* Chaque ligne : [n°, marque, modèle, énergie, cylindrée, origine, devise, neuf, <1 an, <2 ans, <3 ans]
* `null` = valeur illisible ou erreur d'impression dans le document source (à vérifier).
*/
import { RAW } from "./arguis";
export type AgeKey = "neuf" | "u1" | "u2" | "u3";
export const AGE_INDEX: Record<AgeKey, 0 | 1 | 2 | 3> = {
  neuf: 0,
  u1: 1,
  u2: 2,
  u3: 3,
};

export type Energie = "ESS" | "DSL" | "HYB" | "ELC";
type Origine = "EU" | "AP";
type Devise = "EUR" | "USD";
type Fob = [number | null, number | null, number | null, number | null];

export interface RefValue {
  /** N° de la ligne dans le document de la Douane */
  n: number;
  marque: string;
  modele: string;
  energie: Energie;
  cyl: number | null;
  origine: "Europe" | "Autres pays";
  devise: Devise;
  /** [neuf, moins d'1 an, moins de 2 ans, moins de 3 ans] */
  fob: Fob;
  /** Texte affiché dans la liste des versions */
  label: string;
  /** Tranche douanière déduite de l'énergie et de la cylindrée */
  tranche: Tranche; 
}

export type Row = [
  number,
  string,
  string,
  Energie,
  number | null,
  Origine,
  Devise,
  number | null,
  number | null,
  number | null,
  number | null,
];



const ENERGIE_LABEL: Record<Energie, string> = {
  ESS: "Essence",
  DSL: "Diesel",
  HYB: "Hybride",
  ELC: "Électrique",
};


export const REFERENCE_VALUES: RefValue[] = RAW.map(
  ([n, marque, modele, energie, cyl, origine, devise, neuf, a1, a2, a3]) => {
    const org = origine === "EU" ? "Europe" : "Autres pays";
    return {
      n,
      marque,
      modele,
      energie,
      cyl,
      origine: org,
      devise,
      fob: [neuf, a1, a2, a3] as Fob,
      label: `${ENERGIE_LABEL[energie]}${cyl ? " " + cyl + " cm³" : ""} · ${org} · n°${n}`,
      tranche: trancheFromRow(energie, cyl),   // ← ligne ajoutée
    };
  },
);
export type Tranche =
| "ESS_1000" | "ESS_1500" | "ESS_3000" | "ESS_PLUS"
| "DSL_1500" | "DSL_2500" | "DSL_PLUS" | "HYB" | "ELC";

export function trancheFromRow(energie: Energie, cyl: number | null): Tranche {
  if (energie === "ELC") return "ELC";
  if (energie === "HYB") return "HYB";
  const c = cyl ?? 0;
  if (energie === "ESS") {
    if (c <= 1000) return "ESS_1000";
    if (c <= 1500) return "ESS_1500";
    if (c <= 3000) return "ESS_3000";
    return "ESS_PLUS";
  }
  if (c <= 1500) return "DSL_1500";
  if (c <= 2500) return "DSL_2500";
  return "DSL_PLUS";
}
export const MARQUES: string[] = [
  ...new Set(REFERENCE_VALUES.map((r) => r.marque)),
].sort();

export function modelesOf(marque: string): string[] {
  return [
    ...new Set(
      REFERENCE_VALUES.filter((r) => r.marque === marque).map((r) => r.modele),
    ),
  ].sort();
}

export function versionsOf(marque: string, modele: string): RefValue[] {
  return REFERENCE_VALUES.filter(
    (r) => r.marque === marque && r.modele === modele,
  );
  
}
