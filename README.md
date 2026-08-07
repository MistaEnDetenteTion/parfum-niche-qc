# 🌟 Parfum Niche QC — E-commerce & Back-office

![Bannière du projet](https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2000&auto=format&fit=crop)

**Parfum Niche QC** est une plateforme web sur-mesure (Full-Stack) conçue pour la gestion et la promotion d'un commerce de parfums de niche et de décants (10ml) au Québec. 

Ce projet contient deux applications principales dans un seul monorepo :
1. **Un Dashboard Administrateur sécurisé** pour gérer l'inventaire, les grossistes, et calculer automatiquement les prix de revient et les marges de profit.
2. **Un Générateur de Story Instagram (Parfum du Jour)** pour créer instantanément des visuels marketing esthétiques au format 9:16.

---

## ✨ Fonctionnalités Principales

### 👑 1. Centre de Commande (Admin Dashboard)
- **Tableau de bord complet :** Vue d'ensemble des métriques clés (stock disponible, parfums actifs, lots en attente).
- **Gestion des Grossistes :** Suivi des fournisseurs, des devises (USD, EUR, GBP), des taux de change et des frais de livraison.
- **Gestion du Catalogue :** Création de fiches de parfums détaillées (maison, année, concentration, pyramide olfactive).
- **Lots de Commande :** Saisie des commandes avec conversion automatique en CAD et répartition des frais de port au millilitre.
- **Calculateur de Prix Temps Réel :** Simulateur avancé pour tester différentes marges et fixer le prix de vente parfait (décant 10ml et flacon entier).

### 📱 2. Parfum du Jour (Générateur de Stories)
- **Design Luxe et Minimaliste :** Esthétique très sombre (Dark Mode) avec accents dorés (`#c0a050`).
- **Génération d'images :** Conversion du code HTML/CSS directement en image PNG (1080x1920) prête à être publiée sur les réseaux sociaux.
- **Affichage des Notes Olfactives :** Intégration visuelle des notes de tête, cœur et fond.

---

## 🛠️ Stack Technique

- **Framework :** [Next.js 14](https://nextjs.org/) (App Router)
- **Langage :** [TypeScript](https://www.typescriptlang.org/) (Strict)
- **Base de données & Auth :** [Supabase](https://supabase.com/) (PostgreSQL, RLS, Triggers SQL)
- **Styling :** [Tailwind CSS v4](https://tailwindcss.com/)
- **Composants UI :** Shadcn UI / [Base UI](https://base-ui.com/)
- **Génération d'images :** `html-to-image`
- **Typographie :** Geist Font

---

## 🚀 Déploiement

Le projet est conçu pour être déployé sur **Vercel** avec une base de données hébergée chez **Supabase**.

### Variables d'environnement requises (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_votrecletreslongue...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_votrecletreslongue...
```

### Schéma de Base de données
La structure complète de la base de données (Tables, Enums, Triggers, RLS Policies et Fonctions de calcul) se trouve dans le fichier [`supabase/schema.sql`](./supabase/schema.sql). Il suffit de copier/coller ce code dans l'éditeur SQL de Supabase pour tout initialiser instantanément.

---

## 💻 Installation en local

```bash
# 1. Cloner le dépôt
git clone https://github.com/MistaEnDetenteTion/parfum-niche-qc.git

# 2. Installer les dépendances
cd parfum-niche-qc
npm install

# 3. Configurer les variables d'environnement
cp .env.local.example .env.local
# (Puis remplissez vos clés Supabase dans .env.local)

# 4. Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

---
*Créé avec passion pour l'excellence de la parfumerie de niche au Québec.* ⚜️
