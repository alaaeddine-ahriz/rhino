# Le Rhino - Assistant de Révision

Une application web moderne pour accompagner les étudiants dans leurs révisions, basée sur un système RAG (Retrieval-Augmented Generation).

## Fonctionnalités

- Mise à jour des documents du RAG
- Réponses aux questions des étudiants
- Génération de questions de réflexion
- Évaluation des réponses

## Technologies utilisées

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- Firebase (Authentication & Firestore)

## Installation

1. Clonez le dépôt :
```bash
git clone <repository-url>
cd ui-rag-chatbot
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement :
Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Lancez le serveur de développement :
```bash
npm run dev
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Structure du projet

```
src/
  ├── app/                    # Pages de l'application
  │   ├── page.tsx           # Page d'accueil
  │   ├── update/            # Mise à jour des documents
  │   ├── question/          # Questions et réponses
  │   └── reflection/        # Questions de réflexion
  ├── components/            # Composants réutilisables
  │   └── ui/               # Composants UI de base
  ├── lib/                   # Utilitaires et services
  │   ├── api.ts            # Service API
  │   └── firebase.ts       # Configuration Firebase
  └── types/                # Types TypeScript
      └── api.ts            # Types pour l'API
```

## Configuration Firebase

1. Créez un projet Firebase sur [console.firebase.google.com](https://console.firebase.google.com)
2. Activez l'authentification et Firestore
3. Récupérez les informations de configuration dans les paramètres du projet
4. Ajoutez-les dans votre fichier `.env.local`

## Déploiement

L'application peut être déployée sur Vercel :

```bash
npm run build
vercel
```

## Licence

MIT
