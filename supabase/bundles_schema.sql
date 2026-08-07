-- ============================================================
-- PARFUM NICHE QC — Lots Précomposés (Packs Grossistes)
-- ============================================================

-- 1. Table principale pour les packs
CREATE TABLE IF NOT EXISTS public.grossiste_bundles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grossiste_id UUID NOT NULL REFERENCES public.grossistes(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    prix_global_devise NUMERIC(10, 4) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.grossiste_bundles IS 'Packs ou lots précomposés vendus par un grossiste à un prix global';

-- 2. Table pour le contenu de chaque pack (les parfums)
CREATE TABLE IF NOT EXISTS public.grossiste_bundle_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bundle_id UUID NOT NULL REFERENCES public.grossiste_bundles(id) ON DELETE CASCADE,
    parfum_id UUID NOT NULL REFERENCES public.parfums(id) ON DELETE CASCADE,
    volume_flacon_ml NUMERIC(8, 2) NOT NULL DEFAULT 100.0,
    quantite INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(bundle_id, parfum_id, volume_flacon_ml)
);

COMMENT ON TABLE public.grossiste_bundle_items IS 'Parfums individuels inclus dans un pack grossiste';

-- RLS
ALTER TABLE public.grossiste_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grossiste_bundle_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on grossiste_bundles"
    ON public.grossiste_bundles FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access on grossiste_bundle_items"
    ON public.grossiste_bundle_items FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Trigger: updated_at
CREATE OR REPLACE TRIGGER trg_grossiste_bundles_updated_at
BEFORE UPDATE ON public.grossiste_bundles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Vue utilitaire pour le comparateur (Calcul du coût moyen par ml d'un bundle)
CREATE OR REPLACE VIEW public.vue_comparateur_bundles AS
WITH bundle_stats AS (
    -- Calculer le volume total et le nombre de flacons dans le bundle
    SELECT 
        bi.bundle_id,
        SUM(bi.volume_flacon_ml * bi.quantite) AS volume_total_ml,
        SUM(bi.quantite) AS total_flacons,
        array_agg(bi.parfum_id) AS parfum_ids -- Pour savoir si un bundle contient un parfum recherché
    FROM 
        public.grossiste_bundle_items bi
    GROUP BY 
        bi.bundle_id
)
SELECT 
    b.id AS bundle_id,
    b.nom AS bundle_nom,
    b.prix_global_devise,
    b.notes,
    g.id AS grossiste_id,
    g.nom AS grossiste_nom,
    g.devise,
    g.taux_change_cad,
    g.frais_livraison_fixe_cad,
    bs.volume_total_ml,
    bs.total_flacons,
    bs.parfum_ids,
    -- Calculs CAD pour le bundle ENTIER
    (b.prix_global_devise * g.taux_change_cad) AS prix_achat_total_cad,
    (g.frais_livraison_fixe_cad * bs.total_flacons) AS frais_expedition_total_cad,
    ((b.prix_global_devise * g.taux_change_cad) + (g.frais_livraison_fixe_cad * bs.total_flacons)) AS cout_revient_total_cad,
    -- Coût moyen au ml du bundle
    CASE WHEN bs.volume_total_ml > 0 
        THEN ((b.prix_global_devise * g.taux_change_cad) + (g.frais_livraison_fixe_cad * bs.total_flacons)) / bs.volume_total_ml 
        ELSE 0 
    END AS cout_moyen_cad_ml
FROM 
    public.grossiste_bundles b
JOIN 
    public.grossistes g ON g.id = b.grossiste_id
LEFT JOIN 
    bundle_stats bs ON bs.bundle_id = b.id
WHERE 
    g.actif = TRUE;
