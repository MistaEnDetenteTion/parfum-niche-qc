"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  calcCoutRevientMl,
  calcPrixDecant,
  calcMargePct,
  calcStockDisponible,
  calcNbDecants,
  formatCAD,
  formatMl,
  formatMarge,
} from "@/lib/utils";
import { TrendingUp, TrendingDown, Calculator, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalcState {
  prixAchatDevise: number;
  devise: string;
  tauxChange: number;
  volumeFlaconMl: number;
  quantiteFlacons: number;
  fraisLivraisonCad: number;
  volumeDecantMl: number;
  multiplicateurDecant: number;
  multiplicateurFlacon: number;
  prixBoutiqueBarre: number;
  stockBrutMl: number;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-muted-foreground uppercase tracking-[0.15em] font-medium mb-3 flex items-center gap-2">
      {children}
    </p>
  );
}

function StatBox({
  label,
  value,
  sub,
  highlight,
  good,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  good?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-3 space-y-0.5",
        highlight
          ? good === false
            ? "bg-red-500/10 border border-red-500/20"
            : good
            ? "bg-emerald-500/10 border border-emerald-500/20"
            : "bg-gold-muted border border-gold/20"
          : "bg-muted/30"
      )}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          "text-lg font-semibold",
          highlight && good === false
            ? "text-red-400"
            : highlight && good
            ? "text-emerald-400"
            : highlight
            ? "text-gold"
            : "text-foreground"
        )}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-muted-foreground/70">{sub}</p>}
    </div>
  );
}

