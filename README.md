# 📁 Ikhodi – Système de gestion de portfolio

## 📝 Description
Ikhodi est une application web full-stack conçue pour présenter un portfolio de projets.
Elle dispose d’une interface publique pour que les visiteurs puissent parcourir les projets, ainsi qu’un panneau d’administration sécurisé pour gérer le contenu du portfolio.

Elle est construite avec Next.js et utilise une base de données MySQL pour la persistance des données.

## 🎯 Fonctionnalités

### 👥 Interface publique :
- Affiche une galerie de projets avec filtrage par catégorie (Design, Marketing, Web).
- Cartes interactives des projets avec effets au survol.
- Vue détaillée du projet dans une fenêtre modale, avec galerie d’images, description, client, année et services.
- Design responsive pour tous types d'appareils.
- Mode sombre / clair selon les préférences de l’utilisateur.

### 🔐 Panneau d’administration :
- Authentification sécurisée (connexion/déconnexion) pour les administrateurs.
- Tableau de bord listant tous les projets avec affichage en grille ou liste.
- Recherche et filtrage par catégorie, titre ou client.
- Opérations CRUD (Créer, Lire, Mettre à jour, Supprimer) :
  - Créer un nouveau projet : titre, catégorie, description, client, année, services, lien externe, image principale, galerie d’images.
  - Lire les détails de tous les projets.
  - Mettre à jour un projet existant, changer l’image principale, modifier la galerie.
    - Les nouvelles images sont ajoutées à la galerie existante.
    - Possibilité de supprimer des images individuellement.
  - Supprimer un projet.
- Les images sont téléversées dans le dossier `public/uploads/portfolio_images/`.

## 🛠️ Stack Technique

- Framework : Next.js (^14.2.30)
- Langage : TypeScript
- Base de données : MySQL via le driver `mysql2` (^3.14.1)
- Style :
  - Tailwind CSS (^3.3.0)
  - shadcn/ui (UI basée sur Radix : Dialog, Tabs, Slot)
- Animations : Framer Motion (^10.16.4)
- Icônes : Lucide React (^0.292.0)
- API : Route Handlers de Next.js App Router
- Gestion d’état : Hooks React (`useState`, `useEffect`)
- Autres Librairies :
  - next-themes (gestion des thèmes)
  - clsx, tailwind-merge, class-variance-authority (utilitaires CSS)
  - @lottiefiles/react-lottie-player (animations Lottie)

## ⚙️ Pré-requis

Avant de commencer, assure-toi d’avoir installé :
- Node.js (version 18.x ou 20.x recommandée)
- npm (inclus avec Node.js) ou yarn
- Un serveur MySQL fonctionnel.

## 🚀 Démarrage

### 1. Cloner le dépôt
```bash
git clone <url-du-depot>
cd ikhodi
```

### 2. Installer les dépendances
```bash
npm install
# ou
yarn install
```

### 3. Configurer les variables d’environnement
Créer un fichier `.env` à la racine du projet :

```env
DB_HOST=localhost
DB_USER=ton_utilisateur_mysql
DB_PASSWORD=ton_mot_de_passe
DB_DATABASE=Entrez_le_nom_de_la_bd
```

### 4. Créer la base de données MySQL
```sql
CREATE DATABASE Entrez_le_nom_de_la_bd;

CREATE TABLE portfolio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  image VARCHAR(255),
  images JSON,
  description TEXT,
  client VARCHAR(255),
  year VARCHAR(4),
  services JSON,
  externalLink VARCHAR(255)
);
```

### 5. (Optionnel) Migration de données
```bash
node scripts/migrate-data.mjs
```

### 6. Lancer le serveur de développement
```bash
npm run dev
# ou
yarn dev
```

Accéder à : http://localhost:3000  
Interface admin : `/admin/login` (par défaut : admin / password)

## 📜 Scripts disponibles

- `npm run dev` : Lance le serveur de dev Next.js
- `npm run build` : Build l’app pour la production
- `npm run start` : Lance l’app Next.js en mode prod
- `npm run lint` : Vérifie le code avec ESLint

## 🌐 Variables d’environnement

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=motdepasse
DB_DATABASE=Entrez_le_nom_de_la_bd
```

## 📡 API

- `/api/portfolio`
  - GET : récupérer tous les projets
  - POST : créer un projet
- `/api/portfolio/[id]`
  - GET : voir un projet
  - PUT : modifier un projet
  - DELETE : supprimer un projet
- `/api/portfolio/[id]/images/[imageFilename]`
  - DELETE : supprimer une image
- `/api/auth/login` : connexion
- `/api/auth/logout` : déconnexion

## 🧹 Linting

```bash
npm run lint
```

## 🚀 Déploiement

Le fichier `next.config.mjs` est configuré pour le mode standalone (Vercel, Docker...).