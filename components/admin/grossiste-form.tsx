"use client";

import { useState } from "react";
import { useGrossistes, type Grossiste } from "@/hooks/use-grossistes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Globe, Building2, List } from "lucide-react";
import { GrossisteCatalogueModal } from "./grossiste-catalogue-modal";

type Devise = "USD" | "EUR" | "GBP" | "CAD";

interface GrossisteFormData {
  nom: string;
  site_web: string;
  pays: string;
  devise: Devise;
  taux_change_cad: number;
  frais_livraison_fixe_cad: number;
  notes: string;
  actif: boolean;
}

function GrossisteForm({
  initial,
  onSave,
  onClose,
}: {
  initial?: Partial<Grossiste>;
  onSave: (data: GrossisteFormData) => Promise<void>;
  onClose: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<GrossisteFormData>({
    nom: initial?.nom ?? "",
    site_web: initial?.site_web ?? "",
    pays: initial?.pays ?? "France",
    devise: (initial?.devise as Devise) ?? "EUR",
    taux_change_cad: initial?.taux_change_cad ?? 1.48,
    frais_livraison_fixe_cad: initial?.frais_livraison_fixe_cad ?? 12.75,
    notes: initial?.notes ?? "",
    actif: initial?.actif ?? true,
  });

  const set = <K extends keyof GrossisteFormData>(k: K, v: GrossisteFormData[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom.trim()) return;
    setSubmitting(true);
    try {
      await onSave(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="nom">Nom du grossiste *</Label>
          <Input
            id="nom"
            placeholder="ex: Fragrancenet"
            className="bg-muted/30"
            value={form.nom}
            onChange={(e) => set("nom", e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="site_web">Site web</Label>
          <Input
            id="site_web"
            type="url"
            placeholder="https://..."
            className="bg-muted/30"
            value={form.site_web}
            onChange={(e) => set("site_web", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pays">Pays</Label>
          <Input
            id="pays"
            placeholder="États-Unis"
            className="bg-muted/30"
            value={form.pays}
            onChange={(e) => set("pays", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Devise</Label>
          <Select value={form.devise} onValueChange={(v) => set("devise", v as Devise)}>
            <SelectTrigger className="bg-muted/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD — Dollar américain</SelectItem>
              <SelectItem value="EUR">EUR — Euro</SelectItem>
              <SelectItem value="GBP">GBP — Livre sterling</SelectItem>
              <SelectItem value="CAD">CAD — Dollar canadien</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="taux">Taux de change → CAD</Label>
          <Input
            id="taux"
            type="number"
            step="0.0001"
            className="bg-muted/30"
            value={form.taux_change_cad}
            onChange={(e) => set("taux_change_cad", parseFloat(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">1 {form.devise} = X CAD</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="frais">Frais livraison (CAD / flacon)</Label>
          <Input
            id="frais"
            type="number"
            step="0.01"
            className="bg-muted/30"
            value={form.frais_livraison_fixe_cad}
            onChange={(e) => set("frais_livraison_fixe_cad", parseFloat(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">Par défaut 12,75 $</p>
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            rows={3}
            placeholder="Délais de livraison, conditions, etc."
            className="bg-muted/30 resize-none"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
        <Button
          type="submit"
          disabled={submitting || !form.nom.trim()}
          className="gradient-gold text-primary-foreground"
        >
          {submitting ? "Sauvegarde…" : initial?.id ? "Modifier" : "Ajouter"}
        </Button>
      </div>
    </form>
  );
}

export function GrossistesManager() {
  const { grossistes, loading, addGrossiste, updateGrossiste, deleteGrossiste } = useGrossistes();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Grossiste | null>(null);
  const [catalogueGrossiste, setCatalogueGrossiste] = useState<Grossiste | null>(null);

  const handleSave = async (data: GrossisteFormData) => {
    if (editing) {
      await updateGrossiste(editing.id, {
        ...data,
        site_web: data.site_web || null,
        notes: data.notes || null,
      });
    } else {
      await addGrossiste({
        ...data,
        site_web: data.site_web || null,
        notes: data.notes || null,
      });
    }
    setOpen(false);
    setEditing(null);
  };

  const handleEdit = (g: Grossiste) => {
    setEditing(g);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce grossiste ?")) return;
    await deleteGrossiste(id);
  };

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) setEditing(null);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fadeInUp">
        <div>
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">Admin</p>
          <h1 className="text-3xl font-light text-foreground">Grossistes</h1>
          <p className="text-muted-foreground mt-1">Gérez vos fournisseurs de parfums.</p>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger>
            <Button
              className="gradient-gold text-primary-foreground gap-2"
              onClick={() => setOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border/50 max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Modifier le grossiste" : "Ajouter un grossiste"}
              </DialogTitle>
            </DialogHeader>
            <GrossisteForm
              initial={editing ?? undefined}
              onSave={handleSave}
              onClose={() => handleOpenChange(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-card border border-border/50 animate-shimmer" />
          ))}
        </div>
      ) : grossistes.length === 0 ? (
        <Card className="bg-card border-border/50">
          <CardContent className="py-16 text-center">
            <Building2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun grossiste enregistré.</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Ajoutez votre premier fournisseur.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 animate-fadeInUp">
          {grossistes.map((g) => (
            <Card key={g.id} className="bg-card border-border/50 hover:border-gold/20 transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-medium text-foreground flex items-center gap-2 flex-wrap">
                      {g.nom}
                      {!g.actif && <Badge variant="secondary" className="text-xs">Inactif</Badge>}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">{g.pays} · {g.devise}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEdit(g)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 hover:text-destructive"
                      onClick={() => handleDelete(g.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Taux de change</p>
                    <p className="text-foreground font-medium">1 {g.devise} = {g.taux_change_cad.toFixed(4)} CAD</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Frais livraison</p>
                    <p className="text-foreground font-medium">{g.frais_livraison_fixe_cad.toFixed(2)} $ / flacon</p>
                  </div>
                </div>
                {g.site_web && (
                  <a
                    href={g.site_web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-1 text-xs text-gold hover:text-gold/80 transition-colors"
                  >
                    <Globe className="w-3 h-3" />
                    {new URL(g.site_web).hostname}
                  </a>
                )}
                {g.notes && (
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">{g.notes}</p>
                )}
                <div className="mt-4 border-t border-border/30 pt-3">
                  <Button size="sm" variant="outline" className="w-full text-xs gap-2" onClick={() => setCatalogueGrossiste(g)}>
                    <List className="w-3.5 h-3.5" /> Gérer le catalogue
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <GrossisteCatalogueModal 
        open={!!catalogueGrossiste} 
        onOpenChange={(v) => !v && setCatalogueGrossiste(null)}
        grossiste={catalogueGrossiste}
      />
    </div>
  );
}
