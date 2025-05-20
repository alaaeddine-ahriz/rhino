# API Le Rhino

Ce projet expose les fonctionnalités du système RAG de gestion de cours via une API REST, permettant d'interagir avec le système via des requêtes HTTP plutôt que via une interface en ligne de commande.

## Installation

1. Assurez-vous d'avoir toutes les dépendances installées:

```bash
pip install fastapi uvicorn pydantic langchain langchain-pinecone langchain-openai pinecone-client pdfplumber python-docx python-pptx odfpy PyPDF2==3.0.1 python-dotenv
```

2. Configurez les variables d'environnement dans un fichier `.env`:

```
PINECONE_API_KEY=votre_clé_api_pinecone
OPENAI_API_KEY=votre_clé_api_openai
PINECONE_CLOUD=aws
PINECONE_REGION=us-east-1
```

## Lancement du serveur

Pour lancer le serveur API:

```bash
python app.py
```

Le serveur démarre sur http://localhost:8000 par défaut.

## Documentation de l'API

Une documentation interactive est disponible à l'adresse http://localhost:8000/docs une fois le serveur lancé.

## Points d'accès (Endpoints)

### GET /

Vérifie que l'API est opérationnelle.

**Réponse:**
```json
{
  "success": true,
  "message": "Le Rhino API",
  "data": {
    "status": "online"
  },
  "timestamp": "2023-06-01T12:00:00.000000"
}
```

### GET /matieres

Liste toutes les matières disponibles.

**Réponse:**
```json
{
  "success": true,
  "message": "2 matières trouvées",
  "data": {
    "matieres": ["SYD", "TCP"]
  },
  "timestamp": "2023-06-01T12:00:00.000000"
}
```

### POST /matieres/update

Met à jour l'index pour une matière spécifique.

**Corps de la requête:**
```json
{
  "matiere": "SYD"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Matière SYD mise à jour avec succès",
  "data": {
    "matiere": "SYD",
    "updated": true,
    "documents_processed": 5,
    "index_size": 1000
  },
  "timestamp": "2023-06-01T12:00:00.000000"
}
```

### POST /question

Pose une question sur une matière spécifique.

**Corps de la requête:**
```json
{
  "matiere": "SYD",
  "query": "Expliquez le concept de la virtualisation",
  "output_format": "text",
  "save_output": true
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Réponse générée avec succès",
  "data": {
    "response": "La virtualisation est un concept qui...",
    "sources": [
      {
        "document": 1,
        "source": "SYD/virtualisation.md",
        "section": "Introduction à la virtualisation",
        "contenu": "La virtualisation est une technologie qui...",
        "relevance_score": 0.95
      }
    ],
    "matiere": "SYD",
    "query": "Expliquez le concept de la virtualisation",
    "processing_time": 2.5,
    "tokens_used": 150
  },
  "timestamp": "2023-06-01T12:00:00.000000"
}
```

### POST /question/reflection

Génère une question de réflexion sur un concept clé.

**Corps de la requête:**
```json
{
  "matiere": "SYD",
  "concept_cle": "virtualisation",
  "output_format": "json",
  "save_output": true
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Question de réflexion générée avec succès",
  "data": {
    "question": {
      "question": "Quelles sont les implications de la virtualisation sur la sécurité des systèmes d'information?",
      "concepts_abordés": [
        "virtualisation",
        "sécurité",
        "isolation",
        "hyperviseur"
      ],
      "niveau_difficulté": "avancé",
      "compétences_visées": [
        "analyse critique",
        "évaluation des risques",
        "conception sécurisée"
      ],
      "éléments_réponse": [
        "Protection par isolation",
        "Vulnérabilités des hyperviseurs",
        "Gestion centralisée des politiques de sécurité"
      ]
    },
    "matiere": "SYD",
    "concept": "virtualisation",
    "format": "json",
    "metadata": {
      "difficulty_level": 4,
      "estimated_time": "15 minutes",
      "prerequisites": ["Bases de la virtualisation", "Concepts de sécurité"]
    }
  },
  "timestamp": "2023-06-01T12:00:00.000000"
}
```

## Exemples d'utilisation avec curl

### Lister les matières disponibles
```bash
curl -X GET http://localhost:8000/matieres
```

