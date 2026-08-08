import { loadEnvConfig } from "@next/env";
loadEnvConfig("./");

import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Extract arrays using regex to avoid TS compilation issues with Next.js imports in raw script
const file1 = fs.readFileSync("./app/api/seed-parfums/route.ts", "utf-8");
const file2 = fs.readFileSync("./app/api/seed-parfums-2/route.ts", "utf-8");
const file3 = fs.readFileSync("./scripts/do_seed.ts", "utf-8");

function extractArray(content: string, arrayName: string) {
  const match = content.match(new RegExp(`const ${arrayName} = (\\[[\\s\\S]*?\\]);\\n\\nexport`));
  if (match) {
    return eval(match[1]); // Safe here since we control the source files
  }
  // Try alternative regex for do_seed
  const match2 = content.match(new RegExp(`const PARFUMS = (\\[[\\s\\S]*?\\]);\\n\\nasync function`));
  if (match2) {
      return eval(match2[1]);
  }
  return [];
}

const batch1 = extractArray(file1, "PARFUMS");
const batch2 = extractArray(file2, "PARFUMS_BATCH_2");
const batch3 = extractArray(file3, "PARFUMS");

const batch4 = [
  // NOHO EMANI
  { maison: "NohoEmani", nom: "Art'Lequin", annee_lancement: 2024, concentration: "Extrait de Parfum", description: "Un oriental floral élégant et sucré.", notes_tete: "Jasmin Sambac, Iris, Bergamote", notes_coeur: "Sucre, Fleur d'oranger, Vanille", notes_fond: "Santal, Musc blanc, Patchouli" },
  { maison: "NohoEmani", nom: "Mon Paradis Blanc", annee_lancement: 2024, concentration: "Extrait de Parfum", description: "Un paradis enivrant aux notes de rhum et fruits secs.", notes_tete: "Fruits secs, Jasmin, Bergamote", notes_coeur: "Oliban, Rhum, Vanille", notes_fond: "Musc blanc, Musc noir, Cèdre, Ambre" },

  // PHENOM
  { maison: "Phenom", nom: "Ambrosia", annee_lancement: 2024, concentration: "Extrait de Parfum", description: "Une explosion fruitée tropicale lactée.", notes_tete: "Fruit de la passion, Mangue verte, Pêche", notes_coeur: "Jasmin, Lait de coco, Vanille", notes_fond: "Ambre, Cèdre, Fève Tonka" },
  { maison: "Phenom", nom: "Ouragan", annee_lancement: 2024, concentration: "Extrait de Parfum", description: "Un oud cuiré et épicé, puissant comme un ouragan.", notes_tete: "Violette, Safran, Dattes", notes_coeur: "Cuir, Ylang Ylang, Jasmin, Muscade", notes_fond: "Ambre, Oud Laotien, Santal, Baume Gurjan" },

  // THE PINK ARTIST
  { maison: "The Pink Artist", nom: "Lait d'Amande", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "Une amande amère réconfortante et vanillée.", notes_tete: "Amande amère", notes_coeur: "Benjoin, Amyris", notes_fond: "Fève tonka, Vanille" },

  // MAJESTIC MIST
  { maison: "Majestic Mist", nom: "Dynast'e", annee_lancement: 2025, concentration: "Extrait de Parfum", description: "Une dynastie olfactive solaire et ambrée.", notes_tete: "Cassis, Notes solaires, Cyclamen", notes_coeur: "Ambroxan, Benjoin, Ambre", notes_fond: "Santal, Fève Tonka, Vanille noire" },
  { maison: "Majestic Mist", nom: "Twilight", annee_lancement: 2025, concentration: "Extrait de Parfum", description: "Un crépuscule fruité, enivré de rhum.", notes_tete: "Cassis, Framboise, Cerise", notes_coeur: "Mûre, Labdanum, Amande", notes_fond: "Cashmeran, Vanille, Rhum" },
  { maison: "Majestic Mist", nom: "Petal Orchid", annee_lancement: 2025, concentration: "Extrait de Parfum", description: "Une gourmandise fruitée et florale succulente.", notes_tete: "Fraise des bois, Yuzu, Fruit de la passion", notes_coeur: "Vanille, Caramel, Orchidée, Pêche", notes_fond: "Santal, Coco, Ambre, Musc" },
  { maison: "Majestic Mist", nom: "Thames Breeze", annee_lancement: 2025, concentration: "Extrait de Parfum", description: "Le calme des jardins londoniens aux effluves lactées tropicales.", notes_tete: "Ananas, Vanille, Coco, Papaye", notes_coeur: "Vanille, Mangue, Lait", notes_fond: "Musc blanc, Mousse de chêne" },
  { maison: "Majestic Mist", nom: "Velvet Aura", annee_lancement: 2025, concentration: "Extrait de Parfum", description: "L'ambiance nocturne des clubs de jazz : café, rhum et caramel.", notes_tete: "Caramel, Amande, Poire", notes_coeur: "Café, Rhum, Vanille", notes_fond: "Musc blanc, Vanille, Caramel, Canne à sucre" },
];

const allParfums = [...batch1, ...batch2, ...batch3, ...batch4];
// Remove duplicates by name and maison
const uniqueParfums = Array.from(
  new Map(allParfums.map((p) => [p.maison + "|" + p.nom, p])).values()
);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log(`Démarrage du seeder global... (${uniqueParfums.length} parfums uniques à vérifier)`);
  let inserted = 0;
  let errors = [];

  for (const parfum of uniqueParfums) {
    try {
      const { data: existing } = await supabase
        .from("parfums")
        .select("id")
        .eq("maison", parfum.maison)
        .eq("nom", parfum.nom)
        .single();
      
      if (!existing) {
        // Map the properties to match the SQL schema exactly
        const payload = {
          nom: parfum.nom,
          maison: parfum.maison,
          annee: parfum.annee_lancement || parfum.annee || null,
          concentration: parfum.concentration || 'Eau de Parfum',
          genre: parfum.genre || 'Mixte',
          description: parfum.description || null,
          // Convert string notes to arrays
          notes_tete: parfum.notes_tete ? (typeof parfum.notes_tete === 'string' ? parfum.notes_tete.split(',').map((s: string) => s.trim()) : parfum.notes_tete) : [],
          notes_coeur: parfum.notes_coeur ? (typeof parfum.notes_coeur === 'string' ? parfum.notes_coeur.split(',').map((s: string) => s.trim()) : parfum.notes_coeur) : [],
          notes_fond: parfum.notes_fond ? (typeof parfum.notes_fond === 'string' ? parfum.notes_fond.split(',').map((s: string) => s.trim()) : parfum.notes_fond) : [],
        };

        const { error } = await supabase.from("parfums").insert(payload);
        if (error) {
          console.error("Erreur d'insertion pour", parfum.nom, error);
          errors.push(error);
        } else {
          console.log("✅ Inséré:", parfum.maison, "-", parfum.nom);
          inserted++;
        }
      } else {
        console.log("⏳ Déjà existant:", parfum.maison, "-", parfum.nom);
      }
    } catch (err) {
      console.error("Exception pour", parfum.nom, err);
      errors.push(err);
    }
  }

  console.log(`\nImport global terminé ! ${inserted} parfums fraîchement insérés.`);
  if (errors.length > 0) {
    console.error(`Il y a eu ${errors.length} erreurs.`);
  }
}

seed();
