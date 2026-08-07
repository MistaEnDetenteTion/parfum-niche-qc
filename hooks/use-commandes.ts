"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type LotCommande = Database["public"]["Tables"]["lots_commande"]["Row"];
type LotParfum = Database["public"]["Tables"]["lot_parfums"]["Row"];
type ParametreDecant = Database["public"]["Tables"]["parametres_decants"]["Row"];

export type LotCommandeAvecDetails = LotCommande & {
  grossiste: { nom: string; devise: string; taux_change_cad: number; frais_livraison_fixe_cad: number };
  lot_parfums: (LotParfum & {
    parfum: { nom: string; maison: string; concentration: string };
    parametres_decants: ParametreDecant[];
  })[];
};

export type { LotCommande, LotParfum, ParametreDecant };

export function useCommandes() {
  const [commandes, setCommandes] = useState<LotCommandeAvecDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const fetchCommandes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await db.from("lots_commande")
      .select(`
        *,
        grossiste:grossistes(nom, devise, taux_change_cad, frais_livraison_fixe_cad),
        lot_parfums(
          *,
          parfum:parfums(nom, maison, concentration),
          parametres_decants(*)
        )
      `)
      .order("date_commande", { ascending: false });
    if (error) setError(error.message);
    else setCommandes(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCommandes(); }, [fetchCommandes]);

  const addLot = async (lot: { grossiste_id: string; reference: string; date_commande: string; notes?: string }) => {
    const { data, error } = await db.from("lots_commande").insert([lot]).select().single();
    if (error) throw error;
    await fetchCommandes();
    return data;
  };

  const updateLotStatut = async (id: string, statut: LotCommande["statut"], date_reception?: string) => {
    const updates: Record<string, unknown> = { statut };
    if (date_reception) updates.date_reception = date_reception;
    const { error } = await db.from("lots_commande").update(updates).eq("id", id);
    if (error) throw error;
    await fetchCommandes();
  };

  const addLotParfum = async (lotParfum: {
    lot_id: string;
    parfum_id: string;
    volume_flacon_ml: number;
    quantite_flacons: number;
    prix_achat_devise: number;
    devise: LotParfum["devise"];
  }) => {
    const { data, error } = await db.from("lot_parfums").insert([lotParfum]).select().single();
    if (error) throw error;
    await fetchCommandes();
    return data;
  };

  const upsertParametresDecant = async (params: {
    lot_parfum_id: string;
    volume_decant_ml: number;
    multiplicateur_decant: number;
    multiplicateur_flacon_entier: number;
    prix_boutique_barre_cad?: number;
  }) => {
    const { error } = await db.from("parametres_decants")
      .upsert([{ ...params, actif: true }], { onConflict: "lot_parfum_id" });
    if (error) throw error;
    await fetchCommandes();
  };

  return { commandes, loading, error, refresh: fetchCommandes, addLot, updateLotStatut, addLotParfum, upsertParametresDecant };
}
