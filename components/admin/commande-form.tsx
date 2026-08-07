"use client";

import { useState } from "react";
import { useCommandes, type LotCommandeAvecDetails, type LotParfum, type ParametreDecant } from "@/hooks/use-commandes";
import { useGrossistes } from "@/hooks/use-grossistes";
import { useParfums } from "@/hooks/use-parfums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  TruckIcon,
  CheckCircle,
  XCircle,
  Clock,
  Info,
  Trash2,
} from "lucide-react";
import { formatCAD, STATUT_LOT_CONFIG } from "@/lib/utils";

type StatutLot = "en_attente" | "commande" | "recu" | "annule";
type Devise = "USD" | "EUR" | "GBP" | "CAD";

const STATUT_ICONS: Record<StatutLot, React.ElementType> = {
  en_attente: Clock,
  commande: TruckIcon,
  recu: CheckCircle,
  annule: XCircle,
};

/* ——— Formulaire Nouveau Lot ——— */
function NouveauLotForm({
  onSave,
  onClose,
}: {
  onSave: (data: { grossiste_id: string; reference: string; date_commande: string; notes?: string }) => Promise<void>;
  onClose: () => void;
}) {
  const { grossistes } = useGrossistes();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    grossiste_id: "",
    reference: "",
    date_commande: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.grossiste_id || !form.reference) return;
    setSubmitting(true);
    try {
      await onSave({ ...form, notes: form.notes || undefined });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Grossiste *</Label>
        <Select onValueChange={(v: string | null) => setForm((p) => ({ ...p, grossiste_id: v ?? "" }))}>

          <SelectTrigger className="bg-muted/30">
            <SelectValue placeholder="Choisir un grossiste" />
          </SelectTrigger>
          <SelectContent>
            {grossistes.map((g) => (
              <SelectItem key={g.id} value={g.id}>{g.nom} ({g.devise})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Référence *</Label>
          <Input
            placeholder="ex: LOT-2025-01"
            className="bg-muted/30"
            value={form.reference}
            onChange={(e) => setForm((p) => ({ ...p, reference: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label>Date de commande</Label>
          <Input
            type="date"
            className="bg-muted/30"
            value={form.date_commande}
            onChange={(e) => setForm((p) => ({ ...p, date_commande: e.target.value }))}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Notes</Label>
        <Textarea
          rows={2}
          placeholder="Numéro de tracking…"
          className="bg-muted/30 resize-none"
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
        <Button
          type="submit"
          disabled={submitting || !form.grossiste_id || !form.reference}
          className="gradient-gold text-primary-foreground"
        >
          {submitting ? "Création…" : "Créer le lot"}
        </Button>
      </div>
    </form>
  );
}

/* ——— Formulaire Ajouter Ligne Parfum ——— */
function AjouterLigneForm({
  lotId,
  devise: defaultDevise,
  onSave,
  onClose,
}: {
  lotId: string;
  devise: string;
  onSave: (data: {
    lot_id: string;
    parfum_id: string;
    volume_flacon_ml: number;
    quantite_flacons: number;
    prix_achat_devise: number;
    devise: Devise;
  }) => Promise<void>;
  onClose: () => void;
}) {
  const { parfums } = useParfums();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    parfum_id: "",
    volume_flacon_ml: "100",
    quantite_flacons: "1",
    prix_achat_devise: "",
    devise: defaultDevise as Devise,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.parfum_id || !form.prix_achat_devise) return;
    setSubmitting(true);
    try {
      await onSave({
        lot_id: lotId,
        parfum_id: form.parfum_id,
        volume_flacon_ml: parseFloat(form.volume_flacon_ml),
        quantite_flacons: parseInt(form.quantite_flacons),
        prix_achat_devise: parseFloat(form.prix_achat_devise),
        devise: form.devise,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Parfum *</Label>
        <Select onValueChange={(v: string | null) => setForm((p) => ({ ...p, parfum_id: v ?? "" }))}>

          <SelectTrigger className="bg-muted/30">
            <SelectValue placeholder="Choisir un parfum" />
          </SelectTrigger>
          <SelectContent>
            {parfums.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.maison} — {p.nom}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label>Volume (ml)</Label>
          <Input
            type="number"
            step="0.1"
            className="bg-muted/30"
            value={form.volume_flacon_ml}
            onChange={(e) => setForm((p) => ({ ...p, volume_flacon_ml: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Quantité</Label>
          <Input
            type="number"
            min="1"
            className="bg-muted/30"
            value={form.quantite_flacons}
            onChange={(e) => setForm((p) => ({ ...p, quantite_flacons: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Devise</Label>
          <Select value={form.devise} onValueChange={(v) => setForm((p) => ({ ...p, devise: v as Devise }))}>
            <SelectTrigger className="bg-muted/30"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["USD", "EUR", "GBP", "CAD"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Prix d&apos;achat / flacon ({form.devise})</Label>
        <Input
          type="number"
          step="0.01"
          placeholder="0.00"
          className="bg-muted/30"
          value={form.prix_achat_devise}
          onChange={(e) => setForm((p) => ({ ...p, prix_achat_devise: e.target.value }))}
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
        <Button
          type="submit"
          disabled={submitting || !form.parfum_id || !form.prix_achat_devise}
          className="gradient-gold text-primary-foreground"
        >
          {submitting ? "Ajout…" : "Ajouter"}
        </Button>
      </div>
    </form>
  );
}

/* ——— Formulaire Paramètres Décants ——— */
function DecantParamsForm({
  lotParfumId,
  initial,
  coutRevientMl,
  volumeFlaconMl,
  onSave,
}: {
  lotParfumId: string;
  initial?: Partial<ParametreDecant>;
  coutRevientMl: number;
  volumeFlaconMl: number;
  onSave: (data: {
    lot_parfum_id: string;
    volume_decant_ml: number;
    multiplicateur_decant: number;
    multiplicateur_flacon_entier: number;
    prix_boutique_barre_cad?: number;
  }) => Promise<void>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    volume_decant_ml: initial?.volume_decant_ml ?? 10,
    multiplicateur_decant: initial?.multiplicateur_decant ?? 2.5,
    multiplicateur_flacon_entier: initial?.multiplicateur_flacon_entier ?? 2.0,
    prix_boutique_barre_cad: initial?.prix_boutique_barre_cad ?? 0,
  });

  const prixDecant = coutRevientMl * form.volume_decant_ml * form.multiplicateur_decant;
  const prixFlacon = coutRevientMl * volumeFlaconMl * form.multiplicateur_flacon_entier;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave({
        lot_parfum_id: lotParfumId,
        volume_decant_ml: form.volume_decant_ml,
        multiplicateur_decant: form.multiplicateur_decant,
        multiplicateur_flacon_entier: form.multiplicateur_flacon_entier,
        prix_boutique_barre_cad: form.prix_boutique_barre_cad || undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Vol. décant (ml)</Label>
          <Input
            type="number"
            step="0.5"
            className="bg-muted/30 h-8 text-sm"
            value={form.volume_decant_ml}
            onChange={(e) => setForm((p) => ({ ...p, volume_decant_ml: parseFloat(e.target.value) }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Mult. décant</Label>
          <Input
            type="number"
            step="0.1"
            className="bg-muted/30 h-8 text-sm"
            value={form.multiplicateur_decant}
            onChange={(e) => setForm((p) => ({ ...p, multiplicateur_decant: parseFloat(e.target.value) }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Mult. flacon</Label>
          <Input
            type="number"
            step="0.1"
            className="bg-muted/30 h-8 text-sm"
            value={form.multiplicateur_flacon_entier}
            onChange={(e) => setForm((p) => ({ ...p, multiplicateur_flacon_entier: parseFloat(e.target.value) }))}
          />
        </div>
        <div className="col-span-3 space-y-1.5">
          <Label className="text-xs">Prix boutique barré (CAD, optionnel)</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="ex: 350.00"
            className="bg-muted/30 h-8 text-sm"
            value={form.prix_boutique_barre_cad || ""}
            onChange={(e) => setForm((p) => ({ ...p, prix_boutique_barre_cad: parseFloat(e.target.value) || 0 }))}
          />
        </div>
      </div>

      {coutRevientMl > 0 && (
        <div className="bg-gold-muted rounded-lg p-3 space-y-1">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Aperçu prix de vente</p>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Décant {form.volume_decant_ml} ml</span>
            <span className="text-gold font-semibold">{formatCAD(prixDecant)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Flacon {volumeFlaconMl} ml</span>
            <span className="text-gold font-semibold">{formatCAD(prixFlacon)}</span>
          </div>
        </div>
      )}

      <Button
        type="submit"
        size="sm"
        disabled={submitting}
        className="w-full gradient-gold text-primary-foreground text-xs"
      >
        {submitting ? "Sauvegarde…" : "Sauvegarder paramètres"}
      </Button>
    </form>
  );
}

/* ——— Carte Lot ——— */
function LotCard({
  lot,
  onStatutChange,
  onAddLigne,
  onSaveDecant,
  onDelete,
}: {
  lot: LotCommandeAvecDetails;
  onStatutChange: (id: string, s: StatutLot, date?: string) => Promise<void>;
  onAddLigne: (data: {
    lot_id: string;
    parfum_id: string;
    volume_flacon_ml: number;
    quantite_flacons: number;
    prix_achat_devise: number;
    devise: Devise;
  }) => Promise<void>;
  onSaveDecant: (data: {
    lot_parfum_id: string;
    volume_decant_ml: number;
    multiplicateur_decant: number;
    multiplicateur_flacon_entier: number;
    prix_boutique_barre_cad?: number;
  }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [ligneOpen, setLigneOpen] = useState(false);
  const cfg = STATUT_LOT_CONFIG[lot.statut as StatutLot];
  const StatutIcon = STATUT_ICONS[lot.statut as StatutLot];

  return (
    <Card className="bg-card border-border/50 hover:border-gold/15 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base font-medium">{lot.reference}</CardTitle>
              <Badge className={`text-xs border ${cfg?.color ?? ""} ${cfg?.bg ?? ""}`}>
                {StatutIcon && <StatutIcon className="w-3 h-3 mr-1" />}
                {cfg?.label ?? lot.statut}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {lot.grossiste?.nom} · {new Date(lot.date_commande).toLocaleDateString("fr-CA")}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {lot.statut === "en_attente" && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
                onClick={() => onStatutChange(lot.id, "commande")}
              >
                <TruckIcon className="w-3 h-3 mr-1" /> Commander
              </Button>
            )}
            {lot.statut === "commande" && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10"
                onClick={() => onStatutChange(lot.id, "recu", new Date().toISOString().split("T")[0])}
              >
                <CheckCircle className="w-3 h-3 mr-1" /> Reçu
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
              onClick={() => {
                if (confirm("Supprimer ce lot de commande définitivement ?")) {
                  onDelete(lot.id);
                }
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          <Separator className="mb-4" />
          <div className="space-y-4">
            {(!lot.lot_parfums || lot.lot_parfums.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">Aucun parfum dans ce lot.</p>
            )}
            {lot.lot_parfums?.map((lp) => {
              const pd = lp.parametres_decants?.[0];
              return (
                <div key={lp.id} className="glass rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {lp.parfum?.maison} — {lp.parfum?.nom}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lp.quantite_flacons} × {lp.volume_flacon_ml} ml · {lp.prix_achat_devise.toFixed(2)} {lp.devise}/flacon
                      </p>
                    </div>
                    {lp.cout_revient_cad_ml && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Coût de revient</p>
                        <p className="text-sm font-semibold text-gold">{formatCAD(lp.cout_revient_cad_ml)}/ml</p>
                      </div>
                    )}
                  </div>

                  {lp.prix_achat_cad_ml && (
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-background/50 rounded p-2">
                        <p className="text-muted-foreground">Achat CAD/ml</p>
                        <p className="font-medium mt-0.5">{formatCAD(lp.prix_achat_cad_ml)}</p>
                      </div>
                      <div className="bg-background/50 rounded p-2">
                        <p className="text-muted-foreground">Livraison CAD/ml</p>
                        <p className="font-medium mt-0.5">{formatCAD(lp.frais_expedition_cad_ml)}</p>
                      </div>
                      <div className="bg-gold-muted rounded p-2 border border-gold/20">
                        <p className="text-muted-foreground">Total CAD/ml</p>
                        <p className="font-semibold text-gold mt-0.5">{formatCAD(lp.cout_revient_cad_ml)}</p>
                      </div>
                    </div>
                  )}

                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Paramètres de vente</p>
                    <DecantParamsForm
                      lotParfumId={lp.id}
                      initial={pd}
                      coutRevientMl={lp.cout_revient_cad_ml ?? 0}
                      volumeFlaconMl={lp.volume_flacon_ml}
                      onSave={onSaveDecant}
                    />
                  </div>

                  {pd && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-2">
                        <p className="text-muted-foreground">Prix décant {pd.volume_decant_ml} ml</p>
                        <p className="text-emerald-400 font-bold text-base">{formatCAD(pd.prix_vente_decant_cad)}</p>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded p-2">
                        <p className="text-muted-foreground">Prix flacon {lp.volume_flacon_ml} ml</p>
                        <p className="text-blue-400 font-bold text-base">{formatCAD(pd.prix_vente_flacon_cad)}</p>
                        {pd.prix_boutique_barre_cad && (
                          <p className="line-through text-muted-foreground text-xs mt-0.5">
                            Boutique: {formatCAD(pd.prix_boutique_barre_cad)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {lot.statut !== "recu" && lot.statut !== "annule" && (
            <Dialog open={ligneOpen} onOpenChange={setLigneOpen}>
              <DialogTrigger>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4 gap-2 border-gold/20 text-gold hover:bg-gold/10"
                  onClick={() => setLigneOpen(true)}
                >
                  <Plus className="w-3.5 h-3.5" /> Ajouter un parfum
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border/50">
                <DialogHeader>
                  <DialogTitle>Ajouter un parfum au lot</DialogTitle>
                </DialogHeader>
                <AjouterLigneForm
                  lotId={lot.id}
                  devise={lot.grossiste?.devise ?? "USD"}
                  onSave={async (d) => { await onAddLigne(d); setLigneOpen(false); }}
                  onClose={() => setLigneOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      )}
    </Card>
  );
}

/* ——— Manager principal ——— */
export function CommandesManager() {
  const { commandes, loading, addLot, updateLotStatut, addLotParfum, upsertParametresDecant, deleteLot } = useCommandes();
  const [open, setOpen] = useState(false);
  const [filtre, setFiltre] = useState<StatutLot | "tous">("tous");

  const filtered = filtre === "tous" ? commandes : commandes.filter((c) => c.statut === filtre);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeInUp">
        <div>
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">Achats</p>
          <h1 className="text-3xl font-light">Lots de commande</h1>
          <p className="text-muted-foreground mt-1">
            {commandes.length} lot{commandes.length !== 1 ? "s" : ""} enregistré{commandes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="gradient-gold text-primary-foreground gap-2" onClick={() => setOpen(true)}>
              <Plus className="w-4 h-4" /> Nouveau lot
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border/50">
            <DialogHeader><DialogTitle>Créer un nouveau lot</DialogTitle></DialogHeader>
            <NouveauLotForm
              onSave={async (d) => { await addLot(d); setOpen(false); }}
              onClose={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 animate-fadeInUp">
        {(["tous", "en_attente", "commande", "recu", "annule"] as const).map((s) => (
          <Button
            key={s}
            size="sm"
            variant={filtre === s ? "default" : "outline"}
            className={filtre === s ? "gradient-gold text-primary-foreground" : "border-border/50"}
            onClick={() => setFiltre(s)}
          >
            {s === "tous" ? "Tous" : STATUT_LOT_CONFIG[s as StatutLot]?.label ?? s}
            <span className="ml-1.5 text-xs opacity-70">
              {s === "tous" ? commandes.length : commandes.filter((c) => c.statut === s).length}
            </span>
          </Button>
        ))}
      </div>

      {/* Liste */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-card border border-border/50 animate-shimmer" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="bg-card border-border/50">
          <CardContent className="py-16 text-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun lot dans cette catégorie.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 animate-fadeInUp">
          {filtered.map((lot) => (
            <LotCard
              key={lot.id}
              lot={lot}
              onStatutChange={updateLotStatut}
              onAddLigne={addLotParfum}
              onSaveDecant={upsertParametresDecant}
              onDelete={deleteLot}
            />
          ))}
        </div>
      )}
    </div>
  );
}
