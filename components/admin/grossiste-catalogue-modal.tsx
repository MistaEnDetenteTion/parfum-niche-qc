"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  type CatalogueItem, 
  getCatalogueGrossiste, 
  upsertCatalogueItem, 
  deleteCatalogueItem,
  type Bundle,
  getBundles,
  upsertBundle,
  deleteBundle,
  upsertBundleItem,
  deleteBundleItem
} from "@/app/actions/catalogue";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParfums } from "@/hooks/use-parfums";
import { Trash2, Plus, RefreshCw, Package } from "lucide-react";

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
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Formulaire d'ajout unitaire
  const [parfumId, setParfumId] = useState("");
  const [volume, setVolume] = useState("100");
  const [prix, setPrix] = useState("");
  const [moq, setMoq] = useState("1");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Formulaire d'ajout bundle
  const [bundleNom, setBundleNom] = useState("");
  const [bundlePrix, setBundlePrix] = useState("");
  const [bundleNotes, setBundleNotes] = useState("");
  const [bundleSubmitting, setBundleSubmitting] = useState(false);

  // Formulaire d'ajout item dans bundle
  const [itemBundleId, setItemBundleId] = useState("");
  const [itemParfumId, setItemParfumId] = useState("");
  const [itemVolume, setItemVolume] = useState("100");
  const [itemQuantite, setItemQuantite] = useState("1");

  const fetchData = useCallback(async () => {
    if (!grossiste) return;
    setLoading(true);
    try {
      const dataItems = await getCatalogueGrossiste(grossiste.id);
      setItems(dataItems);
      const dataBundles = await getBundles(grossiste.id);
      setBundles(dataBundles);
    } catch (e: any) {
      console.error(e);
    }
    setLoading(false);
  }, [grossiste]);

  useEffect(() => {
    if (open && grossiste) {
      fetchData();
    }
  }, [open, grossiste, fetchData]);

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
      setParfumId("");
      setPrix("");
      setMoq("1");
      setNotes("");
      await fetchData();
    } catch (e: any) {
      alert("Erreur : " + e.message);
    }
    setSubmitting(false);
  };

  const handleAddBundle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grossiste || !bundleNom || !bundlePrix) return;
    setBundleSubmitting(true);
    try {
      await upsertBundle({
        grossiste_id: grossiste.id,
        nom: bundleNom,
        prix_global_devise: parseFloat(bundlePrix),
        notes: bundleNotes || null,
      });
      setBundleNom("");
      setBundlePrix("");
      setBundleNotes("");
      await fetchData();
    } catch (e: any) {
      alert("Erreur : " + e.message);
    }
    setBundleSubmitting(false);
  };

  const handleAddBundleItem = async (e: React.FormEvent, bundleId: string) => {
    e.preventDefault();
    if (!itemParfumId || !itemVolume || !itemQuantite) return;
    try {
      await upsertBundleItem({
        bundle_id: bundleId,
        parfum_id: itemParfumId,
        volume_flacon_ml: parseFloat(itemVolume),
        quantite: parseInt(itemQuantite) || 1,
      });
      setItemBundleId("");
      setItemParfumId("");
      setItemVolume("100");
      setItemQuantite("1");
      await fetchData();
    } catch (e: any) {
      alert("Erreur : " + e.message);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Retirer ce parfum du catalogue ?")) return;
    try {
      await deleteCatalogueItem(id);
      await fetchData();
    } catch (e: any) {
      alert("Erreur : " + e.message);
    }
  };

  const handleDeleteBundle = async (id: string) => {
    if (!confirm("Supprimer ce pack entièrement ?")) return;
    try {
      await deleteBundle(id);
      await fetchData();
    } catch (e: any) {
      alert("Erreur : " + e.message);
    }
  };

  const handleDeleteBundleItem = async (id: string) => {
    if (!confirm("Retirer ce parfum du pack ?")) return;
    try {
      await deleteBundleItem(id);
      await fetchData();
    } catch (e: any) {
      alert("Erreur : " + e.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/50 max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex justify-between items-center pr-8">
            <span>Catalogue : {grossiste?.nom}</span>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Devise utilisée : {grossiste?.devise}</p>
        </DialogHeader>

        <Tabs defaultValue="unite" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unite">Parfums à l'unité</TabsTrigger>
            <TabsTrigger value="bundles">Lots Précomposés (Packs)</TabsTrigger>
          </TabsList>

          <TabsContent value="unite" className="space-y-6 mt-4">
            {/* Liste des parfums du catalogue */}
            <div className="space-y-3">
              {loading ? (
                <p className="text-sm text-muted-foreground text-center py-4">Chargement...</p>
              ) : items.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">Ce grossiste n&apos;a aucun parfum à l'unité.</p>
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
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-400/10" onClick={() => handleDeleteItem(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Formulaire d'ajout unitaire */}
            <div>
              <h3 className="font-medium text-sm text-foreground mb-4">Ajouter un parfum (à l'unité)</h3>
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
          </TabsContent>

          <TabsContent value="bundles" className="space-y-6 mt-4">
            <div className="space-y-4">
              {loading ? (
                <p className="text-sm text-muted-foreground text-center py-4">Chargement...</p>
              ) : bundles.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">Aucun lot précomposé configuré.</p>
              ) : (
                <div className="space-y-6">
                  {bundles.map(bundle => (
                    <div key={bundle.id} className="p-4 rounded-xl border border-gold/30 bg-gold/5 relative">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-red-400"
                        onClick={() => handleDeleteBundle(bundle.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      
                      <div className="mb-4 pr-10">
                        <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
                          <Package className="w-4 h-4 text-gold" /> {bundle.nom}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Prix global du lot : <span className="text-gold font-semibold">{bundle.prix_global_devise} {grossiste?.devise}</span>
                        </p>
                        {bundle.notes && <p className="text-xs text-muted-foreground mt-1">Notes: {bundle.notes}</p>}
                      </div>

                      <div className="space-y-2 mb-4 pl-4 border-l-2 border-gold/20">
                        <p className="text-xs font-medium uppercase text-muted-foreground mb-2">Contenu du lot :</p>
                        {bundle.items && bundle.items.length > 0 ? (
                          bundle.items.map(item => (
                            <div key={item.id} className="flex items-center justify-between bg-card/50 p-2 rounded border border-border/50 text-sm">
                              <span>
                                <span className="font-medium">{item.quantite}x</span> {item.parfum?.maison} - {item.parfum?.nom} ({item.volume_flacon_ml} ml)
                              </span>
                              <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-red-400" onClick={() => handleDeleteBundleItem(item.id)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs italic text-muted-foreground">Le lot est vide. Ajoutez des parfums ci-dessous.</p>
                        )}
                      </div>

                      {/* Add item to bundle form */}
                      {itemBundleId === bundle.id ? (
                        <form onSubmit={(e) => handleAddBundleItem(e, bundle.id)} className="bg-card/80 p-3 rounded-lg border border-border/50 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Select value={itemParfumId} onValueChange={(v) => setItemParfumId(v as string)}>
                              <SelectTrigger className="h-8 text-xs bg-muted/50"><SelectValue placeholder="Parfum" /></SelectTrigger>
                              <SelectContent>
                                {parfums.map((p) => (
                                  <SelectItem key={p.id} value={p.id}>{p.maison} - {p.nom}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex gap-2">
                              <Input type="number" placeholder="Vol ml" className="h-8 text-xs bg-muted/50" value={itemVolume} onChange={(e) => setItemVolume(e.target.value)} required />
                              <Input type="number" placeholder="Qté" className="h-8 text-xs bg-muted/50" value={itemQuantite} onChange={(e) => setItemQuantite(e.target.value)} required />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setItemBundleId("")}>Annuler</Button>
                            <Button type="submit" size="sm" className="h-8 text-xs bg-gold hover:bg-gold/90 text-black">Enregistrer</Button>
                          </div>
                        </form>
                      ) : (
                        <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => setItemBundleId(bundle.id)}>
                          <Plus className="w-3 h-3 mr-1" /> Ajouter un parfum au lot
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-sm text-foreground mb-4">Créer un nouveau Lot/Pack</h3>
              <form onSubmit={handleAddBundle} className="space-y-4 bg-muted/10 p-4 rounded-xl border border-border/30">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Nom du Lot *</Label>
                    <Input placeholder="Ex: Starter Pack Baccarat" value={bundleNom} onChange={(e) => setBundleNom(e.target.value)} className="bg-muted/30" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Prix Global ({grossiste?.devise}) *</Label>
                    <Input type="number" step="0.01" value={bundlePrix} onChange={(e) => setBundlePrix(e.target.value)} className="bg-muted/30" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Notes additionnelles</Label>
                  <Input placeholder="Ex: Livraison sous 2 semaines" value={bundleNotes} onChange={(e) => setBundleNotes(e.target.value)} className="bg-muted/30" />
                </div>
                <Button type="submit" disabled={bundleSubmitting || !bundleNom || !bundlePrix} className="w-full gradient-gold text-primary-foreground gap-2">
                  <Plus className="w-4 h-4" /> {bundleSubmitting ? "Création..." : "Créer le lot"}
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
