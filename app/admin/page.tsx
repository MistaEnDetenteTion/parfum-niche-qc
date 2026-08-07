import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatMl, STATUT_LOT_CONFIG } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FlaskConical,
  Users,
  ShoppingCart,
  TrendingUp,
  Package,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

interface StockParfum {
  parfum_id: string;
  parfum_nom: string;
  maison: string;
  stock_brut_ml: number;
  stock_dispo_ml: number;
  nb_decants_10ml: number;
}

export default async function AdminDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = await createServerSupabaseClient() as any;

  const [
    { count: nbParfums },
    { count: nbGrossistes },
    { data: lots },
    { data: stockDataRaw },
  ] = await Promise.all([
    supabase.from("parfums").select("*", { count: "exact", head: true }).eq("actif", true),
    supabase.from("grossistes").select("*", { count: "exact", head: true }).eq("actif", true),
    supabase.from("lots_commande").select("statut").order("created_at", { ascending: false }).limit(10),
    supabase.rpc("get_stock_par_parfum"),
  ]);

  const stockData = (stockDataRaw ?? []) as StockParfum[];
  const lotsArr = (lots ?? []) as { statut: string }[];

  const lotsEnAttente = lotsArr.filter((l) => l.statut === "en_attente").length;
  const lotsCommandes = lotsArr.filter((l) => l.statut === "commande").length;

  const totalDecants = stockData.reduce((acc, p) => acc + p.nb_decants_10ml, 0);
  const stockFaible = stockData.filter((p) => p.nb_decants_10ml < 5 && p.nb_decants_10ml > 0);
  const stockEpuise = stockData.filter((p) => p.stock_dispo_ml === 0);

  const statsCards = [
    {
      title: "Parfums actifs",
      value: nbParfums ?? 0,
      icon: FlaskConical,
      href: "/admin/parfums",
      description: "dans le catalogue",
    },
    {
      title: "Grossistes actifs",
      value: nbGrossistes ?? 0,
      icon: Users,
      href: "/admin/grossistes",
      description: "fournisseurs",
    },
    {
      title: "Lots en cours",
      value: lotsEnAttente + lotsCommandes,
      icon: ShoppingCart,
      href: "/admin/commandes",
      description: `${lotsEnAttente} en attente · ${lotsCommandes} commandés`,
    },
    {
      title: "Décants 10 ml dispo.",
      value: totalDecants,
      icon: TrendingUp,
      href: "/admin/parfums",
      description: "stock disponible total",
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="animate-fadeInUp">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">Centre de Commande</p>
        <h1 className="text-3xl font-light text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">Vue d&apos;ensemble de votre activité parfum.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeInUp">
        {statsCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="bg-card border-border/50 hover:border-gold/20 transition-all duration-300 hover:bg-gold/5 cursor-pointer group h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-light text-foreground mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Alertes stock */}
      {(stockFaible.length > 0 || stockEpuise.length > 0) && (
        <div className="space-y-3 animate-fadeInUp">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Alertes Stock</h2>
          <div className="space-y-2">
            {stockEpuise.map((p) => (
              <div key={p.parfum_id} className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-foreground">{p.parfum_nom}</span>
                  <span className="text-xs text-muted-foreground ml-2">{p.maison}</span>
                </div>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">Épuisé</Badge>
              </div>
            ))}
            {stockFaible.map((p) => (
              <div key={p.parfum_id} className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <Package className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-foreground">{p.parfum_nom}</span>
                  <span className="text-xs text-muted-foreground ml-2">{p.maison}</span>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                  {p.nb_decants_10ml} décant{p.nb_decants_10ml > 1 ? "s" : ""} restant{p.nb_decants_10ml > 1 ? "s" : ""}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stocks par parfum */}
      <div className="animate-fadeInUp">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Stock par parfum</h2>
          <Link href="/admin/parfums" className="text-xs text-gold hover:text-gold/80 transition-colors">
            Voir tout →
          </Link>
        </div>
        <Card className="bg-card border-border/50">
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {stockData.length > 0 ? (
                stockData.slice(0, 8).map((p) => (
                  <div key={p.parfum_id} className="flex items-center gap-4 px-4 py-3 hover:bg-white/3 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{p.parfum_nom}</p>
                      <p className="text-xs text-muted-foreground">{p.maison}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-foreground">{formatMl(p.stock_dispo_ml)}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.nb_decants_10ml} décant{p.nb_decants_10ml !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="hidden sm:block w-24">
                      <div className="h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (p.nb_decants_10ml / 20) * 100)}%`,
                            backgroundColor:
                              p.nb_decants_10ml === 0
                                ? "oklch(0.65 0.22 27)"
                                : p.nb_decants_10ml < 5
                                ? "oklch(0.82 0.18 80)"
                                : "oklch(0.7 0.18 145)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  Aucun parfum en stock — ajoutez des lots de commande.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
