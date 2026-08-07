-- PARFUM NICHE QC — Module CRM (Clients & Ventes)

-- 1. Table Clients
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prenom TEXT NOT NULL,
    nom TEXT NOT NULL,
    handle_social TEXT,
    source_acquisition TEXT,
    preferences_olfactives TEXT[] DEFAULT '{}',
    notes_privees TEXT,
    parrain_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.clients IS 'Table CRM des clients';

-- 2. Table Ventes (Orders)
CREATE TABLE IF NOT EXISTS public.ventes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    parfum_id UUID REFERENCES public.parfums(id) ON DELETE SET NULL,
    type_achat TEXT NOT NULL CHECK (type_achat IN ('decant_10ml', 'decant_5ml', 'full_bottle', 'autre')),
    montant_cad NUMERIC(10, 2) NOT NULL DEFAULT 0,
    date_achat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.ventes IS 'Historique des achats par client';

-- 3. RLS Policies
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin write on clients"
    ON public.clients FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin write on ventes"
    ON public.ventes FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 4. Triggers pour updated_at (optionnel mais recommandé)
-- (On réutilise la fonction handle_updated_at déjà existante)
-- CREATE TRIGGER trg_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
-- CREATE TRIGGER trg_ventes_updated_at BEFORE UPDATE ON public.ventes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. Helper Views pour le CRM (LTV, Dernier Achat, Parrainages)
CREATE OR REPLACE VIEW public.vue_crm_clients AS
SELECT 
    c.id,
    c.prenom,
    c.nom,
    c.handle_social,
    c.source_acquisition,
    c.preferences_olfactives,
    c.notes_privees,
    c.parrain_id,
    c.created_at,
    COALESCE(SUM(v.montant_cad), 0) AS ltv_cad,
    MAX(v.date_achat) AS dernier_achat,
    (SELECT COUNT(*) FROM public.clients c2 WHERE c2.parrain_id = c.id) AS nb_filleuls
FROM 
    public.clients c
LEFT JOIN 
    public.ventes v ON c.id = v.client_id
GROUP BY 
    c.id;
