import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const PARFUMS_BATCH_2 = [
  // AMOUAGE
  { maison: "Amouage", nom: "Purpose", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Un réveil chamanique, boisé et mystique.", notes_tete: "Bergamote, Baies roses, Encens", notes_coeur: "Vétiver, Papyrus, Rose", notes_fond: "Bois de santal, Bois mystique" },
  { maison: "Amouage", nom: "Guidance 46", annee_lancement: 2024, concentration: "Extrait de Parfum", description: "L'extrait surpuissant du best-seller, fruité et boisé.", notes_tete: "Poire, Noisette", notes_coeur: "Rose, Safran, Jasmin", notes_fond: "Santal, Vanille, Ambre" },

  // REINVENTED / KAJAL / SOSPIRO
  { maison: "Reinvented", nom: "Aether Aura", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "Une aura florale ambrée addictive.", notes_tete: "Agrumes, Epices", notes_coeur: "Fleurs blanches", notes_fond: "Ambre, Musc" },
  { maison: "Kajal", nom: "Dahab Absolu", annee_lancement: 2024, concentration: "Extrait de Parfum", description: "L'or absolu, encore plus fruité et intense.", notes_tete: "Pomme verte, Bergamote", notes_coeur: "Fruits de la passion, Coriandre", notes_fond: "Musc, Ambre" },
  { maison: "Kajal", nom: "Lamar Caviar", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Une innovation sans alcool en forme de perles de caviar.", notes_tete: "Ananas, Fruits rouges", notes_coeur: "Rose, Jasmin", notes_fond: "Vanille, Ambre" },
  { maison: "Sospiro", nom: "Vibrato", annee_lancement: 2022, concentration: "Eau de Parfum", description: "Une vibration d'agrumes et de gingembre sur fond poudré.", notes_tete: "Pamplemousse, Bergamote", notes_coeur: "Gingembre, Notes poudrées", notes_fond: "Musc, Bois de cèdre" },
  { maison: "Sospiro", nom: "Dolce Melodia", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Une mélodie douce et fruitée.", notes_tete: "Mandarine, Safran", notes_coeur: "Rose, Jasmin", notes_fond: "Vanille, Santal" },
  { maison: "Sospiro", nom: "Erba Pura Magica", annee_lancement: 2022, concentration: "Eau de Parfum", description: "Une version magique de la célèbre salade de fruits.", notes_tete: "Agrumes, Fruits fruités", notes_coeur: "Jasmin", notes_fond: "Ambre, Musc, Caramel" },
  { maison: "Sospiro", nom: "Il Padrino", annee_lancement: 2023, concentration: "Eau de Parfum", description: "L'élégance sombre et boisée.", notes_tete: "Bergamote, Poivre", notes_coeur: "Bois nobles", notes_fond: "Cuir, Musc" },

  // PERRIS MONTE CARLO / XERJOFF / ROSENDO
  { maison: "Perris Monte Carlo", nom: "Vanille de Tahiti", annee_lancement: 2020, concentration: "Eau de Parfum", description: "L'authentique et pure vanille polynésienne aux accents floraux.", notes_tete: "Ylang-Ylang", notes_coeur: "Vanille de Tahiti, Champaca", notes_fond: "Santal, Musc" },
  { maison: "Xerjoff", nom: "Erba Pura", annee_lancement: 2013, concentration: "Eau de Parfum", description: "Une explosion de fruits méditerranéens juteux.", notes_tete: "Orange, Citron, Bergamote", notes_coeur: "Fruits fruités", notes_fond: "Musc blanc, Ambre, Vanille" },
  { maison: "Xerjoff", nom: "Naxos", annee_lancement: 2015, concentration: "Eau de Parfum", description: "Le riche héritage sicilien: tabac, miel, lavande.", notes_tete: "Lavande, Bergamote", notes_coeur: "Miel, Cannelle, Cashmeran", notes_fond: "Feuille de tabac, Fève tonka, Vanille" },
  { maison: "Rosendo Mateu", nom: "Nº 5 Elixir", annee_lancement: 2022, concentration: "Extrait de Parfum", description: "L'addiction poussée à son paroxysme, plus riche et dense.", notes_tete: "Epices", notes_coeur: "Fleurs, Muguet", notes_fond: "Vanille, Ambre extrême, Musc" },

  // NEW NOTES / SHL
  { maison: "New Notes", nom: "Caramelo Vanilla", annee_lancement: 2022, concentration: "Extrait de Parfum", description: "Une vanille caramel fondante et décadente.", notes_tete: "Fleurs blanches", notes_coeur: "Caramel au beurre", notes_fond: "Vanille, Musc" },
  { maison: "Stéphane Humbert Lucas", nom: "Venom Incarnat", annee_lancement: 2022, concentration: "Eau de Parfum", description: "Un philtre d'amour à la fraise, rouge et venimeux.", notes_tete: "Fraise, Mûre", notes_coeur: "Framboise, Bois", notes_fond: "Cuir, Vanille" },
  { maison: "Stéphane Humbert Lucas", nom: "God of Fire", annee_lancement: 2022, concentration: "Eau de Parfum", description: "Le serpent mythique crachant un feu de mangue et gingembre.", notes_tete: "Mangue, Gingembre", notes_coeur: "Coumarine, Jasmin", notes_fond: "Oud, Musc, Ambre" },
  { maison: "Stéphane Humbert Lucas", nom: "Sea My Love", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Une exploration des profondeurs marines.", notes_tete: "Notes salées", notes_coeur: "Algues, Patchouli", notes_fond: "Ambre gris" },
  { maison: "Stéphane Humbert Lucas", nom: "Pink Boa", annee_lancement: 2022, concentration: "Eau de Parfum", description: "Un cocktail mordant et acidulé aux fruits rouges et vodka.", notes_tete: "Cassis, Romarin", notes_coeur: "Vodka, Framboise", notes_fond: "Musc, Patchouli" },
  { maison: "Stéphane Humbert Lucas", nom: "Mortal Skin", annee_lancement: 2015, concentration: "Eau de Parfum", description: "L'encre noire, la mûre et l'encens venimeux.", notes_tete: "Mûre, Encre", notes_coeur: "Iris, Opoponax", notes_fond: "Ambre, Musc, Bois" },
  { maison: "Stéphane Humbert Lucas", nom: "Soleil de Jeddah", annee_lancement: 2013, concentration: "Eau de Parfum", description: "Un soleil ardent de citron, camomille et cuir.", notes_tete: "Citron, Camomille", notes_coeur: "Iris, Ambre gris", notes_fond: "Cuir, Vanille, Iris" },
  { maison: "Stéphane Humbert Lucas", nom: "Sand Dance", annee_lancement: 2022, concentration: "Eau de Parfum", description: "Une danse du ventre enivrante de cacao et whisky.", notes_tete: "Crème de whisky, Coriandre", notes_coeur: "Cacao, Bois de santal", notes_fond: "Fève tonka, Cèdre" },
  { maison: "Stéphane Humbert Lucas", nom: "Panthea", annee_lancement: 2017, concentration: "Eau de Parfum", description: "Un floral poudré angélique.", notes_tete: "Bergamote", notes_coeur: "Iris, Jasmin", notes_fond: "Musc, Patchouli" },
  { maison: "Stéphane Humbert Lucas", nom: "Panthea Iris", annee_lancement: 2017, concentration: "Eau de Parfum", description: "L'élégance absolue de l'iris blanc.", notes_tete: "Thé blanc", notes_coeur: "Iris absolu", notes_fond: "Musc blanc" },
  { maison: "Stéphane Humbert Lucas", nom: "The Queen And The Viper", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Le duel vénéneux des rois.", notes_tete: "Notes vertes", notes_coeur: "Miel, Rose", notes_fond: "Cuir, Oud" },
  { maison: "Stéphane Humbert Lucas", nom: "Crying Of Evil", annee_lancement: 2022, concentration: "Eau de Parfum", description: "Les pleurs de l'ange déchu : fruits rouges et cuir fumé.", notes_tete: "Fruits rouges, Epices", notes_coeur: "Tubéreuse, Cuir", notes_fond: "Oliban, Patchouli" },

  // CARNER BARCELONA / GIARDINI / NISHANE / MEMO
  { maison: "Carner Barcelona", nom: "Ibiza Nights", annee_lancement: 2020, concentration: "Eau de Parfum", description: "L'esprit vibrant et fruité d'Ibiza.", notes_tete: "Pomme, Poire", notes_coeur: "Ylang-ylang, Jasmin", notes_fond: "Vanille, Benjoin" },
  { maison: "Carner Barcelona", nom: "Tardes", annee_lancement: 2010, concentration: "Eau de Parfum", description: "Un coucher de soleil amandé en Espagne.", notes_tete: "Amande, Géranium", notes_coeur: "Prune, Rose", notes_fond: "Fève tonka, Musc" },
  { maison: "Carner Barcelona", nom: "Super Moon", annee_lancement: 2022, concentration: "Eau de Parfum", description: "La lune éclairant une grenade juteuse.", notes_tete: "Grenade, Cassis", notes_coeur: "Jasmin", notes_fond: "Patchouli" },
  { maison: "Carner Barcelona", nom: "Sal y Limon", annee_lancement: 2022, concentration: "Eau de Parfum", description: "Une fraîcheur estivale salée et citronnée.", notes_tete: "Citron, Sel", notes_coeur: "Fleurs aquatiques", notes_fond: "Musc" },
  { maison: "Carner Barcelona", nom: "Volcano", annee_lancement: 2018, concentration: "Eau de Parfum", description: "Une chaleur boisée et épicée.", notes_tete: "Gingembre", notes_coeur: "Patchouli", notes_fond: "Oud" },
  { maison: "Giardini di Toscana", nom: "Celeste", annee_lancement: 2020, concentration: "Eau de Parfum", description: "Un floral blanc divin et poudré.", notes_tete: "Notes marines", notes_coeur: "Violette, Vanille", notes_fond: "Musc, Ambroxan" },
  { maison: "Nishane", nom: "Ani", annee_lancement: 2019, concentration: "Extrait de Parfum", description: "Une vanille verte, épicée et boisée d'une grande puissance.", notes_tete: "Gingembre, Bergamote, Poivre rose", notes_coeur: "Cardamome, Cassis, Rose", notes_fond: "Vanille, Bois de santal, Benjoin" },
  { maison: "Memo Paris", nom: "Abu Dhabi", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Le soleil d'Orient sur un cuir épicé.", notes_tete: "Cardamome", notes_coeur: "Safran", notes_fond: "Cuir, Ambre" },

  // JO MALONE / MES BISOUS / NOEME / MATIERE PREMIERE / THOO / RANIA J
  { maison: "Jo Malone", nom: "Myrrh & Tonka", annee_lancement: 2016, concentration: "Cologne Intense", description: "Riche, résineux et chaleureux.", notes_tete: "Lavande", notes_coeur: "Myrrhe namibienne", notes_fond: "Fève tonka, Vanille, Amande" },
  { maison: "Mes Bisous", nom: "A Wondrous Flight", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Un vol merveilleux, floral et joyeux.", notes_tete: "Pamplemousse", notes_coeur: "Fleurs", notes_fond: "Musc" },
  { maison: "Noème Paris", nom: "Khalil", annee_lancement: 2021, concentration: "Eau de Parfum", description: "Boisé et épicé, hommage aux contrées désertiques.", notes_tete: "Cardamome", notes_coeur: "Cèdre", notes_fond: "Oud" },
  { maison: "Matière Première", nom: "Encens Suave", annee_lancement: 2019, concentration: "Eau de Parfum", description: "Un encens noir, gourmand, torréfié au café et à la vanille.", notes_tete: "Café", notes_coeur: "Encens Somalie", notes_fond: "Vanille Madagascar, Labdanum" },
  { maison: "The House Of Oud", nom: "What About Pop", annee_lancement: 2019, concentration: "Eau de Parfum", description: "Le pop-corn caramel au beurre salé le plus luxueux.", notes_tete: "Popcorn, Caramel", notes_coeur: "Fleur de lune", notes_fond: "Ambre, Vanille" },
  { maison: "Rania J", nom: "Musc Moschus", annee_lancement: 2020, concentration: "Eau de Parfum", description: "Un musc végétal doux, poudré et boisé.", notes_tete: "Cassis", notes_coeur: "Musc", notes_fond: "Santal, Vanille" },
  { maison: "Rania J", nom: "Ambre Loup", annee_lancement: 2012, concentration: "Eau de Parfum", description: "Un ambre animal, sauvage et épicé.", notes_tete: "Clou de girofle", notes_coeur: "Baume du Pérou", notes_fond: "Ambre, Castoréum, Oud" },

  // MAISON MATAHA / YSL / CRIVELLI
  { maison: "Maison Mataha", nom: "Printemps Blanc", annee_lancement: 2024, concentration: "Extrait de Parfum", description: "La pureté d'un printemps floral et musqué.", notes_tete: "Muguet", notes_coeur: "Fleurs blanches", notes_fond: "Musc blanc" },
  { maison: "Yves Saint Laurent", nom: "Atlas Garden", annee_lancement: 2019, concentration: "Eau de Parfum", description: "Une promenade dans la palmeraie : datte et fleur d'oranger.", notes_tete: "Néroli, Mandarine", notes_coeur: "Fleur d'oranger, Datte", notes_fond: "Fève tonka, Ambroxan" },
  { maison: "Maison Crivelli", nom: "Hibiscus Mahajád", annee_lancement: 2021, concentration: "Extrait de Parfum", description: "Un thé à l'hibiscus rouge, cuiré et vanillé exceptionnel.", notes_tete: "Menthe, Cassis", notes_coeur: "Rose, Hibiscus", notes_fond: "Vanille, Cuir" },
  { maison: "Maison Crivelli", nom: "Oud Maracujá", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "L'improbable rencontre du fruit de la passion juteux et de l'oud sombre.", notes_tete: "Fruit de la passion, Rose", notes_coeur: "Oud", notes_fond: "Patchouli, Cuir, Akigalawood" },
  { maison: "Maison Crivelli", nom: "Cuir Infrarouge", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "Un cuir framboise explosif et futuriste.", notes_tete: "Framboise", notes_coeur: "Iris", notes_fond: "Cuir, Oud" },
  { maison: "Maison Crivelli", nom: "Tubéreuse Astrale", annee_lancement: 2024, concentration: "Extrait de Parfum", description: "Une tubéreuse spatiale épicée à la cannelle.", notes_tete: "Cannelle", notes_coeur: "Tubéreuse", notes_fond: "Vanille, Musc" },
  { maison: "Marc-Antoine Barrois", nom: "Ganymède", annee_lancement: 2019, concentration: "Eau de Parfum", description: "Le cuir minéral salé et métallique légendaire.", notes_tete: "Mandarine", notes_coeur: "Osmanthus, Safran", notes_fond: "Akigalawood, Immortelle" },

  // LIQUIDES IMAGINAIRES / PRINCES DU GOLFE / KILIAN
  { maison: "Les Liquides Imaginaires", nom: "Liquide Gold", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Solaire, lumineux et ambré.", notes_tete: "Safran", notes_coeur: "Fleurs solaires", notes_fond: "Ambre" },
  { maison: "Les Liquides Imaginaires", nom: "Bête Humaine", annee_lancement: 2020, concentration: "Eau de Parfum", description: "Une peau animale et boisée dans une forêt dense.", notes_tete: "Feuilles de violette", notes_coeur: "Bois de gaïac", notes_fond: "Cuir, Vétiver" },
  { maison: "Les Liquides Imaginaires", nom: "Dom Rosa", annee_lancement: 2013, concentration: "Eau de Parfum", description: "Le champagne rosé de la parfumerie.", notes_tete: "Accord Champagne, Pomélo", notes_coeur: "Rose de Damas", notes_fond: "Bois de cèdre, Vétiver" },
  { maison: "Les Liquides Imaginaires", nom: "Désert Suave", annee_lancement: 2018, concentration: "Eau de Parfum", description: "Un souffle épicé et fruité venu du désert.", notes_tete: "Cardamome, Datte", notes_coeur: "Rose, Fleur d'oranger", notes_fond: "Sésame grillé" },
  { maison: "Les Princes du Golfe", nom: "Mint Tea", annee_lancement: 2022, concentration: "Eau de Parfum", description: "La fraîcheur du thé à la menthe marocain.", notes_tete: "Menthe verte", notes_coeur: "Thé noir", notes_fond: "Sucre" },
  { maison: "Les Princes du Golfe", nom: "Fresh Tonka", annee_lancement: 2022, concentration: "Eau de Parfum", description: "Une fève tonka hespéridée étonnante.", notes_tete: "Citron", notes_coeur: "Lavande", notes_fond: "Fève Tonka" },
  { maison: "Kilian Paris", nom: "Black Phantom", annee_lancement: 2017, concentration: "Eau de Parfum", description: "Mémento Mori : Rhum, Café, Chocolat et Caramel.", notes_tete: "Rhum, Sucre de canne", notes_coeur: "Café, Cacao", notes_fond: "Bois de santal, Amande" },
  
  // ATELIER DES FEVES
  { maison: "Atelier des Fèves", nom: "Noble Tonka", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Fève tonka riche et sophistiquée.", notes_tete: "Epices douces", notes_coeur: "Fève tonka", notes_fond: "Bois précieux" },
];

export async function GET() {
  const supabase = await createServerSupabaseClient();

  let inserted = 0;
  let errors: any[] = [];

  for (const parfum of PARFUMS_BATCH_2) {
    try {
      const { data: existing } = await (supabase as any)
        .from("parfums")
        .select("id")
        .eq("maison", parfum.maison)
        .eq("nom", parfum.nom)
        .single();
      
      if (!existing) {
        const { error } = await (supabase as any).from("parfums").insert(parfum);
        if (error) {
          errors.push(error);
        } else {
          inserted++;
        }
      }
    } catch (err: any) {
      errors.push(err);
    }
  }

  return NextResponse.json({ message: "Import Batch 2 terminé", inserted, errors });
}
