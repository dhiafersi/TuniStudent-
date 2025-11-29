# Fonctions par Rôle - TuniStudent

## 📋 Table des matières
1. [Fonctions Publiques (Non connecté)](#fonctions-publiques-non-connecté)
2. [Fonctions Client Connecté](#fonctions-client-connecté)
3. [Fonctions Administrateur](#fonctions-administrateur)

---

## 🌐 Fonctions Publiques (Non connecté)

Ces endpoints sont accessibles sans authentification.

### Authentification
- **POST** `/api/auth/login` - Se connecter
- **POST** `/api/auth/register` - S'inscrire (création d'un compte étudiant)
- **GET** `/api/auth/ping` - Vérifier que l'API d'authentification est accessible

### Deals (Offres)
- **GET** `/api/deals` - Lister toutes les offres approuvées
  - Paramètres de requête:
    - `page` (optionnel) - Numéro de page
    - `size` (optionnel) - Taille de la page (défaut: 12)
    - `city` (optionnel) - Filtrer par ville
    - `category` (optionnel) - Filtrer par catégorie
    - `q` (optionnel) - Recherche par texte (titre, description, catégorie)
    - `featured` (optionnel) - Filtrer les offres en vedette
  - **Note**: Seules les offres avec le statut `APPROVED` sont visibles

- **GET** `/api/deals/{id}` - Obtenir les détails d'une offres spécifique
  - **Note**: Seules les offres approuvées sont visibles

### Villes
- **GET** `/api/cities` - Lister toutes les villes

### Catégories
- **GET** `/api/categories` - Lister toutes les catégories

### Notes (Ratings)
- **GET** `/api/ratings/summary/{dealId}` - Obtenir le résumé des notes d'une offres
  - Retourne: moyenne, nombre de notes, et note de l'utilisateur (si connecté)
  - **Note**: Fonctionne sans authentification, mais ne retourne `userStars` que si l'utilisateur est connecté

---

## 🔐 Fonctions Client Connecté

Ces endpoints nécessitent une authentification (token JWT). L'utilisateur doit être connecté.

### Deals (Offres)
- **POST** `/api/deals/submit` - Soumettre une nouvelle offres
  - Le statut est automatiquement défini à `PENDING`
  - Nécessite: titre, description, imageUrl, cityId, categoryId, price, discount, location, expirationDate
  - L'offres doit être approuvée par un admin avant d'être visible publiquement

### Favoris
- **GET** `/api/favorites` - Obtenir la liste de mes favoris
- **POST** `/api/favorites/{dealId}` - Ajouter une offres aux favoris
  - Si le favoris existe déjà, il est retourné sans création de doublon
- **DELETE** `/api/favorites/{dealId}` - Retirer une offres des favoris

### Notes (Ratings)
- **POST** `/api/ratings/{dealId}` - Noter une offres (1-5 étoiles)
  - Corps de la requête: `{ "stars": 1-5 }`
  - Si l'utilisateur a déjà noté cette offres, la note est mise à jour

---

## 👑 Fonctions Administrateur

Ces endpoints nécessitent le rôle `ADMIN`. Seuls les administrateurs peuvent y accéder.

### Deals (Offres) - Gestion complète
- **POST** `/api/deals` - Créer une offres directement (auto-approuvée)
  - Les offres créées par un admin sont automatiquement approuvées
  - Nécessite un objet `Deal` complet dans le corps de la requête

- **PUT** `/api/deals/{id}` - Modifier une offres existante
  - Peut modifier tous les champs d'une offres
  - Préserve le champ `submittedBy` si non modifié

- **DELETE** `/api/deals/{id}` - Supprimer une offres

- **GET** `/api/deals/pending` - Obtenir toutes les offres en attente d'approbation
  - Paramètres de requête:
    - `page` (optionnel) - Numéro de page
    - `size` (optionnel) - Taille de la page (défaut: 20)
  - Retourne uniquement les offres avec le statut `PENDING`

- **POST** `/api/deals/{id}/approve` - Approuver une offres
  - Change le statut de `PENDING` à `APPROVED`
  - Retourne les détails de l'offres mise à jour

- **POST** `/api/deals/{id}/reject` - Rejeter une offres
  - Change le statut de `PENDING` à `REJECTED`
  - Retourne les détails de l'offres mise à jour

- **GET** `/api/deals` - Lister toutes les offres (y compris celles non approuvées)
  - Les admins voient toutes les offres, peu importe leur statut
  - Mêmes paramètres de requête que la version publique

- **GET** `/api/deals/{id}` - Obtenir les détails d'une offres (y compris non approuvée)
  - Les admins peuvent voir toutes les offres, même celles non approuvées

### Catégories - Gestion
- **POST** `/api/categories` - Créer une nouvelle catégorie
  - **Note**: Les endpoints PUT et DELETE pour les catégories sont configurés dans la sécurité mais ne sont pas encore implémentés dans le contrôleur

---

## 📝 Notes importantes

### Statuts des offres (DealStatus)
- **PENDING** - En attente d'approbation (non visible publiquement)
- **APPROVED** - Approuvée (visible publiquement)
- **REJECTED** - Rejetée (non visible publiquement)

### Rôles utilisateurs
- **ROLE_STUDENT** - Rôle par défaut lors de l'inscription
- **ROLE_ADMIN** - Rôle administrateur (accès complet)

### Sécurité
- Toutes les requêtes authentifiées nécessitent un token JWT dans l'en-tête `Authorization: Bearer <token>`
- Les endpoints admin vérifient le rôle `ADMIN` via `@PreAuthorize("hasRole('ADMIN')")`
- Les endpoints authentifiés vérifient la présence d'un utilisateur connecté via `@PreAuthorize("isAuthenticated()")`

### CORS
- La configuration CORS permet toutes les origines (`*`)
- Les méthodes HTTP autorisées: GET, POST, PUT, DELETE, PATCH, OPTIONS
- Les requêtes OPTIONS (preflight) sont automatiquement autorisées

---

## 🔄 Résumé par type d'accès

| Fonctionnalité | Public | Connecté | Admin |
|---------------|--------|----------|-------|
| S'inscrire / Se connecter | ✅ | ✅ | ✅ |
| Voir les offres approuvées | ✅ | ✅ | ✅ |
| Voir toutes les offres | ❌ | ❌ | ✅ |
| Voir les offres en attente | ❌ | ❌ | ✅ |
| Soumettre une offres | ❌ | ✅ | ✅ |
| Approuver/Rejeter une offres | ❌ | ❌ | ✅ |
| Modifier/Supprimer une offres | ❌ | ❌ | ✅ |
| Ajouter aux favoris | ❌ | ✅ | ✅ |
| Noter une offres | ❌ | ✅ | ✅ |
| Voir les villes/catégories | ✅ | ✅ | ✅ |
| Créer une catégorie | ❌ | ❌ | ✅ |
| Modifier/Supprimer une catégorie | ❌ | ❌ | ⚠️ (Configuré mais non implémenté) |

