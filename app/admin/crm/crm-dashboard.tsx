"use client";

import { useState } from "react";
import { type ClientCRM, upsertClient, deleteClient } from "@/app/actions/crm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Crown, Gift, Plus, MessageCircle, Copy, Trash2 } from "lucide-react";
import { formatCAD } from "@/lib/utils";
import { ClientModal } from "./client-modal";

export function CrmDashboard({ 
  initialClients, 
  initialRelances 
}: { 
  initialClients: ClientCRM[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialRelances: any[];
}) {
  const [clients] = useState<ClientCRM[]>(initialClients);
  const [relances] = useState(initialRelances);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientCRM | null>(null);

  const copyRelanceMessage = (r: any) => {
    const parfum = r.parfum?.nom || "le parfum";
    const msg = `Salut ${r.client?.prenom || ""} ! J'espère que tu as bien profité de ton décant de ${parfum} le mois dernier ✨\n\nSi tu as aimé ce style, j'ai une nouveauté qui devrait te plaire. Hésite pas si tu veux un refill ou tester autre chose !`;
    navigator.clipboard.writeText(msg);
    alert("Message copié !");
  };

  const handleOpenClient = (c?: ClientCRM) => {
    setEditingClient(c || null);
    setModalOpen(true);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fadeInUp">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">CRM</p>
          <h1 className="text-3xl font-light text-foreground">Clients & Relationnel</h1>
          <p className="text-muted-foreground mt-1">Gérez vos clients, le LTV, et les parrainages.</p>
        </div>
        <Button onClick={() => handleOpenClient()} className="gradient-gold text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> Nouveau Client
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLONNE GAUCHE (Tableau des clients) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Users className="w-5 h-5 text-gold" />
                Base Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Client</th>
                      <th className="px-4 py-3">LTV (Valeur)</th>
                      <th className="px-4 py-3">Parrainages</th>
                      <th className="px-4 py-3 rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((c) => (
                      <tr key={c.id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground">
                            {c.prenom} {c.nom}
                            {c.ltv_cad > 200 && (
                              <Badge className="ml-2 bg-gold/10 text-gold border-gold/20 text-[10px] py-0">VIP</Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">{c.handle_social}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold">{formatCAD(c.ltv_cad)}</span>
                          <div className="text-[10px] text-muted-foreground">
                            Dernier : {c.dernier_achat ? new Date(c.dernier_achat).toLocaleDateString("fr-CA") : "Jamais"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {c.nb_filleuls > 0 ? (
                            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 gap-1">
                              <Gift className="w-3 h-3" /> {c.nb_filleuls} filleul(s)
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost" className="h-8 text-xs text-gold hover:text-gold/80 hover:bg-gold/10" onClick={() => handleOpenClient(c)}>
                              Gérer
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-400/10" onClick={async () => {
                              if (confirm("Supprimer ce client et toutes ses ventes définitivement ?")) {
                                try {
                                  await deleteClient(c.id);
                                } catch (e: any) {
                                  alert("Erreur: " + e.message);
                                }
                              }
                            }}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {clients.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-muted-foreground">Aucun client trouvé.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COLONNE DROITE (Relances) */}
        <div className="space-y-6">
          <Card className="bg-card border-gold/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-gold" />
                À Relancer
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Clients ayant pris un 10ml il y a 25-30j. Le décant devrait être vide !
              </p>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              {relances.length === 0 ? (
                <p className="text-sm text-muted-foreground italic text-center py-4">Aucune relance prévue aujourd'hui.</p>
              ) : (
                relances.map((r, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-sm font-semibold">{r.client?.prenom} {r.client?.nom}</p>
                    <p className="text-xs text-muted-foreground mb-2">Achat: {r.parfum?.nom} (il y a ~1 mois)</p>
                    <Button size="sm" variant="outline" className="w-full text-xs gap-2" onClick={() => copyRelanceMessage(r)}>
                      <Copy className="w-3 h-3" /> Copier le DM
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Programme Wingman</p>
                  <p className="text-xs text-muted-foreground">Un client qui parraine = 5ml gratuit à la prochaine commande.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      <ClientModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        client={editingClient} 
        allClients={clients} 
      />
    </div>
  );
}
