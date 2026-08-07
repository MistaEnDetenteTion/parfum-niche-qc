import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un prix en CAD avec le symbole $
 */
export function formatCAD(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formate un nombre en ml
 */
export function formatMl(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${value.toFixed(1)} ml`;
}

/**
 * Formate un pourcentage de marge
 */
export function formatMarge(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${value.toFixed(1)} %`;
}

/**
 * Calcule le coût de revient en CAD/ml
 */
export function calcCoutRevientMl(params: {
  prixAchatDevise: number;
  volumeFlaconMl: number;
  tauxChangeCad: number;
  fraisLivraisonCad: number;
}): number {
  const { prixAchatDevise, volumeFlaconMl, tauxChangeCad, fraisLivraisonCad } =
    params;
  const achatCadMl = (prixAchatDevise / volumeFlaconMl) * tauxChangeCad;
  const fraisMl = fraisLivraisonCad / volumeFlaconMl;
  return achatCadMl + fraisMl;
}

/**
 * Calcule le prix de vente d'un décant
 */
export function calcPrixDecant(params: {
  coutRevientMl: number;
  volumeDecantMl: number;
  multiplicateur: number;
}): number {
  return Math.round(
    params.coutRevientMl * params.volumeDecantMl * params.multiplicateur * 100
  ) / 100;
}

/**
 * Calcule la marge en %
 */
export function calcMargePct(prixVente: number, coutTotal: number): number {
  if (prixVente === 0) return 0;
  return Math.round(((prixVente - coutTotal) / prixVente) * 1000) / 10;
}

/**
 * Calcule le stock disponible (buffer 5%)
 */
export function calcStockDisponible(stockBrutMl: number): number {
  return stockBrutMl * 0.95;
}

/**
 * Nombre max de décants 10ml
 */
export function calcNbDecants(stockBrutMl: number, volumeDecantMl = 10): number {
  return Math.floor(calcStockDisponible(stockBrutMl) / volumeDecantMl);
}

/**
 * Génère un slug propre
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Statut lot → label FR + couleur
 */
export const STATUT_LOT_CONFIG = {
  en_attente: { label: "En attente", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  commande: { label: "Commandé", color: "text-blue-400", bg: "bg-blue-400/10" },
  recu: { label: "Reçu", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  annule: { label: "Annulé", color: "text-red-400", bg: "bg-red-400/10" },
} as const;