export function Calculateur() {
  const [state, setState] = useState<CalcState>({
    prixAchatDevise: 120,
    devise: "EUR",
    tauxChange: 1.48,
    volumeFlaconMl: 100,
    quantiteFlacons: 1,
    fraisLivraisonCad: 12.75,
    volumeDecantMl: 10,
    multiplicateurDecant: 2.5,
    multiplicateurFlacon: 2.0,
    prixBoutiqueBarre: 350,
    stockBrutMl: 0,
  });

  const set = (key: keyof CalcState, value: number | string) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const calc = useMemo(() => {
    const coutRevientMl = calcCoutRevientMl({
      prixAchatDevise: state.prixAchatDevise,
      volumeFlaconMl: state.volumeFlaconMl,
      tauxChangeCad: state.tauxChange,
      fraisLivraisonCad: state.fraisLivraisonCad,
    });

    const achatCadMl = (state.prixAchatDevise / state.volumeFlaconMl) * state.tauxChange;
    const fraisMl = state.fraisLivraisonCad / state.volumeFlaconMl;
    const coutLot = state.prixAchatDevise * state.quantiteFlacons * state.tauxChange;
    const fraisLot = state.fraisLivraisonCad * state.quantiteFlacons;
    const investissementTotal = coutLot + fraisLot;

    const prixDecant = calcPrixDecant({
      coutRevientMl,
      volumeDecantMl: state.volumeDecantMl,
      multiplicateur: state.multiplicateurDecant,
    });

    const prixFlacon = calcPrixDecant({
      coutRevientMl,
      volumeDecantMl: state.volumeFlaconMl,
      multiplicateur: state.multiplicateurFlacon,
    });

    const coutDecant = coutRevientMl * state.volumeDecantMl;
    const coutFlacon = coutRevientMl * state.volumeFlaconMl;

    const margeDecant = calcMargePct(prixDecant, coutDecant);
    const margeFlacon = calcMargePct(prixFlacon, coutFlacon);

    const stockDispo = calcStockDisponible(
      state.stockBrutMl > 0
        ? state.stockBrutMl
        : state.volumeFlaconMl * state.quantiteFlacons
    );
    const nbDecants = calcNbDecants(
      state.stockBrutMl > 0
        ? state.stockBrutMl
        : state.volumeFlaconMl * state.quantiteFlacons,
      state.volumeDecantMl
    );

    const revenuTheorique = nbDecants * prixDecant;
    const profitTheorique = revenuTheorique - investissementTotal;

    return {
      coutRevientMl,
      achatCadMl,
      fraisMl,
      coutLot,
      fraisLot,
      investissementTotal,
      prixDecant,
      prixFlacon,
      margeDecant,
      margeFlacon,
      stockDispo,
      nbDecants,
      revenuTheorique,
      profitTheorique,
    };
  }, [state]);

  const N = (v: number) => (isNaN(v) || !isFinite(v) ? 0 : v);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-fadeInUp">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">Outil</p>
        <h1 className="text-3xl font-light">Calculateur de Prix</h1>
        <p className="text-muted-foreground mt-1">
          Simulez vos marges et prix de vente en temps réel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeInUp">
        {/* ——— Colonne inputs ——— */}
        <div className="space-y-5">
          {/* Achat grossiste */}
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calculator className="w-4 h-4 text-gold" />
                Achat grossiste
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Prix flacon ({state.devise})</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={state.prixAchatDevise}
                    onChange={(e) => set("prixAchatDevise", parseFloat(e.target.value))}
                    className="bg-muted/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Volume (ml)</Label>
                  <Input
                    type="number"
                    step="1"
                    value={state.volumeFlaconMl}
                    onChange={(e) => set("volumeFlaconMl", parseFloat(e.target.value))}
                    className="bg-muted/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Quantité flacons</Label>
                  <Input
                    type="number"
                    min="1"
                    value={state.quantiteFlacons}
                    onChange={(e) => set("quantiteFlacons", parseInt(e.target.value))}
                    className="bg-muted/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Taux change → CAD</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={state.tauxChange}
                    onChange={(e) => set("tauxChange", parseFloat(e.target.value))}
                    className="bg-muted/30"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Frais livraison CAD / flacon</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={state.fraisLivraisonCad}
                  onChange={(e) => set("fraisLivraisonCad", parseFloat(e.target.value))}
                  className="bg-muted/30"
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="w-3 h-3" /> Défaut : 12,75 $ CAD / flacon international
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Paramètres vente */}
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gold" />
                Paramètres de vente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Vol. décant (ml)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={state.volumeDecantMl}
                    onChange={(e) => set("volumeDecantMl", parseFloat(e.target.value))}
                    className="bg-muted/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Mult. décant</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={state.multiplicateurDecant}
                    onChange={(e) => set("multiplicateurDecant", parseFloat(e.target.value))}
                    className="bg-muted/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Mult. flacon</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={state.multiplicateurFlacon}
                    onChange={(e) => set("multiplicateurFlacon", parseFloat(e.target.value))}
                    className="bg-muted/30"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Prix boutique barré (CAD, référence)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={state.prixBoutiqueBarre}
                  onChange={(e) => set("prixBoutiqueBarre", parseFloat(e.target.value))}
                  className="bg-muted/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Stock brut total (ml) — optionnel</Label>
                <Input
                  type="number"
                  step="1"
                  value={state.stockBrutMl || ""}
                  placeholder={`${state.volumeFlaconMl * state.quantiteFlacons} ml (calculé)`}
                  onChange={(e) => set("stockBrutMl", parseFloat(e.target.value) || 0)}
                  className="bg-muted/30"
                />
                <p className="text-xs text-muted-foreground">
                  Stock disponible = brut × 95 % (buffer perte décantage)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ——— Colonne résultats ——— */}
        <div className="space-y-5">
          {/* Coûts */}
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">
                Analyse des coûts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SectionTitle>Décomposition coût de revient / ml</SectionTitle>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <StatBox
                  label="Achat converti"
                  value={formatCAD(N(calc.achatCadMl))}
                  sub="/ ml"
                />
                <StatBox
                  label="Frais livraison"
                  value={formatCAD(N(calc.fraisMl))}
                  sub="/ ml"
                />
                <StatBox
                  label="Coût de revient"
                  value={formatCAD(N(calc.coutRevientMl))}
                  sub="/ ml"
                  highlight
                />
              </div>

              <Separator className="my-4" />
              <SectionTitle>Investissement total (lot)</SectionTitle>
              <div className="grid grid-cols-3 gap-3">
                <StatBox
                  label={`Achat (${state.quantiteFlacons} fl.)`}
                  value={formatCAD(N(calc.coutLot))}
                />
                <StatBox
                  label="Livraison totale"
                  value={formatCAD(N(calc.fraisLot))}
                />
                <StatBox
                  label="Investissement"
                  value={formatCAD(N(calc.investissementTotal))}
                  highlight
                />
              </div>
            </CardContent>
          </Card>

          {/* Prix de vente */}
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">
                Prix de vente & marges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SectionTitle>Décant {state.volumeDecantMl} ml</SectionTitle>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <StatBox
                  label={`Prix vente décant`}
                  value={formatCAD(N(calc.prixDecant))}
                  sub={`Coût: ${formatCAD(N(calc.coutRevientMl * state.volumeDecantMl))}`}
                  highlight
                  good
                />
                <StatBox
                  label="Marge décant"
                  value={formatMarge(N(calc.margeDecant))}
                  sub={`× ${state.multiplicateurDecant}`}
                  highlight
                  good={calc.margeDecant >= 40}
                />
              </div>

              <Separator className="my-4" />
              <SectionTitle>Flacon {state.volumeFlaconMl} ml</SectionTitle>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <StatBox
                  label="Prix vente flacon"
                  value={formatCAD(N(calc.prixFlacon))}
                  sub={
                    state.prixBoutiqueBarre > 0
                      ? `Boutique barré: ${formatCAD(state.prixBoutiqueBarre)}`
                      : undefined
                  }
                  highlight
                  good
                />
                <StatBox
                  label="Marge flacon"
                  value={formatMarge(N(calc.margeFlacon))}
                  sub={`× ${state.multiplicateurFlacon}`}
                  highlight
                  good={calc.margeFlacon >= 40}
                />
              </div>

              <Separator className="my-4" />
              <SectionTitle>Projection stock</SectionTitle>
              <div className="grid grid-cols-3 gap-3">
                <StatBox
                  label="Stock dispo (−5%)"
                  value={formatMl(N(calc.stockDispo))}
                />
                <StatBox
                  label={`Nb décants ${state.volumeDecantMl} ml`}
                  value={`${calc.nbDecants}`}
                />
                <StatBox
                  label="Profit théorique"
                  value={formatCAD(N(calc.profitTheorique))}
                  highlight
                  good={calc.profitTheorique > 0}
                />
              </div>
            </CardContent>
          </Card>

          {/* Résumé */}
          <Card className="border border-gold/20 bg-gold-muted">
            <CardContent className="p-4">
              <p className="text-xs text-gold font-medium uppercase tracking-wider mb-3">
                Résumé exécutif
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coût de revient / ml</span>
                  <span className="font-semibold text-foreground">{formatCAD(N(calc.coutRevientMl))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prix décant {state.volumeDecantMl} ml</span>
                  <span className="font-semibold text-foreground">{formatCAD(N(calc.prixDecant))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prix flacon {state.volumeFlaconMl} ml</span>
                  <span className="font-semibold text-foreground">{formatCAD(N(calc.prixFlacon))}</span>
                </div>
                {state.prixBoutiqueBarre > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Économie vs boutique</span>
                    <span className="font-semibold text-emerald-400">
                      {formatCAD(N(state.prixBoutiqueBarre - calc.prixFlacon))}
                    </span>
                  </div>
                )}
                <Separator className="my-1.5" />
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Profit potentiel (lot)</span>
                  <span className={calc.profitTheorique >= 0 ? "text-emerald-400" : "text-red-400"}>
                    {calc.profitTheorique >= 0 ? (
                      <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 inline mr-1" />
                    )}
                    {formatCAD(N(calc.profitTheorique))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
