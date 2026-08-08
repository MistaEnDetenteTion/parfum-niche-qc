-- ============================================================
-- PARFUM NICHE QC — Catalogue Grossistes
-- ============================================================

CREATE TABLE IF NOT EXISTS public.grossiste_catalogue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grossiste_id UUID NOT NULL REFERENCES public.grossistes(id) ON DELETE CASCADE,
    parfum_id UUID NOT NULL REFERENCES public.parfums(id) ON DELETE CASCADE,
    volume_flacon_ml NUMERIC(8, 2) NOT NULL DEFAULT 100.0,
    prix_achat_devise NUMERIC(10, 4) NOT NULL,
    moq INT DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(grossiste_id, parfum_id, volume_flacon_ml)
);

COMMENT ON TABLE public.grossiste_catalogue IS 'Catalogue de parfums vendus par chaque grossiste';

-- RLS
ALTER TABLE public.grossiste_catalogue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on grossiste_catalogue"
    ON public.grossiste_catalogue FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Trigger: updated_at
CREATE OR REPLACE TRIGGER trg_grossiste_catalogue_updated_at
BEFORE UPDATE ON public.grossiste_catalogue
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Vue utilitaire pour le comparateur
CREATE OR REPLACE VIEW public.vue_comparateur_prix AS
SELECT 
    gc.id AS catalogue_id,
    p.id AS parfum_id,
    p.nom AS parfum_nom,
    p.maison,
    p.prix_boutique_formats,
    gc.volume_flacon_ml,
    g.id AS grossiste_id,
    g.nom AS grossiste_nom,
    g.devise,
    g.taux_change_cad,
    g.frais_livraison_fixe_cad,
    gc.prix_achat_devise,
    gc.moq,
    gc.notes,
    -- Calculs CAD
    (gc.prix_achat_devise / gc.volume_flacon_ml) * g.taux_change_cad AS prix_achat_cad_ml,
    (g.frais_livraison_fixe_cad / gc.volume_flacon_ml) AS frais_expedition_cad_ml,
    ((gc.prix_achat_devise / gc.volume_flacon_ml) * g.taux_change_cad) + (g.frais_livraison_fixe_cad / gc.volume_flacon_ml) AS cout_revient_cad_ml
FROM 
    public.grossiste_catalogue gc
JOIN 
    public.parfums p ON p.id = gc.parfum_id
JOIN 
    public.grossistes g ON g.id = gc.grossiste_id
WHERE 
    p.actif = TRUE AND g.actif = TRUE;
