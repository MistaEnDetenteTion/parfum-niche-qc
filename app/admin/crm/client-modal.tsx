"use client";

import { useState } from "react";
import { type ClientCRM, upsertClient, addVente } from "@/app/actions/crm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useParfums } from "@/hooks/use-parfums";
import { ShoppingCart } from "lucide-react";

export function ClientModal({ 
  open, 
  onOpenChange, 
  client,
  allClients
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  client: ClientCRM | null;
  allClients: ClientCRM[];
}) {
  const { parfums } = useParfums();
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState<"infos" | "nouvel_achat">("infos");

  // Form Client
  const [prenom, setPrenom] = useState(client?.prenom || "");
  const [nom, setNom] = useState(client?.nom || "");
  const [handle, setHandle] = useState(client?.handle_social || "");
  const [source, setSource] = useState(client?.source_acquisition || "Instagram");
  const [notes, setNotes] = useState(client?.notes_privees || "");
  const [parrainId, setParrainId] = useState<string>(client?.parrain_id || "");

  // Form Achat
  const [parfumId, setParfumId] = useState("");
  const [typeAchat, setTypeAchat] = useState<"decant_10ml"|"decant_5ml"|"full_bottle"|"autre">("decant_10ml");
  const [montant, setMontant] = useState("");

  const handleSaveClient = async () => {
    if (!prenom || !nom) return;
    setSubmitting(true);
    try {
      await upsertClient({
        id: client?.id,
        prenom,
        nom,
        handle_social: handle,
        source_acquisition: source,
        notes_privees: notes,
        parrain_id: parrainId === "none" ? null : (parrainId || null),
      });
      setSubmitting(false);
      onOpenChange(false);
    } catch (e: any) {
      console.error(e);
      alert("Erreur lors de la sauvegarde: " + e.message);
      setSubmitting(false);
    }
  };

  const handleSaveAchat = async () => {
    if (!client || !montant) return;
    setSubmitting(true);
    try {
      await addVente({
        client_id: client.id,
        parfum_id: parfumId || null,
        type_achat: typeAchat,
        montant_cad: parseFloat(montant),
        date_achat: new Date().toISOString(),
      });
      setSubmitting(false);
      onOpenChange(false);
    } catch (e: any) {
      console.error(e);
      alert("Erreur lors de l'enregistrement: " + e.message);
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/50 max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {client ? `Fiche Client : ${client.prenom} ${client.nom}` : "Nouveau Client"}
          </DialogTitle>
        </DialogHeader>

        {client && (
          <div className="flex border-b border-border/50 mb-4">
            <button 
              className={`px-4 py-2 text-sm font-medium ${tab === "infos" ? "border-b-2 border-gold text-gold" : "text-muted-foreground"}`}
              onClick={() => setTab("infos")}
            >
              Informations
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${tab === "nouvel_achat" ? "border-b-2 border-gold text-gold" : "text-muted-foreground"}`}
              onClick={() => setTab("nouvel_achat")}
            >
              Nouvel Achat
            </button>
          </div>
        )}

        {tab === "infos" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Prénom *</Label>
                <Input value={prenom} onChange={(e) => setPrenom(e.target.value)} className="bg-muted/30" />
              </div>
              <div className="space-y-1.5">
                <Label>Nom *</Label>
                <Input value={nom} onChange={(e) => setNom(e.target.value)} className="bg-muted/30" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Handle Social (ex: @user)</Label>
                <Input value={handle} onChange={(e) => setHandle(e.target.value)} className="bg-muted/30" />
              </div>
              <div className="space-y-1.5">
                <Label>Source</Label>
                <Select value={source} onValueChange={(v) => setSource(v as string)}>
                  <SelectTrigger className="bg-muted/30"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="Bouche à oreille">Bouche à oreille</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Parrain (Wingman)</Label>
              <Select value={parrainId} onValueChange={(v) => setParrainId(v as string)}>
                <SelectTrigger className="bg-muted/30"><SelectValue placeholder="Aucun" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun parrain</SelectItem>
                  {allClients.filter(c => c.id !== client?.id).map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.prenom} {c.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Notes privées</Label>
              <Textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                className="bg-muted/30 resize-none" 
                rows={3} 
                placeholder="Préférences, parfums détestés, etc."
              />
            </div>

            <Button onClick={handleSaveClient} disabled={submitting || !prenom || !nom} className="w-full gradient-gold text-primary-foreground mt-4">
              {submitting ? "Sauvegarde..." : "Sauvegarder la fiche"}
            </Button>
          </div>
        )}

        {tab === "nouvel_achat" && client && (
          <div className="space-y-4">
            <div className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
              <span className="text-sm">Valeur Vie Actuelle (LTV)</span>
              <span className="font-semibold text-gold">{client.ltv_cad} $ CAD</span>
            </div>
            
            <Separator />

            <div className="space-y-1.5">
              <Label>Parfum acheté</Label>
              <Select value={parfumId} onValueChange={(v) => setParfumId(v as string)}>
                <SelectTrigger className="bg-muted/30"><SelectValue placeholder="Sélectionner le parfum" /></SelectTrigger>
                <SelectContent>
                  {parfums.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.maison} - {p.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Format</Label>
                <Select value={typeAchat} onValueChange={(v: any) => setTypeAchat(v)}>
                  <SelectTrigger className="bg-muted/30"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="decant_10ml">Décant 10 ml</SelectItem>
                    <SelectItem value="decant_5ml">Décant 5 ml</SelectItem>
                    <SelectItem value="full_bottle">Flacon Entier</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Montant final (CAD)</Label>
                <Input type="number" step="0.01" value={montant} onChange={(e) => setMontant(e.target.value)} className="bg-muted/30" placeholder="ex: 45.00" />
              </div>
            </div>

            <Button onClick={handleSaveAchat} disabled={submitting || !montant} className="w-full gradient-gold text-primary-foreground gap-2 mt-4">
              <ShoppingCart className="w-4 h-4" /> Enregistrer la vente
            </Button>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
