"use client";

import { useState, useMemo } from "react";
import { type ComparateurItem, type ComparateurBundle } from "@/app/actions/catalogue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, TrendingDown, Package, AlertCircle, Layers } from "lucide-react";
import { formatCAD } from "@/lib/utils";

export function ComparateurClient({ 
  initialData, 
  initialBundles 
}: { 
  initialData: ComparateurItem[];
  initialBundles: ComparateurBundle[];
}) {
  const [search, setSearch] = useState("");

  // Grouper les données par Parfum + Volume
  const groupedData = useMemo(() => {
    const map = new Map<string, {
      parfum_id: string;
      parfum_nom: string;
      maison: string;
      volume_flacon_ml: number;
      offres: ComparateurItem[];
      bundles: ComparateurBundle[];
      meilleur_prix: number;
    }>();

    for (const item of initialData) {
      if (search) {
        const term = search.toLowerCase();
        if (!item.parfum_nom.toLowerCase().includes(term) && !item.maison.toLowerCase().includes(term)) {
          continue;
        }
      }

      const key = `${item.parfum_id}-${item.volume_flacon_ml}`;
      if (!map.has(key)) {
        map.set(key, {
          parfum_id: item.parfum_id,
          parfum_nom: item.parfum_nom,
          maison: item.maison,
          volume_flacon_ml: item.volume_flacon_ml,
          offres: [],
          bundles: [],
          meilleur_prix: Infinity,
        });
      }

      const group = map.get(key)!;
      group.offres.push(item);
      if (item.cout_revient_cad_ml < group.meilleur_prix) {
        group.meilleur_prix = item.cout_revient_cad_ml;
      }
    }

    // Attach bundles that contain this perfume
    for (const group of map.values()) {
      for (const bundle of initialBundles) {
        if (bundle.parfum_ids && bundle.parfum_ids.includes(group.parfum_id)) {
          group.bundles.push(bundle);
        }
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      const cmp = a.maison.localeCompare(b.maison);
      if (cmp !== 0) return cmp;
      return a.parfum_nom.localeCompare(b.parfum_nom);
    });
  }, [initialData, initialBundles, search]);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fadeInUp">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">Achats</p>
          <h1 className="text-3xl font-light text-foreground">Comparateur Fournisseurs</h1>
          <p className="text-muted-foreground mt-1">Identifiez automatiquement le grossiste le plus rentable par parfum.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un parfum..." 
            className="pl-9 bg-muted/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {groupedData.length === 0 ? (
        <Card className="bg-card border-border/50">
          <CardContent className="py-16 text-center">
            <TrendingDown className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun résultat trouvé dans les catalogues.</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Ajoutez des parfums aux catalogues de vos grossistes pour les comparer.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {groupedData.map((group) => (
            <Card key={`${group.parfum_id}-${group.volume_flacon_ml}`} className="bg-card border-border/50 overflow-hidden">
              <CardHeader className="bg-muted/10 pb-4 border-b border-border/50">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-medium">{group.maison} — {group.parfum_nom}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                      <Package className="w-4 h-4" /> Format {group.volume_flacon_ml} ml
                    </p>
                  </div>
                  {group.meilleur_prix !== Infinity && (
                    <Badge variant="outline" className="border-gold/30 text-gold bg-gold/5">
                      Meilleur prix unitaire : {formatCAD(group.meilleur_prix)} / ml
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/5">
                      <tr>
                        <th className="px-6 py-3 font-medium">Offre / Grossiste</th>
                        <th className="px-6 py-3 font-medium text-right">Prix d'Achat (Brut)</th>
                        <th className="px-6 py-3 font-medium text-right">Frais Estimés</th>
                        <th className="px-6 py-3 font-medium text-right">Coût de Revient / ml</th>
                        <th className="px-6 py-3 font-medium">Infos / MOQ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {/* Lignes pour les parfums à l'unité */}
                      {group.offres.sort((a,b) => a.cout_revient_cad_ml - b.cout_revient_cad_ml).map((offre, index) => {
                        const isBest = index === 0;
                        return (
                          <tr key={offre.catalogue_id} className={`transition-colors hover:bg-muted/10 ${isBest ? 'bg-emerald-500/5' : ''}`}>
                            <td className="px-6 py-4">
                              <div className="font-medium flex items-center gap-2">
                                {offre.grossiste_nom}
                                {isBest && <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[10px] py-0">TOP #1</Badge>}
                              </div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">À l'unité · Taux : {offre.taux_change_cad.toFixed(4)}</div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="font-medium">{offre.prix_achat_devise.toFixed(2)} {offre.devise}</span>
                              <div className="text-xs text-muted-foreground mt-0.5">({formatCAD(offre.prix_achat_cad_ml * offre.volume_flacon_ml)} CAD)</div>
                            </td>
                            <td className="px-6 py-4 text-right text-muted-foreground text-xs">
                              +{formatCAD(offre.frais_livraison_fixe_cad)} <br/> par flacon
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className={`font-semibold ${isBest ? 'text-emerald-400' : 'text-foreground'}`}>
                                {formatCAD(offre.cout_revient_cad_ml)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                {offre.moq > 1 && (
                                  <Badge variant="outline" className="w-fit border-amber-500/30 text-amber-500 bg-amber-500/10 text-[10px]">
                                    MOQ: {offre.moq}
                                  </Badge>
                                )}
                                {offre.notes && (
                                  <span className="text-[10px] text-muted-foreground flex items-start gap-1 max-w-[150px] leading-tight">
                                    <AlertCircle className="w-3 h-3 flex-shrink-0 mt-px" /> {offre.notes}
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      
                      {/* Lignes pour les Bundles contenant ce parfum */}
                      {group.bundles.map((bundle) => {
                        return (
                          <tr key={bundle.bundle_id} className="transition-colors hover:bg-muted/10 bg-blue-500/5">
                            <td className="px-6 py-4">
                              <div className="font-medium flex items-center gap-2">
                                {bundle.grossiste_nom}
                                <Badge className="bg-blue-500/20 text-blue-400 border-none text-[10px] py-0 gap-1 flex items-center">
                                  <Layers className="w-3 h-3" /> PACK
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 font-medium">{bundle.bundle_nom}</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5 max-w-[200px] leading-tight">
                                Contient: {bundle.items_details?.map(i => `${i.quantite}x ${i.parfum?.nom} (${i.volume_flacon_ml}ml)`).join(', ')}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="font-medium text-blue-400/90">{bundle.prix_global_devise.toFixed(2)} {bundle.devise}</span>
                              <div className="text-xs text-muted-foreground mt-0.5">(Total: {formatCAD(bundle.prix_achat_total_cad)} CAD)</div>
                            </td>
                            <td className="px-6 py-4 text-right text-muted-foreground text-xs">
                              +{formatCAD(bundle.frais_expedition_total_cad)} <br/> pour {bundle.total_flacons} flacons
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="font-semibold text-blue-400">
                                {formatCAD(bundle.cout_moyen_cad_ml)}
                              </span>
                              <div className="text-[10px] text-muted-foreground mt-1">Moyenne au ml du pack</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                {bundle.notes && (
                                  <span className="text-[10px] text-muted-foreground flex items-start gap-1 max-w-[150px] leading-tight">
                                    <AlertCircle className="w-3 h-3 flex-shrink-0 mt-px" /> {bundle.notes}
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
