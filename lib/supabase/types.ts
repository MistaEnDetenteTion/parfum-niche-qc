export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      grossistes: {
        Row: {
          id: string;
          nom: string;
          site_web: string | null;
          pays: string;
          devise: "USD" | "EUR" | "GBP" | "CAD";
          taux_change_cad: number;
          frais_livraison_fixe_cad: number;
          notes: string | null;
          actif: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          site_web?: string | null;
          pays?: string;
          devise?: "USD" | "EUR" | "GBP" | "CAD";
          taux_change_cad?: number;
          frais_livraison_fixe_cad?: number;
          notes?: string | null;
          actif?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          site_web?: string | null;
          pays?: string;
          devise?: "USD" | "EUR" | "GBP" | "CAD";
          taux_change_cad?: number;
          frais_livraison_fixe_cad?: number;
          notes?: string | null;
          actif?: boolean;
          updated_at?: string;
        };
      };
      parfums: {
        Row: {
          id: string;
          nom: string;
          maison: string;
          annee: number | null;
          concentration:
            | "Extrait de Parfum"
            | "Eau de Parfum"
            | "Eau de Toilette"
            | "Eau de Cologne"
            | "Parfum Brut";
          genre: "Masculin" | "Féminin" | "Mixte";
          notes_tete: string[];
          notes_coeur: string[];
          notes_fond: string[];
          description: string | null;
          image_url: string | null;
          slug: string | null;
          actif: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          maison: string;
          annee?: number | null;
          concentration?:
            | "Extrait de Parfum"
            | "Eau de Parfum"
            | "Eau de Toilette"
            | "Eau de Cologne"
            | "Parfum Brut";
          genre?: "Masculin" | "Féminin" | "Mixte";
          notes_tete?: string[];
          notes_coeur?: string[];
          notes_fond?: string[];
          description?: string | null;
          image_url?: string | null;
          slug?: string | null;
          actif?: boolean;
        };
        Update: {
          id?: string;
          nom?: string;
          maison?: string;
          annee?: number | null;
          concentration?:
            | "Extrait de Parfum"
            | "Eau de Parfum"
            | "Eau de Toilette"
            | "Eau de Cologne"
            | "Parfum Brut";
          genre?: "Masculin" | "Féminin" | "Mixte";
          notes_tete?: string[];
          notes_coeur?: string[];
          notes_fond?: string[];
          description?: string | null;
          image_url?: string | null;
          slug?: string | null;
          actif?: boolean;
        };
      };
      lots_commande: {
        Row: {
          id: string;
          grossiste_id: string;
          reference: string;
          date_commande: string;
          date_reception: string | null;
          statut: "en_attente" | "commande" | "recu" | "annule";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          grossiste_id: string;
          reference: string;
          date_commande?: string;
          date_reception?: string | null;
          statut?: "en_attente" | "commande" | "recu" | "annule";
          notes?: string | null;
        };
        Update: {
          id?: string;
          grossiste_id?: string;
          reference?: string;
          date_commande?: string;
          date_reception?: string | null;
          statut?: "en_attente" | "commande" | "recu" | "annule";
          notes?: string | null;
        };
      };
      lot_parfums: {
        Row: {
          id: string;
          lot_id: string;
          parfum_id: string;
          volume_flacon_ml: number;
          quantite_flacons: number;
          prix_achat_devise: number;
          devise: "USD" | "EUR" | "GBP" | "CAD";
          prix_achat_cad_ml: number | null;
          frais_expedition_cad_ml: number | null;
          cout_revient_cad_ml: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lot_id: string;
          parfum_id: string;
          volume_flacon_ml?: number;
          quantite_flacons?: number;
          prix_achat_devise: number;
          devise?: "USD" | "EUR" | "GBP" | "CAD";
        };
        Update: {
          id?: string;
          lot_id?: string;
          parfum_id?: string;
          volume_flacon_ml?: number;
          quantite_flacons?: number;
          prix_achat_devise?: number;
          devise?: "USD" | "EUR" | "GBP" | "CAD";
        };
      };
      parametres_decants: {
        Row: {
          id: string;
          lot_parfum_id: string;
          volume_decant_ml: number;
          multiplicateur_decant: number;
          multiplicateur_flacon_entier: number;
          prix_boutique_barre_cad: number | null;
          prix_vente_decant_cad: number | null;
          prix_vente_flacon_cad: number | null;
          actif: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lot_parfum_id: string;
          volume_decant_ml?: number;
          multiplicateur_decant?: number;
          multiplicateur_flacon_entier?: number;
          prix_boutique_barre_cad?: number | null;
          actif?: boolean;
        };
        Update: {
          id?: string;
          lot_parfum_id?: string;
          volume_decant_ml?: number;
          multiplicateur_decant?: number;
          multiplicateur_flacon_entier?: number;
          prix_boutique_barre_cad?: number | null;
          actif?: boolean;
        };
      };
      inventaire: {
        Row: {
          id: string;
          parfum_id: string;
          lot_parfum_id: string;
          stock_brut_ml: number;
          stock_disponible_ml: number;
          stock_reserve_ml: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parfum_id: string;
          lot_parfum_id: string;
          stock_brut_ml?: number;
          stock_reserve_ml?: number;
        };
        Update: {
          stock_brut_ml?: number;
          stock_reserve_ml?: number;
        };
      };
      story_posts: {
        Row: {
          id: string;
          parfum_id: string;
          lot_parfum_id: string | null;
          avis: string;
          prix_affiche_cad: number;
          image_url: string | null;
          date_post: string;
          publie: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          parfum_id: string;
          lot_parfum_id?: string | null;
          avis: string;
          prix_affiche_cad: number;
          image_url?: string | null;
          date_post?: string;
          publie?: boolean;
        };
        Update: {
          avis?: string;
          prix_affiche_cad?: number;
          image_url?: string | null;
          publie?: boolean;
        };
      };
    };
    Views: {
      vue_calcul_complet: {
        Row: {
          lot_parfum_id: string;
          parfum_id: string;
          parfum_nom: string;
          maison: string;
          concentration: string;
          grossiste_nom: string;
          grossiste_pays: string;
          devise: string;
          taux_change_cad: number;
          volume_flacon_ml: number;
          quantite_flacons: number;
          prix_achat_devise: number;
          prix_achat_cad_ml: number | null;
          frais_expedition_cad_ml: number | null;
          cout_revient_cad_ml: number | null;
          statut_lot: string;
          date_commande: string;
          date_reception: string | null;
          volume_decant_ml: number | null;
          multiplicateur_decant: number | null;
          multiplicateur_flacon_entier: number | null;
          prix_vente_decant_cad: number | null;
          prix_vente_flacon_cad: number | null;
          prix_boutique_barre_cad: number | null;
          marge_decant_pct: number | null;
          marge_flacon_pct: number | null;
          stock_brut_ml: number;
          stock_disponible_ml: number;
        };
      };
    };
    Functions: {
      get_stock_par_parfum: {
        Returns: {
          parfum_id: string;
          parfum_nom: string;
          maison: string;
          stock_brut_ml: number;
          stock_dispo_ml: number;
          nb_decants_10ml: number;
        }[];
      };
    };
  };
};

// Helpers pratiques
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Grossiste = Tables<"grossistes">;
export type Parfum = Tables<"parfums">;
export type LotCommande = Tables<"lots_commande">;
export type LotParfum = Tables<"lot_parfums">;
export type ParametreDecant = Tables<"parametres_decants">;
export type Inventaire = Tables<"inventaire">;
export type StoryPost = Tables<"story_posts">;
export type VueCalculComplet = Database["public"]["Views"]["vue_calcul_complet"]["Row"];

export type StatutLot = "en_attente" | "commande" | "recu" | "annule";
export type Devise = "USD" | "EUR" | "GBP" | "CAD";
export type Concentration =
  | "Extrait de Parfum"
  | "Eau de Parfum"
  | "Eau de Toilette"
  | "Eau de Cologne"
  | "Parfum Brut";
export type Genre = "Masculin" | "Féminin" | "Mixte";
