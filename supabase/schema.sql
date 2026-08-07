-- ============================================================
-- PARFUM NICHE QC — Schéma SQL Supabase complet
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE devise_type AS ENUM ('USD', 'EUR', 'GBP', 'CAD');
CREATE TYPE concentration_type AS ENUM (
  'Extrait de Parfum',
  'Eau de Parfum',
  'Eau de Toilette',
  'Eau de Cologne',
  'Parfum Brut'
);
CREATE TYPE genre_type AS ENUM ('Masculin', 'Féminin', 'Mixte');
CREATE TYPE statut_lot AS ENUM ('en_attente', 'commande', 'recu', 'annule');

-- ============================================================
-- TABLE: grossistes
-- ============================================================

CREATE TABLE IF NOT EXISTS public.grossistes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom             TEXT NOT NULL,
  site_web        TEXT,
  pays            TEXT NOT NULL DEFAULT 'États-Unis',
  devise          devise_type NOT NULL DEFAULT 'USD',
  taux_change_cad NUMERIC(10, 6) NOT NULL DEFAULT 1.36,
  frais_livraison_fixe_cad NUMERIC(10, 2) NOT NULL DEFAULT 12.75,
  notes           TEXT,
  actif           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.grossistes IS 'Fournisseurs / grossistes de parfums';
COMMENT ON COLUMN public.grossistes.taux_change_cad IS 'Taux de change actuel devise → CAD';
COMMENT ON COLUMN public.grossistes.frais_livraison_fixe_cad IS 'Frais d'expédition en CAD par flacon commandé';

-- ============================================================
-- TABLE: parfums
-- ============================================================

