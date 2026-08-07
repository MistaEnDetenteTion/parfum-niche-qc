"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useParfums } from "@/hooks/use-parfums";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FlaskConical, Sparkles, ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Parfum } from "@/lib/supabase/types";

export default function StoryPage() {
  const { parfums, loading } = useParfums();
  const router = useRouter();
  const [selected, setSelected] = useState<Parfum | null>(null);
  const [avis, setAvis] = useState("");
  const [prix, setPrix] = useState("25.00");
  const [search, setSearch] = useState("");

  const filtered = parfums.filter(
    (p) =>
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.maison.toLowerCase().includes(search.toLowerCase())
  );

  const handleNext = () => {
    if (!selected) return;
    const params = new URLSearchParams({
      parfumId: selected.id,
      avis,
      prix,
    });
    router.push(`/story/generer?${params.toString()}`);
  };

  return (
    <div className="min-h-screen gradient-dark">
      {/* Header */}
      <header className="sticky top-0 z-10 glass border-b border-border/50 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Accueil</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold">Parfum du Jour</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Hero */}
        <div className="text-center animate-fadeInUp">
          <h1 className="text-2xl font-light text-foreground mb-1">
            Choisissez votre{" "}
            <span className="text-gradient-gold">parfum du jour</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Sélectionnez un parfum, rédigez votre avis et générez votre Story 9:16.
          </p>
        </div>

        {/* Étape 1 : Sélectionner un parfum */}
        <div className="space-y-3 animate-fadeInUp">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full gradient-gold flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
              1
            </span>
            <h2 className="text-sm font-medium text-foreground">Sélectionner un parfum</h2>
          </div>

          <Input
            placeholder="Rechercher un parfum ou une maison…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-muted/30"
          />

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-card border border-border/50 animate-shimmer" />
              ))}
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin pr-1">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                    selected?.id === p.id
                      ? "border-gold/40 bg-gold-muted"
                      : "border-border/50 bg-card hover:border-gold/20 hover:bg-white/3"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{p.nom}</p>
                      <p className="text-xs text-muted-foreground">{p.maison} · {p.concentration}</p>
                    </div>
                    {selected?.id === p.id && (
                      <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <FlaskConical className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  Aucun parfum trouvé.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Étape 2 : Avis */}
        <div className={`space-y-3 transition-opacity duration-300 ${!selected ? "opacity-40 pointer-events-none" : ""}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full gradient-gold flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
              2
            </span>
            <h2 className="text-sm font-medium text-foreground">Votre avis (2-3 phrases)</h2>
          </div>
          <Textarea
            placeholder="Une fragrance qui ouvre sur de la bergamote pétillante avant de révéler un cœur de rose intense et fumé. La base de santal et de musc laisse un sillage velouté et sophistiqué."
            rows={4}
            value={avis}
            onChange={(e) => setAvis(e.target.value)}
            className="bg-muted/30 resize-none"
            maxLength={280}
          />
          <p className="text-xs text-muted-foreground text-right">{avis.length}/280</p>
        </div>

        {/* Étape 3 : Prix */}
        <div className={`space-y-3 transition-opacity duration-300 ${!selected ? "opacity-40 pointer-events-none" : ""}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full gradient-gold flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
              3
            </span>
            <h2 className="text-sm font-medium text-foreground">Prix du décant 10 ml (CAD)</h2>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input
              type="number"
              step="0.50"
              min="0"
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              className="bg-muted/30 pl-7"
              placeholder="25.00"
            />
          </div>
        </div>

        {/* Aperçu sélection */}
        {selected && (
          <Card className="bg-card border-gold/20 animate-fadeInUp">
            <CardContent className="p-4">
              <p className="text-xs text-gold uppercase tracking-wider mb-2">Sélection</p>
              <p className="font-semibold text-foreground">{selected.nom}</p>
              <p className="text-sm text-muted-foreground">{selected.maison}</p>
              {(selected.notes_tete.length > 0 || selected.notes_coeur.length > 0 || selected.notes_fond.length > 0) && (
                <div className="mt-2 space-y-1">
                  {selected.notes_tete.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      <span className="text-yellow-400">●</span> {selected.notes_tete.join(", ")}
                    </p>
                  )}
                  {selected.notes_coeur.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      <span className="text-rose-400">●</span> {selected.notes_coeur.join(", ")}
                    </p>
                  )}
                  {selected.notes_fond.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      <span className="text-amber-700">●</span> {selected.notes_fond.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <Button
          onClick={handleNext}
          disabled={!selected || !avis.trim()}
          className="w-full gradient-gold text-primary-foreground h-12 text-base font-medium gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-5 h-5" />
          Générer la Story
          <ChevronRight className="w-5 h-5" />
        </Button>
      </main>
    </div>
  );
}
