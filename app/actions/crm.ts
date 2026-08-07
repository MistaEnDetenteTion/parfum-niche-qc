"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ClientCRM = {
  id: string;
  prenom: string;
  nom: string;
  handle_social: string | null;
  source_acquisition: string | null;
  preferences_olfactives: string[];
  notes_privees: string | null;
  parrain_id: string | null;
  created_at: string;
  ltv_cad: number;
  dernier_achat: string | null;
  nb_filleuls: number;
};

export type VenteCRM = {
  id: string;
  client_id: string;
  parfum_id: string | null;
  type_achat: "decant_10ml" | "decant_5ml" | "full_bottle" | "autre";
  montant_cad: number;
  date_achat: string;
  created_at: string;
};

// 1. Fetch tous les clients (Vue calculée)
export async function getClients(): Promise<ClientCRM[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("vue_crm_clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as ClientCRM[];
}

// 2. Fetch les ventes d'un client
export async function getVentesClient(clientId: string): Promise<VenteCRM[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("ventes")
    .select("*")
    .eq("client_id", clientId)
    .order("date_achat", { ascending: false });

  if (error) throw new Error(error.message);
  return data as VenteCRM[];
}

// 3. Ajouter / Mettre à jour un client
export async function upsertClient(client: Partial<ClientCRM>) {
  const supabase = await createServerSupabaseClient();
  // Ne garder que les colonnes de la table `clients`
  const payload = {
    id: client.id,
    prenom: client.prenom,
    nom: client.nom,
    handle_social: client.handle_social,
    source_acquisition: client.source_acquisition,
    preferences_olfactives: client.preferences_olfactives || [],
    notes_privees: client.notes_privees,
    parrain_id: client.parrain_id || null,
  };

  const { error } = await supabase
    .from("clients")
    .upsert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/crm");
}

// 4. Ajouter une vente
export async function addVente(vente: Partial<VenteCRM>) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("ventes").insert([vente]);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/crm");
}

// 5. Obtenir les clients à relancer (décant 10ml acheté il y a 25-30 jours)
export async function getClientsARelancer() {
  const supabase = await createServerSupabaseClient();
  
  // Date d'il y a 30 jours et 25 jours
  const now = new Date();
  const date30 = new Date(now.setDate(now.getDate() - 30)).toISOString();
  const date25 = new Date(now.setDate(now.getDate() + 5)).toISOString(); // +5 from -30 = -25

  // Fetch ventes de type decant_10ml dans cette fenêtre
  const { data, error } = await supabase
    .from("ventes")
    .select("*, client:clients(prenom, nom, handle_social), parfum:parfums(nom, maison)")
    .eq("type_achat", "decant_10ml")
    .gte("date_achat", date30)
    .lte("date_achat", date25)
    .order("date_achat", { ascending: true });

  if (error) throw new Error(error.message);
  return data; // any for simplicity in this specific action
}