CREATE TABLE IF NOT EXISTS public.parfums (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom             TEXT NOT NULL,
  maison          TEXT NOT NULL,
  annee           INT,
  concentration   concentration_type NOT NULL DEFAULT 'Eau de Parfum',
  genre           genre_type NOT NULL DEFAULT 'Mixte',
  -- Pyramide olfactive (JSON pour flexibilité)
  notes_tete      TEXT[] NOT NULL DEFAULT '{}',
  notes_coeur     TEXT[] NOT NULL DEFAULT '{}',
  notes_fond      TEXT[] NOT NULL DEFAULT '{}',
  description     TEXT,
  image_url       TEXT,
  slug            TEXT UNIQUE,
  actif           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.parfums IS 'Catalogue des parfums vendus';
CREATE INDEX IF NOT EXISTS idx_parfums_maison ON public.parfums(maison);
CREATE INDEX IF NOT EXISTS idx_parfums_slug ON public.parfums(slug);

-- ============================================================
-- TABLE: lots_commande
-- ============================================================

CREATE TABLE IF NOT EXISTS public.lots_commande (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grossiste_id    UUID NOT NULL REFERENCES public.grossistes(id) ON DELETE RESTRICT,
  reference       TEXT NOT NULL,
  date_commande   DATE NOT NULL DEFAULT CURRENT_DATE,
  date_reception  DATE,
  statut          statut_lot NOT NULL DEFAULT 'en_attente',
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.lots_commande IS 'Lots de commande groupés auprès d'un grossiste';
CREATE INDEX IF NOT EXISTS idx_lots_grossiste ON public.lots_commande(grossiste_id);
CREATE INDEX IF NOT EXISTS idx_lots_statut ON public.lots_commande(statut);

-- ============================================================
-- TABLE: lot_parfums (lignes de commande)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.lot_parfums (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lot_id                UUID NOT NULL REFERENCES public.lots_commande(id) ON DELETE CASCADE,
  parfum_id             UUID NOT NULL REFERENCES public.parfums(id) ON DELETE RESTRICT,
  volume_flacon_ml      NUMERIC(8, 2) NOT NULL DEFAULT 100.0,
  quantite_flacons      INT NOT NULL DEFAULT 1 CHECK (quantite_flacons >= 1),
  prix_achat_devise     NUMERIC(10, 4) NOT NULL,
  devise                devise_type NOT NULL DEFAULT 'USD',
  -- Calculé automatiquement via trigger
  prix_achat_cad_ml     NUMERIC(10, 6),
  frais_expedition_cad_ml NUMERIC(10, 6),
  cout_revient_cad_ml   NUMERIC(10, 6),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.lot_parfums IS 'Lignes de commande : chaque parfum dans un lot';
COMMENT ON COLUMN public.lot_parfums.prix_achat_devise IS 'Prix d'achat du flacon dans la devise du grossiste';
COMMENT ON COLUMN public.lot_parfums.prix_achat_cad_ml IS 'Prix d'achat converti en CAD par ml (calculé auto)';
COMMENT ON COLUMN public.lot_parfums.cout_revient_cad_ml IS 'Coût de revient total par ml (achat + livraison)';

CREATE INDEX IF NOT EXISTS idx_lot_parfums_lot ON public.lot_parfums(lot_id);
CREATE INDEX IF NOT EXISTS idx_lot_parfums_parfum ON public.lot_parfums(parfum_id);

-- ============================================================
-- TABLE: parametres_decants
-- ============================================================

CREATE TABLE IF NOT EXISTS public.parametres_decants (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lot_parfum_id               UUID NOT NULL REFERENCES public.lot_parfums(id) ON DELETE CASCADE,
  volume_decant_ml            NUMERIC(5, 1) NOT NULL DEFAULT 10.0,
  multiplicateur_decant       NUMERIC(5, 2) NOT NULL DEFAULT 2.5,
  multiplicateur_flacon_entier NUMERIC(5, 2) NOT NULL DEFAULT 2.0,
  prix_boutique_barre_cad     NUMERIC(10, 2),
  -- Calculé automatiquement
  prix_vente_decant_cad       NUMERIC(10, 2),
  prix_vente_flacon_cad       NUMERIC(10, 2),
  actif                       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.parametres_decants IS 'Paramètres de prix et marges pour chaque ligne de commande';
COMMENT ON COLUMN public.parametres_decants.multiplicateur_decant IS 'Facteur appliqué au coût de revient pour le prix vente décant';
COMMENT ON COLUMN public.parametres_decants.prix_boutique_barre_cad IS 'Prix de détail en boutique (barré) pour référence';

-- ============================================================
-- TABLE: inventaire
-- ============================================================

CREATE TABLE IF NOT EXISTS public.inventaire (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parfum_id               UUID NOT NULL REFERENCES public.parfums(id) ON DELETE RESTRICT,
  lot_parfum_id           UUID NOT NULL REFERENCES public.lot_parfums(id) ON DELETE CASCADE,
  stock_brut_ml           NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
  -- Buffer 5% perte au décantage
  stock_disponible_ml     NUMERIC(10, 2) GENERATED ALWAYS AS (stock_brut_ml * 0.95) STORED,
  stock_reserve_ml        NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.inventaire IS 'Stock en ml par lot de parfum';
COMMENT ON COLUMN public.inventaire.stock_disponible_ml IS 'Stock après buffer 5% de perte au décantage (généré)';
CREATE UNIQUE INDEX IF NOT EXISTS idx_inventaire_lot_parfum ON public.inventaire(lot_parfum_id);
CREATE INDEX IF NOT EXISTS idx_inventaire_parfum ON public.inventaire(parfum_id);

-- ============================================================
-- TABLE: story_posts (Parfum du Jour)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.story_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parfum_id       UUID NOT NULL REFERENCES public.parfums(id) ON DELETE RESTRICT,
  lot_parfum_id   UUID REFERENCES public.lot_parfums(id) ON DELETE SET NULL,
  avis            TEXT NOT NULL,
  prix_affiche_cad NUMERIC(10, 2) NOT NULL,
  image_url       TEXT,
  date_post       DATE NOT NULL DEFAULT CURRENT_DATE,
  publie          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.story_posts IS 'Historique des publications Parfum du Jour';
CREATE INDEX IF NOT EXISTS idx_story_parfum ON public.story_posts(parfum_id);
CREATE INDEX IF NOT EXISTS idx_story_date ON public.story_posts(date_post DESC);

-- ============================================================
-- FONCTIONS & TRIGGERS
-- ============================================================

-- Trigger: mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger updated_at sur toutes les tables concernées
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['grossistes','parfums','lots_commande','lot_parfums','parametres_decants']
  LOOP
    EXECUTE format(
      'CREATE OR REPLACE TRIGGER trg_%s_updated_at
       BEFORE UPDATE ON public.%s
       FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()',
      t, t
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger: calcul automatique des coûts au niveau lot_parfums
CREATE OR REPLACE FUNCTION public.calc_cout_revient()
RETURNS TRIGGER AS $$
DECLARE
  v_grossiste     public.grossistes%ROWTYPE;
  v_lot           public.lots_commande%ROWTYPE;
  v_achat_cad_ml  NUMERIC;
  v_frais_ml      NUMERIC;
BEGIN
  -- Récupérer le grossiste via le lot
  SELECT g.* INTO v_grossiste
  FROM public.grossistes g
  JOIN public.lots_commande l ON l.grossiste_id = g.id
  WHERE l.id = NEW.lot_id;

  -- Prix d'achat CAD par ml
  v_achat_cad_ml := (NEW.prix_achat_devise / NEW.volume_flacon_ml) * v_grossiste.taux_change_cad;

  -- Frais d'expédition CAD par ml
  v_frais_ml := v_grossiste.frais_livraison_fixe_cad / NEW.volume_flacon_ml;

  NEW.prix_achat_cad_ml        := v_achat_cad_ml;
  NEW.frais_expedition_cad_ml  := v_frais_ml;
  NEW.cout_revient_cad_ml      := v_achat_cad_ml + v_frais_ml;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_lot_parfums_cout
BEFORE INSERT OR UPDATE ON public.lot_parfums
FOR EACH ROW EXECUTE FUNCTION public.calc_cout_revient();

-- Trigger: calcul automatique des prix de vente dans parametres_decants
CREATE OR REPLACE FUNCTION public.calc_prix_vente()
RETURNS TRIGGER AS $$
DECLARE
  v_cout_ml       NUMERIC;
  v_volume_fl     NUMERIC;
BEGIN
  SELECT lp.cout_revient_cad_ml, lp.volume_flacon_ml
  INTO v_cout_ml, v_volume_fl
  FROM public.lot_parfums lp
  WHERE lp.id = NEW.lot_parfum_id;

  NEW.prix_vente_decant_cad   := ROUND(v_cout_ml * NEW.volume_decant_ml * NEW.multiplicateur_decant, 2);
  NEW.prix_vente_flacon_cad   := ROUND(v_cout_ml * v_volume_fl * NEW.multiplicateur_flacon_entier, 2);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_decants_prix
BEFORE INSERT OR UPDATE ON public.parametres_decants
FOR EACH ROW EXECUTE FUNCTION public.calc_prix_vente();

-- Trigger: initialiser l'inventaire quand un lot_parfum est reçu
CREATE OR REPLACE FUNCTION public.init_inventaire()
RETURNS TRIGGER AS $$
BEGIN
  -- Insérer ou mettre à jour l'inventaire quand le lot est marqué 'recu'
  IF NEW.statut = 'recu' AND (OLD IS NULL OR OLD.statut <> 'recu') THEN
    INSERT INTO public.inventaire (parfum_id, lot_parfum_id, stock_brut_ml)
    SELECT lp.parfum_id, lp.id, (lp.volume_flacon_ml * lp.quantite_flacons)
    FROM public.lot_parfums lp
    WHERE lp.lot_id = NEW.id
    ON CONFLICT (lot_parfum_id)
    DO UPDATE SET
      stock_brut_ml = EXCLUDED.stock_brut_ml,
      updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_lots_inventaire
AFTER UPDATE ON public.lots_commande
FOR EACH ROW EXECUTE FUNCTION public.init_inventaire();

-- Fonction: résumé stock par parfum (vue utilitaire)
CREATE OR REPLACE FUNCTION public.get_stock_par_parfum()
RETURNS TABLE (
  parfum_id       UUID,
  parfum_nom      TEXT,
  maison          TEXT,
  stock_brut_ml   NUMERIC,
  stock_dispo_ml  NUMERIC,
  nb_decants_10ml INT
) AS $$
SELECT
  p.id,
  p.nom,
  p.maison,
  COALESCE(SUM(i.stock_brut_ml), 0)           AS stock_brut_ml,
  COALESCE(SUM(i.stock_disponible_ml), 0)      AS stock_dispo_ml,
  COALESCE(FLOOR(SUM(i.stock_disponible_ml) / 10), 0)::INT AS nb_decants_10ml
FROM public.parfums p
LEFT JOIN public.inventaire i ON i.parfum_id = p.id
GROUP BY p.id, p.nom, p.maison;
$$ LANGUAGE SQL STABLE;

-- ============================================================
-- VUE: vue_calcul_complet (pour le calculateur admin)
-- ============================================================

CREATE OR REPLACE VIEW public.vue_calcul_complet AS
SELECT
  lp.id                         AS lot_parfum_id,
  p.id                          AS parfum_id,
  p.nom                         AS parfum_nom,
  p.maison,
  p.concentration,
  g.nom                         AS grossiste_nom,
  g.pays                        AS grossiste_pays,
  g.devise,
  g.taux_change_cad,
  lp.volume_flacon_ml,
  lp.quantite_flacons,
  lp.prix_achat_devise,
  lp.prix_achat_cad_ml,
  lp.frais_expedition_cad_ml,
  lp.cout_revient_cad_ml,
  l.statut                      AS statut_lot,
  l.date_commande,
  l.date_reception,
  pd.volume_decant_ml,
  pd.multiplicateur_decant,
  pd.multiplicateur_flacon_entier,
  pd.prix_vente_decant_cad,
  pd.prix_vente_flacon_cad,
  pd.prix_boutique_barre_cad,
  -- Marges
  CASE WHEN pd.prix_vente_decant_cad > 0
    THEN ROUND(((pd.prix_vente_decant_cad - (lp.cout_revient_cad_ml * pd.volume_decant_ml)) / pd.prix_vente_decant_cad) * 100, 1)
    ELSE 0
  END                           AS marge_decant_pct,
  CASE WHEN pd.prix_vente_flacon_cad > 0
    THEN ROUND(((pd.prix_vente_flacon_cad - (lp.cout_revient_cad_ml * lp.volume_flacon_ml)) / pd.prix_vente_flacon_cad) * 100, 1)
    ELSE 0
  END                           AS marge_flacon_pct,
  -- Inventaire
  COALESCE(i.stock_brut_ml, 0)          AS stock_brut_ml,
  COALESCE(i.stock_disponible_ml, 0)    AS stock_disponible_ml
FROM public.lot_parfums lp
JOIN public.parfums p ON p.id = lp.parfum_id
JOIN public.lots_commande l ON l.id = lp.lot_id
JOIN public.grossistes g ON g.id = l.grossiste_id
LEFT JOIN public.parametres_decants pd ON pd.lot_parfum_id = lp.id AND pd.actif = TRUE
LEFT JOIN public.inventaire i ON i.lot_parfum_id = lp.id;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.grossistes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parfums             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lots_commande       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lot_parfums         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parametres_decants  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventaire          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_posts         ENABLE ROW LEVEL SECURITY;

-- Policies: utilisateurs authentifiés ont accès complet (admin)
CREATE POLICY "Admin full access on grossistes"
  ON public.grossistes FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access on lots_commande"
  ON public.lots_commande FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access on lot_parfums"
  ON public.lot_parfums FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access on parametres_decants"
  ON public.parametres_decants FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access on inventaire"
  ON public.inventaire FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access on story_posts"
  ON public.story_posts FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Parfums: lecture publique (pour la story page), écriture admin seulement
CREATE POLICY "Lecture publique sur parfums"
  ON public.parfums FOR SELECT
  USING (actif = TRUE);

CREATE POLICY "Admin write on parfums"
  ON public.parfums FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- DONNÉES INITIALES (seed)
-- ============================================================

-- Grossiste exemple
INSERT INTO public.grossistes (nom, site_web, pays, devise, taux_change_cad, frais_livraison_fixe_cad, notes)
VALUES (
  'Fragrancenet',
  'https://www.fragrancenet.com',
  'États-Unis',
  'USD',
  1.365,
  12.75,
  'Grossiste principal US. Livraison standard 5-10 jours ouvrables.'
) ON CONFLICT DO NOTHING;

-- Parfums exemples
INSERT INTO public.parfums (nom, maison, annee, concentration, genre, notes_tete, notes_coeur, notes_fond, description)
VALUES
(
  'Oud Wood',
  'Tom Ford',
  2007,
  'Eau de Parfum',
  'Mixte',
  ARRAY['Bois de Oud','Bois de rose','Cardamome'],
  ARRAY['Santal','Vétiver','Esparto'],
  ARRAY['Ambre','Tonka','Musc'],
  'Une composition boisée et fumée autour du bois d'oud, signature olfactive de Tom Ford Private Blend.'
),
(
  'Baccarat Rouge 540',
  'Maison Francis Kurkdjian',
  2015,
  'Extrait de Parfum',
  'Mixte',
  ARRAY['Safran','Jasmin'],
  ARRAY['Ambroxane','Cèdre'],
  ARRAY['Musc','Fève Tonka'],
  'Un floral ambré d'exception, devenu une référence mondiale de la parfumerie contemporaine.'
),
(
  'Portrait of a Lady',
  'Frédéric Malle',
  2010,
  'Eau de Parfum',
  'Féminin',
  ARRAY['Rose turque','Framboise'],
  ARRAY['Rose centifolia','Patchouli','Cannelle'],
  ARRAY['Musc','Santal','Encens'],
  'Un bouquet de roses royales rehaussé de patchouli et d'épices — opulent et indémodable.'
)
ON CONFLICT DO NOTHING;
