import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { StoryGeneratorPage } from "./story-generator-page";

export const metadata: Metadata = { title: "Générer la Story" };

interface PageProps {
  searchParams: Promise<{
    parfumId?: string;
    avis?: string;
    prix?: string;
  }>;
}

export default async function GenererPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { parfumId, avis, prix } = params;

  if (!parfumId) {
    notFound();
  }

  const supabase = await createServerSupabaseClient();
  const { data: parfum } = await supabase
    .from("parfums")
    .select("*")
    .eq("id", parfumId)
    .single();

  if (!parfum) {
    notFound();
  }

  return (
    <StoryGeneratorPage
      parfum={parfum}
      avis={avis ?? ""}
      prix={prix ?? "25.00"}
    />
  );
}
