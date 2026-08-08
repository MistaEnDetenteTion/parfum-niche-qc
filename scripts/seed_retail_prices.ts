import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Generic retail pricing estimates by brand (MSRP)
// These are typical prices for standard volumes.
const BRAND_PRICING: Record<string, { volume: number; eur: number; cad: number }[]> = {
  "Lorenzo Pazzaglia": [
    { volume: 50, eur: 145, cad: 215 },
  ],
  "Maison Francis Kurkdjian": [
    { volume: 70, eur: 195, cad: 295 },
    { volume: 200, eur: 395, cad: 585 },
  ],
  "Parfums de Marly": [
    { volume: 75, eur: 235, cad: 345 },
    { volume: 125, eur: 310, cad: 450 },
  ],
  "Nishane": [
    { volume: 50, eur: 195, cad: 285 },
    { volume: 100, eur: 295, cad: 435 },
  ],
  "Amouage": [
    { volume: 50, eur: 245, cad: 360 },
    { volume: 100, eur: 345, cad: 510 },
  ],
  "Roja Parfums": [
    { volume: 50, eur: 395, cad: 580 },
    { volume: 100, eur: 595, cad: 875 },
  ],
  "Xerjoff": [
    { volume: 50, eur: 195, cad: 285 },
    { volume: 100, eur: 295, cad: 435 },
  ],
  "Initio Parfums Prives": [
    { volume: 90, eur: 275, cad: 405 },
  ],
  "Creed": [
    { volume: 50, eur: 220, cad: 325 },
    { volume: 100, eur: 320, cad: 475 },
  ],
  "Tom Ford": [
    { volume: 50, eur: 250, cad: 370 },
    { volume: 100, eur: 350, cad: 515 },
  ],
  "Byredo": [
    { volume: 50, eur: 155, cad: 230 },
    { volume: 100, eur: 225, cad: 330 },
  ],
  "Diptyque": [
    { volume: 75, eur: 150, cad: 220 },
  ],
  "Louis Vuitton": [
    { volume: 100, eur: 280, cad: 410 },
    { volume: 200, eur: 410, cad: 605 },
  ],
  "Bvlgari": [
    { volume: 100, eur: 310, cad: 455 },
  ],
  "Montale": [
    { volume: 50, eur: 70, cad: 105 },
    { volume: 100, eur: 110, cad: 165 },
  ],
  "Mancera": [
    { volume: 60, eur: 95, cad: 140 },
    { volume: 120, eur: 145, cad: 215 },
  ],
  "Tiziana Terenzi": [
    { volume: 100, eur: 265, cad: 390 },
  ],
  "Stéphane Humbert Lucas 777": [
    { volume: 50, eur: 195, cad: 285 },
  ],
  "Kilian": [
    { volume: 50, eur: 235, cad: 345 },
  ],
  "Maison Crivelli": [
    { volume: 30, eur: 95, cad: 140 },
    { volume: 100, eur: 195, cad: 285 },
  ],
  "Bdk Parfums": [
    { volume: 100, eur: 190, cad: 280 },
  ],
  "Matiere Premiere": [
    { volume: 50, eur: 145, cad: 215 },
    { volume: 100, eur: 215, cad: 315 },
  ],
  "Orto Parisi": [
    { volume: 50, eur: 165, cad: 245 },
  ],
  "Nasomatto": [
    { volume: 30, eur: 130, cad: 190 },
  ],
  "Clive Christian": [
    { volume: 50, eur: 450, cad: 660 },
  ],
  "Marc-Antoine Barrois": [
    { volume: 30, eur: 115, cad: 170 },
    { volume: 100, eur: 195, cad: 285 },
  ],
  "Fragrance Du Bois": [
    { volume: 50, eur: 395, cad: 580 },
    { volume: 100, eur: 695, cad: 1025 },
  ]
};

// Default generic price if brand not found (estimate for a standard 100ml niche)
const DEFAULT_PRICE = [
  { volume: 100, eur: 250, cad: 370 }
];

async function seedRetailPrices() {
  console.log("Starting retail price seeding...");

  const { data: parfums, error: fetchError } = await supabase
    .from("parfums")
    .select("id, nom, maison, prix_boutique_formats");

  if (fetchError) {
    console.error("Failed to fetch parfums:", fetchError);
    return;
  }

  console.log(`Found ${parfums.length} parfums. Updating...`);

  let updatedCount = 0;

  for (const parfum of parfums) {
    const maisonName = parfum.maison.trim();
    let formats = BRAND_PRICING[maisonName];

    // Some custom overrides if the name contains specific volume indicators or if it's a known Extrait (higher price)
    if (!formats) {
      formats = DEFAULT_PRICE;
    }

    // Update in DB
    const { error: updateError } = await supabase
      .from("parfums")
      .update({ prix_boutique_formats: formats })
      .eq("id", parfum.id);

    if (updateError) {
      console.error(`Failed to update ${parfum.maison} ${parfum.nom}:`, updateError);
    } else {
      updatedCount++;
      if (updatedCount % 20 === 0) {
        console.log(`Updated ${updatedCount}/${parfums.length}...`);
      }
    }
  }

  console.log(`\nSuccessfully updated ${updatedCount} parfums with retail prices!`);
}

seedRetailPrices().catch(console.error);
