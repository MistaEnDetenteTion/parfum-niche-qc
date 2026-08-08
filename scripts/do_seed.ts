import { loadEnvConfig } from "@next/env";
loadEnvConfig("./");

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const PARFUMS = [
  // LORENZO PAZZAGLIA
  { maison: "Lorenzo Pazzaglia", nom: "Tropykalis Karma", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "Un cocktail tropical intense et fruité, parfait pour l'été.", notes_tete: "Mangue, Passion", notes_coeur: "Fleurs tropicales", notes_fond: "Vanille, Musc" },
  { maison: "Lorenzo Pazzaglia", nom: "Gin Fusion", annee_lancement: 2022, concentration: "Extrait de Parfum", description: "Une explosion aromatique rafraîchissante inspirée du gin.", notes_tete: "Baies de genévrier, Citron", notes_coeur: "Herbes aromatiques", notes_fond: "Bois de cèdre" },
  { maison: "Lorenzo Pazzaglia", nom: "Cherry Ink", annee_lancement: 2022, concentration: "Extrait de Parfum", description: "Une cerise noire intense mêlée à des notes d'encre et de bois sombre.", notes_tete: "Cerise noire", notes_coeur: "Encre, Amande", notes_fond: "Bois sombres, Musc" },
  { maison: "Lorenzo Pazzaglia", nom: "Sun-gria", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "L'essence festive et fruitée d'une sangria ensoleillée.", notes_tete: "Agrumes, Vin rouge", notes_coeur: "Fruits rouges, Pêche", notes_fond: "Bois doux" },
  { maison: "Lorenzo Pazzaglia", nom: "Pax", annee_lancement: 2021, concentration: "Extrait de Parfum", description: "Une fragrance boisée et résineuse, profonde et méditative.", notes_tete: "Encens, Poivre", notes_coeur: "Bois de santal", notes_fond: "Résines, Ambre" },
  { maison: "Lorenzo Pazzaglia", nom: "Pink Milk", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "Une douceur lactée et fruitée très régressive.", notes_tete: "Fraise, Lait", notes_coeur: "Sucre", notes_fond: "Vanille" },

  // PLACE DE LA REVERIE / ULYKA
  { maison: "Place de la Rêverie", nom: "Santal de Paris", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Un bois de santal crémeux et urbain.", notes_tete: "Cardamome", notes_coeur: "Santal, Iris", notes_fond: "Musc" },
  { maison: "Ulyka", nom: "Nota Sugar", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Une bombe sucrée et gourmande addictive.", notes_tete: "Sucre de canne", notes_coeur: "Caramel", notes_fond: "Vanille, Musc" },
  { maison: "Ulyka", nom: "Nota Loca", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Un parfum pétillant et excentrique.", notes_tete: "Agrumes exotiques", notes_coeur: "Fleurs blanches", notes_fond: "Bois ambré" },
  { maison: "Ulyka", nom: "Nota Lucky", annee_lancement: 2024, concentration: "Eau de Parfum", description: "Une fragrance fraîche et joyeuse.", notes_tete: "Citron vert", notes_coeur: "Muguet", notes_fond: "Musc blanc" },
  { maison: "Ulyka", nom: "Nota Vanilla", annee_lancement: 2024, concentration: "Eau de Parfum", description: "Une vanille pure et réconfortante.", notes_tete: "Vanille Bourbon", notes_coeur: "Gousse de vanille", notes_fond: "Bois de santal" },

  // LIQUIDES IMAGINAIRES
  { maison: "Les Liquides Imaginaires", nom: "Blanche Bête", annee_lancement: 2021, concentration: "Eau de Parfum", description: "Un lait musqué aux notes florales et boisées, mystique et doux.", notes_tete: "Lait, Ambrette", notes_coeur: "Tubéreuse, Jasmin", notes_fond: "Musc, Cacao, Vanille" },

  // DIOR
  { maison: "Dior", nom: "Rouge Trafalgar", annee_lancement: 2020, concentration: "Eau de Parfum", description: "Un cocktail de fruits rouges vif et pétillant.", notes_tete: "Fraise, Framboise, Cerise", notes_coeur: "Pamplemousse", notes_fond: "Musc, Patchouli" },
  { maison: "Dior", nom: "Gris Dior", annee_lancement: 2018, concentration: "Eau de Parfum", description: "L'élégance absolue d'un chypre floral gris.", notes_tete: "Bergamote", notes_coeur: "Rose, Jasmin", notes_fond: "Patchouli, Mousse de chêne, Ambre" },
  { maison: "Dior", nom: "Oud Ispahan", annee_lancement: 2012, concentration: "Eau de Parfum", description: "La rencontre intense de la rose de Damas et du bois de oud.", notes_tete: "Labdanum", notes_coeur: "Rose, Patchouli", notes_fond: "Bois de Oud, Santal" },

  // LOUIS VUITTON
  { maison: "Louis Vuitton", nom: "Les Sables Roses", annee_lancement: 2019, concentration: "Eau de Parfum", description: "L'infinité du désert à travers un sillage rose et oud.", notes_tete: "Rose", notes_coeur: "Oud, Poivre noir", notes_fond: "Ambregris" },
  { maison: "Louis Vuitton", nom: "Apogée", annee_lancement: 2016, concentration: "Eau de Parfum", description: "Un hommage au muguet, pur et poétique.", notes_tete: "Orange, Mandarine", notes_coeur: "Muguet, Jasmin, Rose", notes_fond: "Bois de gaïac, Santal" },
  { maison: "Louis Vuitton", nom: "Nouveau Monde", annee_lancement: 2018, concentration: "Eau de Parfum", description: "Un contraste saisissant entre oud corsé et cacao.", notes_tete: "Cacao", notes_coeur: "Oud, Safran", notes_fond: "Oliban" },
  { maison: "Louis Vuitton", nom: "Imagination", annee_lancement: 2021, concentration: "Eau de Parfum", description: "Un voyage exceptionnel autour du thé noir et de l'ambre.", notes_tete: "Cédrat, Bergamote", notes_coeur: "Thé noir de Chine, Néroli", notes_fond: "Ambroxan, Gaïac" },
  { maison: "Louis Vuitton", nom: "Météore", annee_lancement: 2020, concentration: "Eau de Parfum", description: "Une fraîcheur fusante et lumineuse épicée.", notes_tete: "Mandarine, Orange douce", notes_coeur: "Poivre, Muscade", notes_fond: "Vétiver" },
  { maison: "Louis Vuitton", nom: "Ombre Nomade", annee_lancement: 2018, concentration: "Eau de Parfum", description: "Un oud sombre, fumé et d'une puissance légendaire.", notes_tete: "Bois de Oud, Géranium", notes_coeur: "Framboise, Rose", notes_fond: "Encens, Benjoin" },

  // LIBRERY PARFUM
  { maison: "Librery Parfum", nom: "Palmeira", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Un parfum vert et exotique évoquant la palmeraie.", notes_tete: "Notes vertes", notes_coeur: "Palmier", notes_fond: "Bois" },
  { maison: "Librery Parfum", nom: "Amber Sunset", annee_lancement: 2023, concentration: "Eau de Parfum", description: "La chaleur ambrée d'un coucher de soleil.", notes_tete: "Mandarine", notes_coeur: "Ambre", notes_fond: "Vanille" },
  { maison: "Librery Parfum", nom: "Mango Wave", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Une déferlante de mangue juteuse.", notes_tete: "Mangue", notes_coeur: "Fruits tropicaux", notes_fond: "Musc" },
  { maison: "Librery Parfum", nom: "Sun Ice", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Le contraste du soleil éclatant sur la glace.", notes_tete: "Menthe glaciale", notes_coeur: "Agrumes", notes_fond: "Musc blanc" },

  // BEY PARFUM
  { maison: "Bey Parfum", nom: "Santal de Banda", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "Santal onctueux et épices.", notes_tete: "Cardamome", notes_coeur: "Bois de Santal", notes_fond: "Ambre" },
  { maison: "Bey Parfum", nom: "Cachemire Blanc", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "Un voile musqué et cotonneux.", notes_tete: "Aldéhydes", notes_coeur: "Musc blanc", notes_fond: "Bois doux" },

  // NICOLAÏ
  { maison: "Nicolaï Parfumeur-Créateur", nom: "Pavlova", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Inspiré par le célèbre dessert à la meringue et fruits rouges.", notes_tete: "Fruits rouges", notes_coeur: "Meringue", notes_fond: "Vanille" },
  { maison: "Nicolaï Parfumeur-Créateur", nom: "Fig Tea", annee_lancement: 2000, concentration: "Eau de Parfum", description: "L'infusion parfaite de figue, osmanthus et thé.", notes_tete: "Figue, Osmanthus", notes_coeur: "Maté, Coriandre", notes_fond: "Bois de Gaïac" },

  // NOEME PARIS
  { maison: "Noème Paris", nom: "Bleu de Bleu", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Un plongeon abyssal et rafraîchissant.", notes_tete: "Notes marines", notes_coeur: "Algues, Sel", notes_fond: "Ambregris" },
  { maison: "Noème Paris", nom: "Vanille de Sambava", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Une somptueuse vanille de Madagascar.", notes_tete: "Sucre roux", notes_coeur: "Vanille pure", notes_fond: "Bois de santal" },

  // MAISON DE SOIE / ATELIER DES FEVES / MATAHA / MAGISTRAL
  { maison: "Maison de Soie", nom: "Suave Addiction", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Gourmandise addictive et suave.", notes_tete: "Caramel", notes_coeur: "Fleurs blanches", notes_fond: "Musc, Vanille" },
  { maison: "Atelier des Fèves", nom: "Bois Vendôme", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Boiserie élégante parisienne.", notes_tete: "Bergamote", notes_coeur: "Cèdre", notes_fond: "Santal" },
  { maison: "Atelier des Fèves", nom: "Figue de Minuit", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Une figue sombre et nocturne.", notes_tete: "Figue noire", notes_coeur: "Feuille de figuier", notes_fond: "Bois sombres" },
  { maison: "Atelier des Fèves", nom: "Liqueur Framboise", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Un alcool de framboise capiteux.", notes_tete: "Framboise", notes_coeur: "Liqueur", notes_fond: "Bois" },
  { maison: "Atelier des Fèves", nom: "Vanille Alchimique", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Transformation mystique de la vanille.", notes_tete: "Vanille", notes_coeur: "Ambre", notes_fond: "Encens" },
  { maison: "Atelier des Fèves", nom: "Crème Anglaise", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Gourmandise ultime de crème vanillée.", notes_tete: "Lait", notes_coeur: "Vanille, Oeuf", notes_fond: "Sucre" },
  { maison: "Atelier des Fèves", nom: "Cuir Saint Honoré", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Un cuir souple et luxueux.", notes_tete: "Safran", notes_coeur: "Cuir", notes_fond: "Musc" },
  { maison: "Maison Mataha", nom: "Pêche Velours", annee_lancement: 2024, concentration: "Extrait de Parfum", description: "Une pêche juteuse et veloutée sur lit de vanille.", notes_tete: "Pêche, Abricot", notes_coeur: "Crème", notes_fond: "Vanille, Musc blanc" },
  { maison: "Maison Mataha", nom: "Escapade Gourmande", annee_lancement: 2022, concentration: "Extrait de Parfum", description: "Le graal de la gourmandise, sucre noir et vanille.", notes_tete: "Sucre noir", notes_coeur: "Vanille", notes_fond: "Musc, Fève Tonka" },
  { maison: "Maison Magistral", nom: "Sweet Venin", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "Un poison délicieusement sucré.", notes_tete: "Amande amère", notes_coeur: "Cerise", notes_fond: "Vanille, Cuir" },
  { maison: "Maison Magistral", nom: "Toxic Infusion", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "Infusion ensorcelante et herbacée.", notes_tete: "Absinthe", notes_coeur: "Thé noir", notes_fond: "Patchouli" },
  { maison: "Maison Magistral", nom: "Golden Boa", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "Morsure ambrée et luxueuse.", notes_tete: "Safran", notes_coeur: "Rose", notes_fond: "Oud, Ambre" },
  { maison: "Maison Magistral", nom: "Black Sativa", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "Notes vertes et fumées illicites.", notes_tete: "Chanvre", notes_coeur: "Bois de cèdre", notes_fond: "Encens" },
  { maison: "Maison Magistral", nom: "Blue Mamba", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "Un venin aquatique et piquant.", notes_tete: "Notes marines", notes_coeur: "Poivre bleu", notes_fond: "Ambroxan" },

  // OTHERS
  { maison: "Stéphanie de Bruijn", nom: "Vanilla Baby", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Vanille poudrée et innocente.", notes_tete: "Bergamote", notes_coeur: "Iris, Vanille", notes_fond: "Musc poudré" },
  { maison: "Stéphanie de Bruijn", nom: "Mecca Oud", annee_lancement: 2021, concentration: "Eau de Parfum", description: "Un Oud spirituel et mystique.", notes_tete: "Epices", notes_coeur: "Rose", notes_fond: "Oud, Encens" },
  { maison: "Jousset Parfums", nom: "Ciao Bello Pistachio", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "Une crème glacée à la pistache italienne ultra gourmande.", notes_tete: "Pistache, Crème", notes_coeur: "Noisette", notes_fond: "Vanille" },
  { maison: "Les Princes du Golfe", nom: "Citron Macaron", annee_lancement: 2022, concentration: "Eau de Parfum", description: "Un macaron citronné croquant et acidulé.", notes_tete: "Citron, Bergamote", notes_coeur: "Amande, Meringue", notes_fond: "Vanille" },
  { maison: "Les Princes du Golfe", nom: "Exquisit Pear", annee_lancement: 2022, concentration: "Eau de Parfum", description: "Une poire caramélisée exquise.", notes_tete: "Poire Williams", notes_coeur: "Caramel", notes_fond: "Vanille, Musc" },
  { maison: "Signature Royale", nom: "Signature Jade", annee_lancement: 2019, concentration: "Eau de Parfum", description: "Un bouquet fruité et ambré envoûtant.", notes_tete: "Bergamote, Fruits", notes_coeur: "Ambre", notes_fond: "Musc, Vanille" },
  { maison: "Ella K", nom: "Camélia K", annee_lancement: 2023, concentration: "Eau de Parfum", description: "L'éclat d'un camélia rouge et passionné.", notes_tete: "Gingembre, Fruit du dragon", notes_coeur: "Camélia, Jasmin", notes_fond: "Fève tonka, Vétiver" },
  
  // MONTALE & MANCERA
  { maison: "Montale", nom: "Arabians Tonka", annee_lancement: 2019, concentration: "Eau de Parfum", description: "Le pur sang arabe revisité avec une puissance sucrée colossale.", notes_tete: "Safran, Bergamote", notes_coeur: "Rose, Oud", notes_fond: "Fève tonka, Sucre, Musc" },
  { maison: "Mancera", nom: "Cherry Cherry", annee_lancement: 2024, concentration: "Eau de Parfum", description: "Une cerise acidulée et boisée.", notes_tete: "Cerise, Citron", notes_coeur: "Rose, Jasmin", notes_fond: "Vanille, Musc blanc" },
  { maison: "Mancera", nom: "French Riviera", annee_lancement: 2022, concentration: "Eau de Parfum", description: "L'air marin, les agrumes et le soleil de la côte d'Azur.", notes_tete: "Citron, Orange", notes_coeur: "Notes marines, Sel", notes_fond: "Cèdre, Musc" },
  { maison: "Mancera", nom: "Amore Caffè", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Un affogato italien, café noir et glace vanille.", notes_tete: "Café noir, Liqueur", notes_coeur: "Amaretto", notes_fond: "Glace Vanille, Sucre roux" },
  { maison: "Mancera", nom: "Instant Crush", annee_lancement: 2019, concentration: "Eau de Parfum", description: "Un sillage nucléaire safrané, ambré et irrésistible.", notes_tete: "Safran, Gingembre", notes_coeur: "Rose, Jasmin, Ambre", notes_fond: "Santal, Vanille, Mousse de chêne" },
  { maison: "Mancera", nom: "Roses Vanille", annee_lancement: 2011, concentration: "Eau de Parfum", description: "La douceur d'un loukoum à la rose saupoudré de sucre.", notes_tete: "Citron de Calabre", notes_coeur: "Loukoum à la rose", notes_fond: "Vanille, Bois de cèdre, Musc" },
  
  // MORE OTHERS
  { maison: "Maison Massimo", nom: "La Rose Bleu", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Une rose bleue mystique et rafraîchissante.", notes_tete: "Notes marines", notes_coeur: "Rose", notes_fond: "Musc" },
  { maison: "Jean Couturier", nom: "Vanilla Exotica", annee_lancement: 2020, concentration: "Eau de Toilette", description: "Vanille douce et noix de coco des îles.", notes_tete: "Noix de coco", notes_coeur: "Fleurs blanches", notes_fond: "Vanille, Sucre" },
  { maison: "Giardini di Toscana", nom: "Bianco Latte", annee_lancement: 2020, concentration: "Eau de Parfum", description: "Le best-seller absolu : caramel, lait, miel et vanille.", notes_tete: "Caramel", notes_coeur: "Miel, Coumarine", notes_fond: "Vanille, Musc blanc" },
  
  // XERJOFF & TIZIANA
  { maison: "Xerjoff", nom: "Torino21", annee_lancement: 2021, concentration: "Eau de Parfum", description: "La fraîcheur explosive de la menthe et du citron.", notes_tete: "Menthe, Citron, Basilic", notes_coeur: "Romarin, Jasmin", notes_fond: "Musc, Verveine" },
  { maison: "Xerjoff", nom: "La Capitale", annee_lancement: 2018, concentration: "Eau de Parfum", description: "Une fraise ambrée et cuirée d'un luxe absolu.", notes_tete: "Fraise, Caramel", notes_coeur: "Cuir, Rose, Safran", notes_fond: "Vanille, Benjoin" },
  { maison: "Tiziana Terenzi", nom: "Kirke", annee_lancement: 2015, concentration: "Extrait de Parfum", description: "Un cocktail de fruits de la passion sur un musc envoûtant.", notes_tete: "Fruit de la passion, Pêche", notes_coeur: "Muguet", notes_fond: "Musc, Patchouli, Santal" },
  
  // MORE
  { maison: "Reinvented", nom: "Sacred Bond", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "Une création ambrée intense et persistante.", notes_tete: "Bergamote, Mandarine", notes_coeur: "Fleurs blanches", notes_fond: "Ambre, Musc, Caramel" },
  { maison: "Gritti", nom: "Chantilly", annee_lancement: 2018, concentration: "Eau de Parfum", description: "Une corbeille de fruits enveloppée d'une crème vanillée.", notes_tete: "Melon, Fraise", notes_coeur: "Fleurs", notes_fond: "Vanille, Poudre" },
  { maison: "Rosendo Mateu", nom: "Rosendo Mateu Nº 5", annee_lancement: 2017, concentration: "Eau de Parfum", description: "Floral, Ambre, Musc Sensuel - L'addiction pure.", notes_tete: "Notes florales exotiques", notes_coeur: "Oeillet, Muguet", notes_fond: "Ambre, Vanille, Musc" },
  { maison: "Rosendo Mateu", nom: "Rosendo Mateu Nº 6", annee_lancement: 2018, concentration: "Eau de Parfum", description: "Bois de santal, racines et musc.", notes_tete: "Jasmin", notes_coeur: "Santal", notes_fond: "Musc, Ambre" },
  { maison: "Kajal", nom: "Lamar", annee_lancement: 2020, concentration: "Eau de Parfum", description: "La beauté de l'or liquide à l'ananas.", notes_tete: "Ananas, Fruits rouges", notes_coeur: "Rose bulgare, Jasmin", notes_fond: "Vanille, Ambre, Musc" },
  { maison: "Kajal", nom: "Ruby", annee_lancement: 2022, concentration: "Eau de Parfum", description: "Des baies rouges scintillantes.", notes_tete: "Fruits rouges", notes_coeur: "Rose", notes_fond: "Vanille" },
  { maison: "Nishane", nom: "Hundred Silent Ways", annee_lancement: 2016, concentration: "Extrait de Parfum", description: "Un floral blanc crémeux et vanillé spectaculaire.", notes_tete: "Tubéreuse, Pêche", notes_coeur: "Jasmin, Gardénia", notes_fond: "Vanille, Santal" },
  { maison: "Nishane", nom: "Hacivat", annee_lancement: 2017, concentration: "Extrait de Parfum", description: "Un ananas chypré d'une tenue nucléaire.", notes_tete: "Ananas, Pamplemousse", notes_coeur: "Cèdre, Patchouli", notes_fond: "Mousse de chêne, Bois" },

  // KILIAN
  { maison: "Kilian Paris", nom: "Rolling in Love", annee_lancement: 2019, concentration: "Eau de Parfum", description: "Un musc de peau intimiste à l'amande.", notes_tete: "Lait d'amande, Ambrette", notes_coeur: "Iris, Freesia", notes_fond: "Tubéreuse, Musc, Vanille" },
  { maison: "Kilian Paris", nom: "Princess", annee_lancement: 2018, concentration: "Eau de Parfum", description: "Un thé matcha marshmallow.", notes_tete: "Citron", notes_coeur: "Thé vert, Pomme", notes_fond: "Guimauve, Vanille" },
  { maison: "Kilian Paris", nom: "Vodka on the Rocks", annee_lancement: 2014, concentration: "Eau de Parfum", description: "L'effet d'un frisson de glace dans un verre de vodka.", notes_tete: "Cardamome, Coriandre", notes_coeur: "Rhubarbe, Muguet", notes_fond: "Mousse de chêne, Ambroxan" },
  { maison: "Kilian Paris", nom: "Angels' Share", annee_lancement: 2020, concentration: "Eau de Parfum", description: "L'essence du cognac mariée à la cannelle et la praline.", notes_tete: "Cognac", notes_coeur: "Cannelle, Fève tonka, Chêne", notes_fond: "Praline, Vanille, Santal" },
  { maison: "Kilian Paris", nom: "Love, don't be shy", annee_lancement: 2007, concentration: "Eau de Parfum", description: "Un marshmallow à la fleur d'oranger devenu iconique.", notes_tete: "Néroli, Bergamote", notes_coeur: "Fleur d'oranger, Chèvrefeuille", notes_fond: "Guimauve, Sucre, Vanille" },
  { maison: "Kilian Paris", nom: "Good girl gone Bad", annee_lancement: 2012, concentration: "Eau de Parfum", description: "Un tourbillon floral fruité explosif.", notes_tete: "Osmanthus, Jasmin, Rose", notes_coeur: "Tubéreuse, Narcisse", notes_fond: "Ambre, Cèdre" },
  { maison: "Kilian Paris", nom: "Old Fashioned", annee_lancement: 2024, concentration: "Eau de Parfum", description: "Un hommage sophistiqué au whisky en fût de chêne.", notes_tete: "Blé, Davana", notes_coeur: "Bois de cèdre, Immortelle", notes_fond: "Baume de Tolu, Styrax" },
  { maison: "Kilian Paris", nom: "Apple Brandy on the Rocks", annee_lancement: 2021, concentration: "Eau de Parfum", description: "La liqueur de pomme frappée sur glace.", notes_tete: "Cardamome, Bergamote", notes_coeur: "Pomme, Rhum, Brandy", notes_fond: "Bois de cèdre, Ambroxan" },
  { maison: "Kilian Paris", nom: "Smoking Hot", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Une fumée de shisha à la pomme, tabac et vanille.", notes_tete: "Pomme, Cannelle", notes_coeur: "Tabac, Mousse de chêne", notes_fond: "Vanille Bourbon, Orcanox" },

  // YSL, CRIVELLI, ETC
  { maison: "Yves Saint Laurent", nom: "Caban", annee_lancement: 2015, concentration: "Eau de Parfum", description: "La chaleur réconfortante de la fève tonka et du poivre rose.", notes_tete: "Poivre rose, Poivre noir", notes_coeur: "Oliban, Osmanthus", notes_fond: "Fève tonka, Patchouli" },
  { maison: "Yves Saint Laurent", nom: "Cuir", annee_lancement: 2016, concentration: "Eau de Parfum", description: "Un cuir sombre, fumé et d'une grande élégance.", notes_tete: "Rhum, Gingembre", notes_coeur: "Osmanthus, Thé noir", notes_fond: "Cuir, Bois de gaïac" },
  { maison: "Maison Crivelli", nom: "Secret Safran", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "Une explosion épicée et cuirée.", notes_tete: "Safran, Epices", notes_coeur: "Cuir", notes_fond: "Bois de santal" },
  { maison: "Les Eaux Primordiales", nom: "Mécanique Intuitive", annee_lancement: 2016, concentration: "Eau de Parfum", description: "Un ambré boisé moderne et abstrait.", notes_tete: "Violette", notes_coeur: "Fève tonka, Tabac", notes_fond: "Ambre, Cuir, Musc" },
  { maison: "Memo Paris", nom: "Odeon", annee_lancement: 2021, concentration: "Eau de Parfum", description: "Une rose orientale enveloppée de cuir et d'ambre.", notes_tete: "Datte, Rose", notes_coeur: "Safran, Santal", notes_fond: "Cuir, Musc" },
  { maison: "Memo Paris", nom: "Palais Bourbon", annee_lancement: 2022, concentration: "Eau de Parfum", description: "Un voyage épicé et majestueux.", notes_tete: "Epices", notes_coeur: "Fleurs blanches", notes_fond: "Bois ambré" },
  { maison: "Caron", nom: "Narcisse Blanc", annee_lancement: 2021, concentration: "Eau de Parfum", description: "L'éclat immaculé du narcisse et de la fleur d'oranger.", notes_tete: "Petitgrain", notes_coeur: "Narcisse, Fleur d'oranger", notes_fond: "Cashmeran, Mousse" },
  { maison: "Goutal", nom: "Vanille Exquise", annee_lancement: 2004, concentration: "Eau de Toilette", description: "Une vanille lactée, amandée et très douce.", notes_tete: "Angélique", notes_coeur: "Amande", notes_fond: "Vanille absolue, Musc" },
  { maison: "Maison Castel", nom: "Delectation", annee_lancement: 2022, concentration: "Eau de Parfum", description: "Un sillage riche et complexe.", notes_tete: "Agrumes", notes_coeur: "Notes florales", notes_fond: "Bois" },
  { maison: "New Notes", nom: "Musk Complexity", annee_lancement: 2022, concentration: "Extrait de Parfum", description: "Un musc contemporain, animal et poudré.", notes_tete: "Citron, Bergamote", notes_coeur: "Musc, Patchouli", notes_fond: "Civette, Ambre" },
  { maison: "Nuit Nomade", nom: "Ambre Khanjar", annee_lancement: 2022, concentration: "Eau de Parfum", description: "Un ambre tranchant, épicé et profond.", notes_tete: "Prune", notes_coeur: "Oliban, Ciste", notes_fond: "Vanille, Cuir" },
  { maison: "Pantheon Roma", nom: "Anniversario", annee_lancement: 2020, concentration: "Extrait de Parfum", description: "Une fraise confite sur fond de safran et de oud.", notes_tete: "Fraise, Pêche", notes_coeur: "Orchidée, Safran", notes_fond: "Oud, Musc, Patchouli" },
  
  // MFK & ARMANI
  { maison: "Maison Francis Kurkdjian", nom: "Baccarat Rouge 540", annee_lancement: 2015, concentration: "Eau de Parfum", description: "Le chef-d'oeuvre absolu, sucré, boisé et aéré.", notes_tete: "Jasmin, Safran", notes_coeur: "Amberwood", notes_fond: "Résine de sapin, Cèdre" },
  { maison: "Maison Francis Kurkdjian", nom: "Grand Soir", annee_lancement: 2016, concentration: "Eau de Parfum", description: "L'élégance parisienne en bouteille : ambre et vanille.", notes_tete: "Ciste Labdanum", notes_coeur: "Benjoin", notes_fond: "Fève tonka, Vanille, Ambre" },
  { maison: "Maison Francis Kurkdjian", nom: "Gentle Fluidity Gold", annee_lancement: 2019, concentration: "Eau de Parfum", description: "Une vanille musquée, épicée et lumineuse.", notes_tete: "Baies de genièvre, Noix de muscade", notes_coeur: "Coriandre", notes_fond: "Musc, Bois ambré, Vanille" },
  { maison: "Maison Francis Kurkdjian", nom: "Oud Satin Mood", annee_lancement: 2015, concentration: "Extrait de Parfum", description: "Un somptueux tissu de violette, rose et oud.", notes_tete: "Violette", notes_coeur: "Rose bulgare, Rose turque", notes_fond: "Oud, Vanille, Benjoin" },
  { maison: "Maison Francis Kurkdjian", nom: "Oud Silk Mood", annee_lancement: 2018, concentration: "Eau de Parfum", description: "Une rose bleue métallique, froide et envoûtante posée sur du oud.", notes_tete: "Bergamote, Camomille", notes_coeur: "Rose bulgare, Hedione", notes_fond: "Oud, Papyrus" },
  { maison: "Maison Francis Kurkdjian", nom: "APOM", annee_lancement: 2009, concentration: "Eau de Parfum", description: "A Part Of Me : L'alliance parfaite de la fleur d'oranger et du cèdre.", notes_tete: "Fleur d'oranger", notes_coeur: "Ylang-Ylang", notes_fond: "Bois de cèdre" },
  { maison: "Giorgio Armani", nom: "Indigo Tanzanite", annee_lancement: 2022, concentration: "Eau de Parfum", description: "L'aura mystique de l'Afrique à travers l'amande et le patchouli.", notes_tete: "Amande, Bergamote", notes_coeur: "Héliotrope, Lait", notes_fond: "Patchouli, Labdanum" },
  { maison: "Giorgio Armani", nom: "Magenta Tanzanite", annee_lancement: 2022, concentration: "Eau de Parfum", description: "Un tabac épicé et vibrant.", notes_tete: "Cardamome, Gingembre", notes_coeur: "Cannelle, Café", notes_fond: "Tabac, Vanille" },
  { maison: "Giorgio Armani", nom: "Musc Shamal", annee_lancement: 2019, concentration: "Eau de Parfum", description: "Le souffle chaud du désert capturé dans un nuage de musc et d'aldéhydes.", notes_tete: "Aldéhydes, Agrumes", notes_coeur: "Musc, Rose, Jasmin", notes_fond: "Bois de cèdre, Ambre" },
  { maison: "Giorgio Armani", nom: "Cuir Noir", annee_lancement: 2011, concentration: "Eau de Parfum", description: "L'art de la maroquinerie orientale.", notes_tete: "Coriandre, Muscade", notes_coeur: "Bois de Santal, Rose", notes_fond: "Cuir, Oud, Vanille" },
  { maison: "Giorgio Armani", nom: "Rose d'Arabie", annee_lancement: 2010, concentration: "Eau de Parfum", description: "L'incarnation parfaite du combo Rose-Oud, majestueux et opulent.", notes_tete: "Safran", notes_coeur: "Rose de Damas, Patchouli", notes_fond: "Oud, Ambre" },
  { maison: "Giorgio Armani", nom: "Oud Royal", annee_lancement: 2010, concentration: "Eau de Parfum", description: "Le bois d'agar élevé au rang d'œuvre d'art.", notes_tete: "Bois de Santal", notes_coeur: "Rose, Encens", notes_fond: "Oud, Safran, Ambre" },
  { maison: "Giorgio Armani", nom: "Bleu Lazuli", annee_lancement: 2018, concentration: "Eau de Parfum", description: "Une interprétation spirituelle du maté et du miel.", notes_tete: "Maté, Cardamome", notes_coeur: "Prune, Jasmin, Osmanthus", notes_fond: "Miel, Tabac, Vanille" },

  // TOM FORD, ANFAS, ETC
  { maison: "Tom Ford", nom: "Soleil Neige", annee_lancement: 2019, concentration: "Eau de Parfum", description: "L'éclat du soleil sur la poudreuse fraîche.", notes_tete: "Bergamote, Graine de carotte", notes_coeur: "Fleurs blanches, Rose, Jasmin", notes_fond: "Benjoin, Vanille, Labdanum" },
  { maison: "Eau de Soie", nom: "Nuit d'Aout", annee_lancement: 2023, concentration: "Eau de Parfum", description: "La douceur d'une nuit estivale.", notes_tete: "Fleurs d'oranger", notes_coeur: "Jasmin", notes_fond: "Musc blanc" },
  { maison: "Eau de Soie", nom: "Summer in Outer Banks", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Vacances et vent marin.", notes_tete: "Notes marines", notes_coeur: "Fleurs aquatiques", notes_fond: "Sable chaud" },
  { maison: "Eau de Soie", nom: "Peach Flake", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Une pêche gourmande et vanillée.", notes_tete: "Pêche", notes_coeur: "Vanille", notes_fond: "Sucre roux" },
  { maison: "Anfas", nom: "Rahaba", annee_lancement: 2017, concentration: "Extrait de Parfum", description: "L'hospitalité arabe dans une explosion de fruits exotiques et de bois.", notes_tete: "Ananas, Orange, Pêche", notes_coeur: "Rose, Orris", notes_fond: "Ambre, Oud, Vanille" },
  { maison: "Anfas", nom: "Aya", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "La douceur majestueuse.", notes_tete: "Bergamote", notes_coeur: "Jasmin", notes_fond: "Musc, Bois" },
  { maison: "Nectar Olfactif", nom: "Melipona", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "Le nectar des abeilles mayas, un miel divin.", notes_tete: "Miel", notes_coeur: "Fleurs jaunes", notes_fond: "Vanille, Ambre" },
  { maison: "Orlov Paris", nom: "De Young Red", annee_lancement: 2018, concentration: "Eau de Parfum", description: "Un rouge passion, fruité et éclatant.", notes_tete: "Poivre rose, Mandarine", notes_coeur: "Framboise, Rose", notes_fond: "Bois de santal, Musc" },
  { maison: "Guerlain", nom: "Tobacco Honey", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Un duel somptueux entre le miel d'Ouessant et la feuille de tabac.", notes_tete: "Miel, Anis", notes_coeur: "Tabac, Vanille, Tonka", notes_fond: "Oud, Santal" },
  { maison: "Guerlain", nom: "Rose Barbare", annee_lancement: 2005, concentration: "Eau de Parfum", description: "Un chypre à la rose, rebelle et sophistiqué.", notes_tete: "Aldéhydes, Rose", notes_coeur: "Rose de Damas, Fenugrec", notes_fond: "Miel, Patchouli, Sous-bois" },
  { maison: "Creed", nom: "Oud Zarian", annee_lancement: 2023, concentration: "Eau de Parfum", description: "Un Oud majestueux et moderne.", notes_tete: "Agrumes", notes_coeur: "Oud, Rose", notes_fond: "Bois de cèdre" },
  { maison: "Dries Van Noten", nom: "Rock The Myrrh", annee_lancement: 2022, concentration: "Eau de Parfum", description: "Une myrrhe fumée, rock et boisée.", notes_tete: "Cyprès, Poivre rose", notes_coeur: "Myrrhe, Patchouli", notes_fond: "Cuir, Benjoin" },
  { maison: "Byredo", nom: "Blanche", annee_lancement: 2009, concentration: "Eau de Parfum", description: "La pureté absolue du linge frais.", notes_tete: "Aldéhydes, Rose, Poivre rose", notes_coeur: "Pivoine, Violette, Fleur d'oranger", notes_fond: "Musc blanc, Bois blonds" },
  { maison: "Byredo", nom: "Bal d'Afrique", annee_lancement: 2009, concentration: "Eau de Parfum", description: "Un vétiver chaleureux et romantique inspiré de l'avant-garde parisienne.", notes_tete: "Citron, Souci, Cassis", notes_coeur: "Violette, Cyclamen, Jasmin", notes_fond: "Vétiver, Musc, Ambre" },
  
  // MATIERE PREMIERE
  { maison: "Matière Première", nom: "Radical Rose", annee_lancement: 2020, concentration: "Extrait de Parfum", description: "La plus forte concentration de Rose Centifolia absolue.", notes_tete: "Poivre de la Jamaïque", notes_coeur: "Rose Centifolia", notes_fond: "Patchouli, Labdanum" },
  { maison: "Matière Première", nom: "Vanilla Powder", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "Une vanille sombre contrastée par un bois blanc éclatant.", notes_tete: "Lait de coco", notes_coeur: "Vanille de Madagascar", notes_fond: "Palo Santo, Musc blanc" },
  { maison: "Matière Première", nom: "Parisian Musc", annee_lancement: 2019, concentration: "Eau de Parfum", description: "Un musc végétal et ambrette urbain.", notes_tete: "Graine d'ambrette", notes_coeur: "Cèdre de Virginie", notes_fond: "Ambrettolide, Musc" },
  { maison: "Matière Première", nom: "Santal Austral", annee_lancement: 2019, concentration: "Extrait de Parfum", description: "Un santal blanc crémeux et velouté.", notes_tete: "Iris", notes_coeur: "Bois de santal d'Australie", notes_fond: "Fève tonka, Benjoin" },
  { maison: "Matière Première", nom: "French Flower", annee_lancement: 2022, concentration: "Eau de Parfum", description: "L'envoûtante tubéreuse cultivée à Grasse.", notes_tete: "Poire, Poivre de Timut", notes_coeur: "Tubéreuse absolue, Tubéreuse enflorage", notes_fond: "Ambroxan" },

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

  // NEW BATCH PROVIDED BY USER
  { maison: "Jonathan Blanc", nom: "Délicieuse Crème Brulée", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "La rencontre du dessert emblématique et de la parfumerie orientale.", notes_tete: "Caramel, Sucre roux", notes_coeur: "Vanille de Madagascar, Fève de tonka", notes_fond: "Musc" },
  { maison: "Jonathan Blanc", nom: "Neige de Koh Samui", annee_lancement: 2025, concentration: "Extrait de Parfum", description: "Un paradis tropical mêlé à la douceur d'un riz au lait exotique.", notes_tete: "Fruit de la passion, Mangue, Goyave, Pastèque", notes_coeur: "Riz au lait, Lait de coco, Pêche", notes_fond: "Vanille, Caramel" },
  { maison: "Laboya", nom: "Pêya", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "Une gourmandise veloutée et fruitée.", notes_tete: "Pêche, Coco", notes_coeur: "Praline", notes_fond: "Vanille, Musc" },
  { maison: "Laboya", nom: "Coya", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "Une gourmandise fruitée et cacaotée.", notes_tete: "Noix de Coco, Amande", notes_coeur: "Cacao, Praline", notes_fond: "Fève tonka, Vanille, Musc" },
  { maison: "Laboya", nom: "Meya", annee_lancement: 2024, concentration: "Extrait de Parfum", description: "Un miel floral teinté de cerise.", notes_tete: "Cerise", notes_coeur: "Miel", notes_fond: "Hibiscus" },
  { maison: "Akro", nom: "Crush", annee_lancement: 2025, concentration: "Extrait de Parfum", description: "L'addiction irrésistible de l'amande, du litchi et de la rose.", notes_tete: "Amande, Litchi", notes_coeur: "Rose Bulgare", notes_fond: "Praline, Vanille" },
  { maison: "Room 1015", nom: "Jasmine Freak", annee_lancement: 2025, concentration: "Eau de Parfum", description: "Une tubéreuse et un jasmin explosifs et fruités.", notes_tete: "Mangue, Orange douce, Cassis, Poivre noir", notes_coeur: "Tubéreuse d'Inde, Jasmin d'Egypte, Ylang-ylang", notes_fond: "Musc, Bois de cachemire" },
  { maison: "D'Orsay", nom: "Tonka Hysteria", annee_lancement: 2024, concentration: "Eau de Parfum", description: "Une fève tonka épicée et résineuse.", notes_tete: "Résine oliban, Cannelle, Poivre rose, Mandarine", notes_coeur: "Racine d'iris, Muguet", notes_fond: "Fève de tonka, Vanille, Benjoin" },
  { maison: "Katana Parfums", nom: "Vanille Nacré", annee_lancement: 2026, concentration: "Extrait de Parfum", description: "Une vanille nacrée, fruitée et luxueuse.", notes_tete: "Pomme verte, Fève de tonka, Noix de Coco, Amande", notes_coeur: "Grenade, Praliné", notes_fond: "Vanille, Musc, Gaïac, Palissandre du Brésil" },
  { maison: "Kaliisma", nom: "Golden Frutti", annee_lancement: 2023, concentration: "Extrait de Parfum", description: "Une corbeille de fruits dorés étincelants.", notes_tete: "Poivre rose, Bergamote, Orange", notes_coeur: "Ananas, Pomme verte, Fraise, Framboise", notes_fond: "Musc, Notes boisées" },
  { maison: "AMEHA Paris", nom: "Poire Émeraude", annee_lancement: 2025, concentration: "Extrait de Parfum", description: "Une poire caramélisée, brillante comme une émeraude.", notes_tete: "Bergamote, Cerise, Poire", notes_coeur: "Caramel, Amande, Jasmin", notes_fond: "Vanille de Madagascar, Ambre" },
  { maison: "FOMOWA Paris", nom: "Red Keela Split", annee_lancement: 2024, concentration: "Extrait de Parfum", description: "Le banana split réinventé en parfum de niche gourmand.", notes_tete: "Citron d'Italie", notes_coeur: "Fraise, Banane, Sorbet, Fleur d'oranger", notes_fond: "Pistache, Crème fouettée, Vanille, Caramel, Fève de tonka, Ambroxan, Bois de santal" },
];

async function seed() {
  console.log("Démarrage du seeder...");
  let inserted = 0;
  let errors = [];

  for (const parfum of PARFUMS) {
    try {
      const { data: existing } = await supabase
        .from("parfums")
        .select("id")
        .eq("maison", parfum.maison)
        .eq("nom", parfum.nom)
        .single();
      
      if (!existing) {
        const { error } = await supabase.from("parfums").insert(parfum);
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

  console.log(`\nImport terminé ! ${inserted} parfums insérés.`);
  if (errors.length > 0) {
    console.error(`Il y a eu ${errors.length} erreurs.`);
  }
}

seed();
