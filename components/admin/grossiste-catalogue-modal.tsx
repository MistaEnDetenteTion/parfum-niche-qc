"use client";

import { useState, useEffect, useCallback } from "react";
import { type CatalogueItem, getCatalogueGrossiste, upsertCatalogueItem, deleteCatalogueItem } from "@/app/actions/catalogue";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useParfums } from "@/hooks/use-parfums";
import { Trash2, Plus, RefreshCw } from "lucide-react";

export function GrossisteCatalogueModal({
  open,
  onOpenChange,
  grossiste,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  grossiste: any | null;
}) {
  const { parfums } = useParfums();
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Formulaire d'ajout
  const [parfumId, setParfumId] = useState("");
  const [volume, setVolume] = useState("100");
  const [prix, setPrix] = useState("");
  const [moq, setMoq] = useState("1");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCatalogue = useCallback(async () => {
    if (!grossiste) return;
    setLoading(true);
    try {
      const data = await getCatalogueGrossiste(grossiste.id);
      setItems(data);
    } catch (e: any) {
      console.error(e);
    }
    setLoading(false);
  }, [grossiste]);

  useEffect(() => {
    if (open && grossiste) {
      fetchCatalogue();
    }
  }, [open, grossiste, fetchCatalogue]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grossiste || !parfumId || !prix || !volume) return;
    setSubmitting(true);
    try {
      await upsertCatalogueItem({
        grossiste_id: grossiste.id,
        parfum_id: parfumId,
        volume_flacon_ml: parseFloat(volume),
        prix_achat_devise: parseFloat(prix),
        moq: parseInt(moq) || 1,
        notes: notes || null,
      });
      // Reset form
      setParfumId("");
      setPrix("");
      setMoq("1");
      setNotes("");
      await fetchCatalogue();
    } catch (e: any) {
      alert("Erreur lors de l'ajout : " + e.message);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous retirer ce parfum du catalogue ?")) return;
    try {
      await deleteCatalogueItem(id);
      await fetchCatalogue();
    } catch (e: any) {
      alert("Erreur lors de la suppression : " + e.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/50 max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Catalogue : {grossiste?.nom}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Devise utilisée : {grossiste?.devise}</p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Liste des parfums du catalogue */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-foreground flex items-center justify-between">
              Parfums proposés par ce grossiste
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={fetchCatalogue} disabled={loading}>
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </h3>
            
            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-4">Chargement...</p>
            ) : items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">Ce grossiste n&apos;a aucun parfum dans son catalogue.</p>
            ) : (
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div>
                      <p className="text-sm font-medium">{item.parfum?.maison} - {item.parfum?.nom}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.volume_flacon_ml} ml · <span className="text-gold font-semibold">{item.prix_achat_devise} {grossiste?.devise}</span>
                        {item.moq > 1 && ` · Min. ${item.moq}`}
                      </p>
                      {item.notes && <p className="text-[10px] text-muted-foreground mt-1 opacity-70">Notes: {item.notes}</p>}
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-400/10" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Formulaire d'ajout */}
          <div>
            <h3 className="font-medium text-sm text-foreground mb-4">Ajouter un parfum au catalogue</h3>
            <form onSubmit={handleAddItem} className="space-y-4 bg-muted/10 p-4 rounded-xl border border-border/30">
              <div className="space-y-1.5">
                <Label>Parfum *</Label>
                <Select value={parfumId} onValueChange={(v) => setParfumId(v as string)}>
                  <SelectTrigger className="bg-muted/30"><SelectValue placeholder="Sélectionner le parfum" /></SelectTrigger>
                  <SelectContent>
                    {parfums.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.maison} - {p.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Volume (ml) *</Label>
                  <Input type="number" step="0.5" value={volume} onChange={(e) => setVolume(e.target.value)} className="bg-muted/30" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Prix ({grossiste?.devise}) *</Label>
                  <Input type="number" step="0.01" value={prix} onChange={(e) => setPrix(e.target.value)} className="bg-muted/30" required />
                </div>
                <div className="space-y-1.5">
                  <Label>MOQ (Min. Order)</Label>
                  <Input type="number" value={moq} onChange={(e) => setMoq(e.target.value)} className="bg-muted/30" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Notes sur ce produit</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-muted/30" placeholder="Ex: Doit être commandé en pack, rupture fréquente..." />
              </div>

              <Button type="submit" disabled={submitting || !parfumId || !prix || !volume} className="w-full gradient-gold text-primary-foreground gap-2">
                <Plus className="w-4 h-4" /> {submitting ? "Ajout..." : "Ajouter au catalogue"}
              </Button>
            </form>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
