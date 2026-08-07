"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { StoryGenerator } from "@/components/story/story-generator";
import type { Parfum } from "@/lib/supabase/types";

interface Props {
  parfum: Parfum;
  avis: string;
  prix: string;
}

export function StoryGeneratorPage({ parfum, avis, prix }: Props) {
  return (
    <div className="min-h-screen gradient-dark">
      {/* Header */}
      <header className="sticky top-0 z-10 glass border-b border-border/50 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link
            href="/story"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Modifier</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold">Story prête</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Titre */}
        <div className="text-center animate-fadeInUp">
          <h1 className="text-2xl font-light">
            Votre{" "}
            <span className="text-gradient-gold">Story 9:16</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {parfum.nom} · {parfum.maison}
          </p>
        </div>

        {/* Générateur avec aperçu et bouton téléchargement */}
        <div className="animate-fadeInUp">
          <StoryGenerator parfum={parfum} avis={avis} prix={prix} />
        </div>

        {/* Info */}
        <div className="glass rounded-xl p-4 text-sm text-muted-foreground space-y-2 animate-fadeInUp">
          <p className="font-medium text-foreground text-xs uppercase tracking-wider">
            Comment partager
          </p>
          <ol className="space-y-1.5 list-decimal list-inside text-xs">
            <li>Téléchargez l&apos;image PNG haute résolution</li>
            <li>Ouvrez Instagram → Nouveau Story</li>
            <li>Sélectionnez l&apos;image téléchargée</li>
            <li>Publiez avec le hashtag de votre commerce</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