### Mettre à jour une matière
```bash
curl -X POST http://localhost:8000/matieres/update \
  -H "Content-Type: application/json" \
  -d '{"matiere": "SYD"}'
```

### Poser une question
```bash
curl -X POST http://localhost:8000/question \
  -H "Content-Type: application/json" \
  -d '{"matiere": "SYD", "query": "Expliquez le concept de la virtualisation", "output_format": "text"}'
```

### Générer une question de réflexion
```bash
curl -X POST http://localhost:8000/question/reflection \
  -H "Content-Type: application/json" \
  -d '{"matiere": "SYD", "concept_cle": "virtualisation", "output_format": "json"}'
```

## Types TypeScript

Pour faciliter l'intégration avec Next.js, voici les types TypeScript pour les réponses API :

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

interface MatieresResponse {
  matieres: string[];
}

interface UpdateResponse {
  matiere: string;
  updated: boolean;
  documents_processed: number;
  index_size: number;
}

interface Source {
  document: number;
  source: string;
  section: string;
  contenu: string;
  relevance_score: number;
}

interface QuestionResponse {
  response: string;
  sources: Source[];
  matiere: string;
  query: string;
  processing_time: number;
  tokens_used: number;
}

interface ReflectionQuestion {
  question: string;
  concepts_abordés: string[];
  niveau_difficulté: string;
  compétences_visées: string[];
  éléments_réponse: string[];
}

interface ReflectionMetadata {
  difficulty_level: number;
  estimated_time: string;
  prerequisites: string[];
}

interface ReflectionResponse {
  question: ReflectionQuestion;
  matiere: string;
  concept: string;
  format: string;
  metadata: ReflectionMetadata;
}

interface ApiError {
  code: string;
  details: string;
  field?: string;
  type: string;
}

interface ErrorResponse {
  success: false;
  message: string;
  error: ApiError;
  timestamp: string;
}
```

## Gestion des erreurs

L'API utilise des codes HTTP standard pour indiquer le statut des requêtes :

- 200: Succès
- 400: Requête invalide (paramètres manquants ou incorrects)
- 404: Ressource non trouvée
- 500: Erreur serveur

Format de réponse d'erreur :
```json
{
  "success": false,
  "message": "Erreur lors du traitement de la requête",
  "error": {
    "code": "INVALID_INPUT",
    "details": "Le paramètre 'matiere' est requis",
    "field": "matiere",
    "type": "validation_error"
  },
  "timestamp": "2023-06-01T12:00:00.000000"
}
```

## CORS

L'API est configurée pour accepter les requêtes cross-origin. Les en-têtes CORS suivants sont inclus dans toutes les réponses :

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Limites de taux

Pour éviter la surcharge du serveur, les limites suivantes sont appliquées :

- 100 requêtes par minute par adresse IP
- 1000 requêtes par heure par adresse IP

En cas de dépassement, l'API renvoie un code 429 (Too Many Requests).

## Authentification

L'API ne nécessite pas d'authentification pour les endpoints publics. Cependant, il est recommandé d'utiliser les clés API suivantes dans les en-têtes de requête pour un meilleur suivi :

```
X-API-Key: votre_clé_api
```

## Intégration avec Next.js

Pour intégrer cette API dans une application Next.js, vous pouvez utiliser le client API suivant :

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

// Exemple d'utilisation
export async function getMatieres() {
  return fetchApi<MatieresResponse>('/matieres');
}

export async function askQuestion(matieres: string, query: string) {
  return fetchApi<QuestionResponse>('/question', {
    method: 'POST',
    body: JSON.stringify({ matieres, query }),
  });
}
```

## Variables d'environnement Next.js

