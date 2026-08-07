"use client";

import { useState } from "react";
import { useParfums, type Parfum } from "@/hooks/use-parfums";
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
import { Plus, Pencil, Trash2, FlaskConical } from "lucide-react";
import { slugify } from "@/lib/utils";

type Concentration =
  | "Extrait de Parfum"
  | "Eau de Parfum"
  | "Eau de Toilette"
  | "Eau de Cologne"
  | "Parfum Brut";
type Genre = "Masculin" | "Féminin" | "Mixte";

const CONCENTRATIONS: Concentration[] = [
  "Extrait de Parfum",
  "Eau de Parfum",
  "Eau de Toilette",
  "Eau de Cologne",
  "Parfum Brut",
];

const GENRES: Genre[] = ["Masculin", "Féminin", "Mixte"];

interface ParfumFormData {
  nom: string;
  maison: string;
  annee: string;
  concentration: Concentration;
  genre: Genre;
  notes_tete_raw: string;
  notes_coeur_raw: string;
  notes_fond_raw: string;
  description: string;
  actif: boolean;
}

function ParfumForm({
  initial,
  onSave,
  onClose,
}: {
  initial?: Partial<Parfum>;
  onSave: (data: ParfumFormData) => Promise<void>;
  onClose: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ParfumFormData>({
    nom: initial?.nom ?? "",
    maison: initial?.maison ?? "",
    annee: initial?.annee?.toString() ?? "",
    concentration: initial?.concentration ?? "Eau de Parfum",
    genre: initial?.genre ?? "Mixte",
    notes_tete_raw: initial?.notes_tete?.join(", ") ?? "",
    notes_coeur_raw: initial?.notes_coeur?.join(", ") ?? "",
    notes_fond_raw: initial?.notes_fond?.join(", ") ?? "",
    description: initial?.description ?? "",
    actif: initial?.actif ?? true,
  });

  const set = <K extends keyof ParfumFormData>(k: K, v: ParfumFormData[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom.trim() || !form.maison.trim()) return;
    setSubmitting(true);
    try {
      await onSave(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin pr-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1 space-y-1.5">
          <Label htmlFor="nom">Nom *</Label>
          <Input
            id="nom"
            placeholder="ex: Oud Wood"
            className="bg-muted/30"
            value={form.nom}
            onChange={(e) => set("nom", e.target.value)}
            required
          />
        </div>
        <div className="col-span-2 sm:col-span-1 space-y-1.5">
          <Label htmlFor="maison">Maison *</Label>
          <Input
            id="maison"
            placeholder="ex: Tom Ford"
            className="bg-muted/30"
            value={form.maison}
            onChange={(e) => set("maison", e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label>Concentration *</Label>
          <Select value={form.concentration} onValueChange={(v) => set("concentration", v as Concentration)}>
            <SelectTrigger className="bg-muted/30"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CONCENTRATIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Genre</Label>
          <Select value={form.genre} onValueChange={(v) => set("genre", v as Genre)}>
            <SelectTrigger className="bg-muted/30"><SelectValue /></SelectTrigger>
            <SelectContent>
              {GENRES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="annee">Année</Label>
          <Input
            id="annee"
            type="number"
            placeholder="ex: 2007"
            className="bg-muted/30"
            value={form.annee}
            onChange={(e) => set("annee", e.target.value)}
          />
        </div>

        {/* Notes olfactives */}
        <div className="col-span-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-medium">Pyramide olfactive</p>
          <div className="grid gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tete" className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> Notes de tête
              </Label>
              <Input
                id="tete"
                placeholder="ex: Bergamote, Citron"
                className="bg-muted/30"
                value={form.notes_tete_raw}
                onChange={(e) => set("notes_tete_raw", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="coeur" className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" /> Notes de cœur
              </Label>
              <Input
                id="coeur"
                placeholder="ex: Rose, Jasmin, Oud"
                className="bg-muted/30"
                value={form.notes_coeur_raw}
                onChange={(e) => set("notes_coeur_raw", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fond" className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-700 inline-block" /> Notes de fond
              </Label>
              <Input
                id="fond"
                placeholder="ex: Santal, Musc, Ambre"
                className="bg-muted/30"
                value={form.notes_fond_raw}
                onChange={(e) => set("notes_fond_raw", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            rows={3}
            placeholder="Description du parfum…"
            className="bg-muted/30 resize-none"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
        <Button type="submit" disabled={submitting || !form.nom.trim()} className="gradient-gold text-primary-foreground">
          {submitting ? "Sauvegarde…" : initial?.id ? "Modifier" : "Ajouter"}
        </Button>
      </div>
    </form>
  );
}

const GENRE_COLORS: Record<Genre, string> = {
  Masculin: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Féminin: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  Mixte: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

const CONC_SHORT: Record<Concentration, string> = {
  "Extrait de Parfum": "EDP Extrait",
  "Eau de Parfum": "EDP",
  "Eau de Toilette": "EDT",
  "Eau de Cologne": "EDC",
  "Parfum Brut": "Brut",
};

export function ParfumsManager() {
  const { parfums, loading, addParfum, updateParfum, deleteParfum } = useParfums();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Parfum | null>(null);
  const [search, setSearch] = useState("");

  const handleSave = async (data: ParfumFormData) => {
    const payload = {
      nom: data.nom,
      maison: data.maison,
      annee: data.annee ? parseInt(data.annee) : null,
      concentration: data.concentration,
      genre: data.genre,
      notes_tete: data.notes_tete_raw.split(",").map((n) => n.trim()).filter(Boolean),
      notes_coeur: data.notes_coeur_raw.split(",").map((n) => n.trim()).filter(Boolean),
      notes_fond: data.notes_fond_raw.split(",").map((n) => n.trim()).filter(Boolean),
      description: data.description || null,
      actif: data.actif,
      slug: slugify(`${data.maison}-${data.nom}`),
    };
    if (editing) {
      await updateParfum(editing.id, payload);
    } else {
      await addParfum(payload);
    }
    setOpen(false);
    setEditing(null);
  };

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) setEditing(null);
  };

  const filtered = parfums.filter(
    (p) =>
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.maison.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeInUp">
        <div>
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">Catalogue</p>
          <h1 className="text-3xl font-light">Parfums</h1>
          <p className="text-muted-foreground mt-1">
            {parfums.length} parfum{parfums.length !== 1 ? "s" : ""} enregistré{parfums.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48 bg-muted/30"
          />
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger>
              <Button
                className="gradient-gold text-primary-foreground gap-2 flex-shrink-0"
                onClick={() => setOpen(true)}
              >
                <Plus className="w-4 h-4" /> Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border/50 max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editing ? "Modifier le parfum" : "Ajouter un parfum"}</DialogTitle>
              </DialogHeader>
              <ParfumForm
                initial={editing ?? undefined}
                onSave={handleSave}
                onClose={() => handleOpenChange(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-card border border-border/50 animate-shimmer" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="bg-card border-border/50">
          <CardContent className="py-16 text-center">
            <FlaskConical className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun parfum trouvé.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeInUp">
          {filtered.map((p) => (
            <Card key={p.id} className="bg-card border-border/50 hover:border-gold/20 transition-all duration-200 group">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold text-foreground leading-tight truncate">{p.nom}</CardTitle>
                    <p className="text-xs text-gold mt-0.5 font-medium">{p.maison}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => { setEditing(p); setOpen(true); }}
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 hover:text-destructive"
                      onClick={() => deleteParfum(p.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`text-xs border ${GENRE_COLORS[p.genre]}`}>{p.genre}</Badge>
                  <Badge variant="secondary" className="text-xs">{CONC_SHORT[p.concentration]}</Badge>
                  {p.annee && <span className="text-xs text-muted-foreground">{p.annee}</span>}
                </div>
                <div className="space-y-1">
                  {p.notes_tete.length > 0 && (
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground leading-relaxed line-clamp-1">{p.notes_tete.join(" · ")}</span>
                    </div>
                  )}
                  {p.notes_coeur.length > 0 && (
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground leading-relaxed line-clamp-1">{p.notes_coeur.join(" · ")}</span>
                    </div>
                  )}
                  {p.notes_fond.length > 0 && (
                    <div className="flex items-start gap-1.5 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-700 mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground leading-relaxed line-clamp-1">{p.notes_fond.join(" · ")}</span>
                    </div>
                  )}
                </div>
                {p.description && (
                  <p className="text-xs text-muted-foreground/60 line-clamp-2 leading-relaxed">{p.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
