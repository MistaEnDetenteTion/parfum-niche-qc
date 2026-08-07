"use client";

import { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { StoryCard } from "./story-card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Loader2 } from "lucide-react";
import type { Parfum } from "@/lib/supabase/types";

interface StoryGeneratorProps {
  parfum: Parfum;
  avis: string;
  prix: string;
}

export function StoryGenerator({ parfum, avis, prix }: StoryGeneratorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const dateStr = new Date().toLocaleDateString("fr-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleDownload = useCallback(async () => {
    if (!ref.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(ref.current, {
        width: 1080,
        height: 1920,
        pixelRatio: 2,
        quality: 0.98,
        style: {
          transform: "scale(2)",
          transformOrigin: "top left",
          width: "540px",
          height: "960px",
        },
      });

      const link = document.createElement("a");
      const nom = `${parfum.maison}-${parfum.nom}`.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      link.download = `parfum-du-jour-${nom}-${new Date().toISOString().split("T")[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Erreur génération image:", err);
    } finally {
      setDownloading(false);
    }
  }, [parfum]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Preview (affiché à 50% de la taille réelle) */}
      <div
        style={{
          transform: "scale(0.5)",
          transformOrigin: "top center",
          height: "480px",
          marginBottom: "-480px",
        }}
      >
        <div ref={ref}>
          <StoryCard
            parfum={parfum}
            avis={avis}
            prix={prix}
            dateStr={dateStr}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mt-4">
        <Button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 gradient-gold text-primary-foreground gap-2 h-12 text-base font-medium"
        >
          {downloading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Génération…
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Télécharger Story
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Format PNG 1080×1920 · Prêt pour Instagram Stories
      </p>
    </div>
  );
}
