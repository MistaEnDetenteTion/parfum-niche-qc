"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type CatalogueItem = {
  id: string;
  grossiste_id: string;
  parfum_id: string;
  volume_flacon_ml: number;
  prix_achat_devise: number;
  moq: number;
  notes: string | null;
  parfum?: {
    nom: string;
    maison: string;
  };
};

export type ComparateurItem = {
  catalogue_id: string;
  parfum_id: string;
  parfum_nom: string;
  maison: string;
  volume_flacon_ml: number;
  grossiste_id: string;
  grossiste_nom: string;
  devise: string;
  taux_change_cad: number;
  frais_livraison_fixe_cad: number;
  prix_achat_devise: number;
  moq: number;
  notes: string | null;
  prix_achat_cad_ml: number;
  frais_expedition_cad_ml: number;
  cout_revient_cad_ml: number;
};

// 1. Récupérer le catalogue d'un grossiste spécifique
export async function getCatalogueGrossiste(grossisteId: string): Promise<CatalogueItem[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await (supabase as any)
    .from("grossiste_catalogue")
    .select("*, parfum:parfums(nom, maison)")
    .eq("grossiste_id", grossisteId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

// 2. Ajouter ou modifier un parfum dans le catalogue
export async function upsertCatalogueItem(item: Partial<CatalogueItem>) {
  const supabase = await createServerSupabaseClient();
  const payload: any = {
    grossiste_id: item.grossiste_id,
    parfum_id: item.parfum_id,
    volume_flacon_ml: item.volume_flacon_ml,
    prix_achat_devise: item.prix_achat_devise,
    moq: item.moq || 1,
    notes: item.notes || null,
  };
  
  if (item.id) {
    payload.id = item.id;
  }

  const { error } = await (supabase as any)
    .from("grossiste_catalogue")
    .upsert(payload, { onConflict: "grossiste_id, parfum_id, volume_flacon_ml" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/grossistes");
  revalidatePath("/admin/comparateur");
}

// 3. Supprimer un item du catalogue
export async function deleteCatalogueItem(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await (supabase as any)
    .from("grossiste_catalogue")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/grossistes");
  revalidatePath("/admin/comparateur");
}

// 4. Récupérer les données pour le comparateur
export async function getComparateurData(): Promise<ComparateurItem[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await (supabase as any)
    .from("vue_comparateur_prix")
    .select("*")
    .order("maison", { ascending: true })
    .order("parfum_nom", { ascending: true })
    .order("volume_flacon_ml", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}