Créez un fichier `.env.local` dans votre projet Next.js :

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_KEY=votre_clé_api
```

## Formats de réponse JSON

### GET /

```json
{
  "success": true,
  "message": "Le Rhino API",
  "data": {
    "status": "online"
  },
  "timestamp": "2023-06-01T12:00:00.000000"
}
```

### GET /matieres

```json
{
  "success": true,
  "message": "2 matières trouvées",
  "data": {
    "matieres": ["SYD", "TCP"]
  },
  "timestamp": "2023-06-01T12:00:00.000000"
}
```

### POST /matieres/update

```json
{
  "success": true,
  "message": "Matière SYD mise à jour avec succès",
  "data": {
    "matiere": "SYD",
    "updated": true,
    "documents_processed": 5,
    "index_size": 1000
  },
  "timestamp": "2023-06-01T12:00:00.000000"
}
```

### POST /question

```json
{
  "success": true,
  "message": "Réponse générée avec succès",
  "data": {
    "response": "La virtualisation est un concept qui...",
    "sources": [
      {
        "document": 1,
        "source": "SYD/virtualisation.md",
        "section": "Introduction à la virtualisation",
        "contenu": "La virtualisation est une technologie qui...",
        "relevance_score": 0.95
      }
    ],
    "matiere": "SYD",
    "query": "Expliquez le concept de la virtualisation",
    "processing_time": 2.5,
    "tokens_used": 150
  },
  "timestamp": "2023-06-01T12:00:00.000000"
}
```

### POST /question/reflection

```json
{
  "success": true,
  "message": "Question de réflexion générée avec succès",
  "data": {
    "question": {
      "question": "Quelles sont les implications de la virtualisation sur la sécurité des systèmes d'information?",
      "concepts_abordés": [
        "virtualisation",
        "sécurité",
        "isolation",
        "hyperviseur"
      ],
      "niveau_difficulté": "avancé",
      "compétences_visées": [
        "analyse critique",
        "évaluation des risques",
        "conception sécurisée"
      ],
      "éléments_réponse": [
        "Protection par isolation",
        "Vulnérabilités des hyperviseurs",
        "Gestion centralisée des politiques de sécurité"
      ]
    },
    "matiere": "SYD",
    "concept": "virtualisation",
    "format": "json",
    "metadata": {
      "difficulty_level": 4,
      "estimated_time": "15 minutes",
      "prerequisites": ["Bases de la virtualisation", "Concepts de sécurité"]
    }
  },
  "timestamp": "2023-06-01T12:00:00.000000"
}
```

### Format d'erreur

```json
{
  "success": false,
  "message": "Erreur lors du traitement de la requête",
  "error": {
    "code": "INVALID_INPUT",
    "details": "Le paramètre 'matiere' est requis",
    "field": "matiere",
    "type": "validation_error"
  },
  "timestamp": "2023-06-01T12:00:00.000000"
}
```

## Codes d'erreur courants

| Code | Description | Exemple |
|------|-------------|---------|
| INVALID_INPUT | Paramètres de requête invalides | Paramètres manquants ou mal formatés |
| MATIERE_NOT_FOUND | La matière demandée n'existe pas | Matière non trouvée dans l'index |
| PROCESSING_ERROR | Erreur lors du traitement de la requête | Échec de l'indexation |
| RATE_LIMIT_EXCEEDED | Limite de requêtes dépassée | Trop de requêtes dans un court laps de temps |
| INDEX_UPDATE_FAILED | Échec de la mise à jour de l'index | Problème lors de l'indexation des documents |

## Mise à jour des types TypeScript

Pour refléter les formats JSON complets, voici les types TypeScript mis à jour :

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

interface MatieresResponse {
  matieres: string[];
}

interface UpdateResponse {
  matiere: string;
  updated: boolean;
  documents_processed: number;
  index_size: number;
}

interface Source {
  document: number;
  source: string;
  section: string;
  contenu: string;
  relevance_score: number;
}

interface QuestionResponse {
  response: string;
  sources: Source[];
  matiere: string;
  query: string;
  processing_time: number;
  tokens_used: number;
}

interface ReflectionQuestion {
  question: string;
  concepts_abordés: string[];
  niveau_difficulté: string;
  compétences_visées: string[];
  éléments_réponse: string[];
}

interface ReflectionMetadata {
  difficulty_level: number;
  estimated_time: string;
  prerequisites: string[];
}

interface ReflectionResponse {
  question: ReflectionQuestion;
  matiere: string;
  concept: string;
  format: string;
  metadata: ReflectionMetadata;
}

interface ApiError {
  code: string;
  details: string;
  field?: string;
  type: string;
}

interface ErrorResponse {
  success: false;
  message: string;
  error: ApiError;
  timestamp: string;
}
``` 