# Le Rhino - Système RAG pour la gestion de cours

Le Rhino est une application web basée sur un système RAG (Retrieval-Augmented Generation) permettant de gérer des documents de cours par matière et de générer des questions de réflexion intelligentes.

## Fonctionnalités

- **Interface web** pour une utilisation intuitive
- **Gestion des matières** avec affichage des logs de mise à jour
- **Génération de questions** sur les concepts des cours
- **Interrogation contextuelle** basée sur le contenu des cours
- **Évaluation automatique** des réponses d'étudiants avec notation et feedback
- **Réponses en format texte ou JSON** avec attribution des sources

## Installation

### Prérequis

- Python 3.8+
- Compte Pinecone pour la base de données vectorielle
- Clé API OpenAI

### Configuration

1. Clonez ce dépôt :
```bash
git clone https://github.com/alaaeddine-ahriz/sir-ia.git
cd rag-chatbot
```

2. Créez un fichier `.env` à la racine du projet avec les informations suivantes :
```
PINECONE_API_KEY=votre_clé_api_pinecone
OPENAI_API_KEY=votre_clé_api_openai
PINECONE_CLOUD=aws
PINECONE_REGION=us-east-1
```

3. Exécutez le script d'installation :
```bash
chmod +x run.sh
./run.sh
```

## Utilisation

Après avoir lancé l'application, accédez à l'interface web à l'adresse http://localhost:8000.

### Organisation des fichiers de cours

Les documents de cours doivent être placés dans le dossier `cours/` organisé par matières :
```
cours/
  ├── SYD/
  │    ├── document1.md
  │    ├── document2.pdf
  │    └── ...
  ├── TCP/
  │    ├── document1.md
  │    └── ...
  └── ...
```

Formats supportés : `.md`, `.txt`, `.pdf`, `.docx`, `.pptx`, `.odt`, `.odp`

### Interface web

L'interface web propose quatre onglets principaux :

1. **Matières** :
   - Affichage de la liste des matières disponibles
   - Mise à jour de l'index vectoriel avec affichage des logs détaillés
   
2. **Poser une question** :
   - Interrogation contextuelle sur une matière
   - Affichage des sources utilisées pour la réponse
   
3. **Générer une question** :
   - Création de questions de réflexion sur un concept spécifique
   - Options pour générer des questions en format texte ou JSON
   
4. **Évaluer une réponse** :
   - Évaluation automatique des réponses d'étudiants
   - Notation sur 100 points avec justification détaillée
   - Identification des points forts et des axes d'amélioration
   - Génération d'une réponse modèle et de conseils personnalisés

## API REST

Le système expose une API REST pour une intégration programmatique :

### Points d'accès principaux

- `GET /matieres` : Liste des matières disponibles
- `POST /matieres/update` : Mise à jour de l'index d'une matière (avec logs)
- `POST /question` : Interrogation d'une matière
- `POST /question/reflection` : Génération d'une question de réflexion
- `POST /evaluation/response` : Évaluation de la réponse d'un étudiant

### Exemple d'utilisation avec curl

```bash
# Lister les matières
curl -X GET http://localhost:8000/matieres

# Mettre à jour une matière
curl -X POST http://localhost:8000/matieres/update \
  -H "Content-Type: application/json" \
  -d '{"matiere": "SYD"}'

# Poser une question
curl -X POST http://localhost:8000/question \
  -H "Content-Type: application/json" \
  -d '{"matiere": "SYD", "query": "Expliquez le concept de la virtualisation", "output_format": "text"}'

# Évaluer la réponse d'un étudiant
curl -X POST http://localhost:8000/evaluation/response \
  -H "Content-Type: application/json" \
  -d '{
    "matiere": "SYD",
    "question": "Expliquez le concept de la virtualisation",
    "student_response": "La virtualisation est une technologie...",
    "save_output": true
  }'
```

Pour plus de détails sur l'API, consultez la documentation interactive à l'adresse http://localhost:8000/docs.

## Fonctionnement technique

1. **Importation des documents** : Lors de la mise à jour d'une matière, les documents sont lus et transformés en chunks.
2. **Vectorisation** : Chaque chunk est converti en vecteur et stocké dans Pinecone.
3. **Requête** : Lorsqu'une question est posée, le système recherche les documents les plus pertinents.
4. **Génération** : Un LLM (via OpenAI) génère une réponse à partir des documents retrouvés.
5. **Évaluation** : Pour les réponses d'étudiants, le système:
   - Retrouve les documents pertinents liés à la question
   - Utilise un prompt spécialisé d'évaluateur académique
   - Évalue la réponse selon plusieurs critères (pertinence, exactitude, structure)
   - Génère un feedback complet avec notation

## License

Ce projet est distribué sous licence MIT.