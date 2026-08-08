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
  prix_boutique_formats: any;
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

// ==========================================
// BUNDLES (LOTS PRECOMPOSÉS)
// ==========================================

export type BundleItem = {
  id: string;
  bundle_id: string;
  parfum_id: string;
  volume_flacon_ml: number;
  quantite: number;
  parfum?: { nom: string; maison: string };
};

export type Bundle = {
  id: string;
  grossiste_id: string;
  nom: string;
  prix_global_devise: number;
  notes: string | null;
  items?: BundleItem[];
};

export type ComparateurBundle = {
  bundle_id: string;
  bundle_nom: string;
  prix_global_devise: number;
  notes: string | null;
  grossiste_id: string;
  grossiste_nom: string;
  devise: string;
  taux_change_cad: number;
  frais_livraison_fixe_cad: number;
  volume_total_ml: number;
  total_flacons: number;
  parfum_ids: string[];
  prix_achat_total_cad: number;
  frais_expedition_total_cad: number;
  cout_revient_total_cad: number;
  cout_moyen_cad_ml: number;
  items_details?: BundleItem[]; // pour afficher le contenu
};

export async function getBundles(grossisteId: string): Promise<Bundle[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await (supabase as any)
    .from("grossiste_bundles")
    .select("*, items:grossiste_bundle_items(*, parfum:parfums(nom, maison))")
    .eq("grossiste_id", grossisteId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function upsertBundle(bundle: Partial<Bundle>) {
  const supabase = await createServerSupabaseClient();
  const payload: any = {
    grossiste_id: bundle.grossiste_id,
    nom: bundle.nom,
    prix_global_devise: bundle.prix_global_devise,
    notes: bundle.notes || null,
  };
  if (bundle.id) payload.id = bundle.id;

  const { data, error } = await (supabase as any)
    .from("grossiste_bundles")
    .upsert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/grossistes");
  revalidatePath("/admin/comparateur");
  return data;
}

export async function deleteBundle(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await (supabase as any)
    .from("grossiste_bundles")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/grossistes");
  revalidatePath("/admin/comparateur");
}

export async function upsertBundleItem(item: Partial<BundleItem>) {
  const supabase = await createServerSupabaseClient();
  const payload: any = {
    bundle_id: item.bundle_id,
    parfum_id: item.parfum_id,
    volume_flacon_ml: item.volume_flacon_ml,
    quantite: item.quantite || 1,
  };
  if (item.id) payload.id = item.id;

  const { error } = await (supabase as any)
    .from("grossiste_bundle_items")
    .upsert(payload, { onConflict: "bundle_id, parfum_id, volume_flacon_ml" });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/grossistes");
  revalidatePath("/admin/comparateur");
}

export async function deleteBundleItem(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await (supabase as any)
    .from("grossiste_bundle_items")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/grossistes");
  revalidatePath("/admin/comparateur");
}

export async function getComparateurBundles(): Promise<ComparateurBundle[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await (supabase as any)
    .from("vue_comparateur_bundles")
    .select("*");

  if (error) throw new Error(error.message);

  // Pour chaque bundle, on va aussi chercher le détail des items pour l'affichage (car vue_comparateur_bundles n'a que parfum_ids)
  const bundleIds = (data || []).map((b: any) => b.bundle_id);
  if (bundleIds.length > 0) {
    const { data: itemsData } = await (supabase as any)
      .from("grossiste_bundle_items")
      .select("*, parfum:parfums(nom, maison)")
      .in("bundle_id", bundleIds);
      
    if (itemsData) {
      for (const b of data) {
        b.items_details = itemsData.filter((i: any) => i.bundle_id === b.bundle_id);
      }
    }
  }

  return data || [];
}
