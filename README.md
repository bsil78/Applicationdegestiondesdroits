# Compliance Hub - Application de Gestion des Droits Utilisateurs

## Vue d'ensemble

Compliance Hub est une application web complète de gestion des droits utilisateurs pour les applications métier de conformité. Elle permet de gérer les permissions en tenant compte de la localisation géographique (pays) et de la position dans la hiérarchie organisationnelle.

## Fonctionnalités principales

### 🔐 Authentification
- Système de connexion sécurisé avec email et mot de passe
- Gestion des sessions utilisateur
- Protection des routes

### 👥 Gestion des utilisateurs
- Création, modification et désactivation d'utilisateurs
- Filtrage par rôle, statut, pays et unité organisationnelle
- Recherche en temps réel
- 4 rôles disponibles : Administrateur, Manager, Utilisateur, Observateur

### 🛡️ Gestion des permissions
- Attribution de droits granulaires par application
- 4 types d'actions : Créer, Consulter, Modifier, Archiver
- Permissions basées sur la localisation (pays)
- Permissions basées sur l'unité organisationnelle
- Dates d'expiration optionnelles

### 🌍 Contexte géographique et organisationnel
- Support de 10 pays répartis sur 4 régions
- Hiérarchie d'unités organisationnelles multi-niveaux
- Attribution de permissions par zone géographique

### 📊 Tableau de bord
- Vue d'ensemble des statistiques
- Utilisateurs actifs
- Permissions attribuées
- Actions rapides

### 📝 Audit Trail
- Traçabilité complète de toutes les actions
- Logs horodatés avec adresse IP
- Historique des modifications
- Pagination des résultats

### 👤 Profil utilisateur
- Consultation des informations personnelles
- Visualisation de toutes les permissions attribuées
- Détails par application

## Architecture technique

### Frontend
- **React 18** avec TypeScript
- **React Router** (Data Mode) pour la navigation
- **Tailwind CSS v4** pour le styling
- **Lucide React** pour les icônes
- **Shadcn/ui** pour les composants de base

### Design System
Système de tokens CSS à 3 niveaux (voir [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)) :
- **Niveau 1 : Primitives** - Valeurs concrètes uniquement
- **Niveau 2 : Sémantique** - Intentions (success, warning, danger, etc.)
- **Niveau 3 : Composants** - Tokens liés aux composants stylisés

### Accessibilité
- Conforme WCAG 2.1 niveau AA
- Navigation complète au clavier
- Labels ARIA appropriés
- Contraste de couleurs respecté
- Messages d'état dynamiques
- Structure HTML sémantique

### Architecture de données
- **Interface API** : Contrat typé pour l'accès aux données
- **Implémentation mockée** : Simulation d'une vraie API avec délais réseau
- **Données fictives** : Jeu de données complet pour la démonstration
- **Gestion d'état** : Context API React pour l'authentification

## Données de démonstration

### Connexion
- **Email** : `admin@compliance.com`
- **Mot de passe** : `Password123!`

Tous les utilisateurs peuvent se connecter avec le mot de passe : `Password123!`

### Applications disponibles
1. **KYC Manager** - Gestion Know Your Customer
2. **AML Tracker** - Anti-Money Laundering
3. **Sanctions Screening** - Vérification des sanctions
4. **Regulatory Reporting** - Rapports réglementaires
5. **Risk Assessment** - Évaluation des risques
6. **Audit Trail** - Historique d'audit

### Pays supportés
- 🇫🇷 France
- 🇩🇪 Allemagne
- 🇬🇧 Royaume-Uni
- 🇪🇸 Espagne
- 🇮🇹 Italie
- 🇺🇸 États-Unis
- 🇨🇦 Canada
- 🇧🇷 Brésil
- 🇯🇵 Japon
- 🇸🇬 Singapour

### Utilisateurs de test
- **Sophie Martin** (admin@compliance.com) - Administrateur global
- **Marie Dupont** (marie.dupont@compliance.com) - Manager France
- **Anna Schmidt** (anna.schmidt@compliance.com) - Manager Allemagne
- **Emily Johnson** (emily.johnson@compliance.com) - Manager US
- **Pierre Bernard** (pierre.bernard@compliance.com) - Utilisateur France
- Et 5 autres utilisateurs...

## Structure du projet

```
/src/
  /app/
    /components/         # Composants réutilisables
      permission-badge.tsx
      status-badge.tsx
      page-header.tsx
      data-table.tsx
      app-layout.tsx
      /ui/              # Composants UI de base
    /contexts/          # Contextes React
      auth-context.tsx
    /data/              # Données fictives
      mock-data.ts
    /pages/             # Pages de l'application
      login.tsx
      dashboard.tsx
      users.tsx
      permissions.tsx
      audit.tsx
      profile.tsx
    /services/          # Couche de services
      api-interface.ts  # Interface API
      mock-api.ts       # Implémentation mockée
    /types/             # Types TypeScript
      index.ts
    routes.tsx          # Configuration du routing
    App.tsx             # Point d'entrée
  /styles/
    theme.css           # Système de tokens CSS
```

## API Mockée

L'application utilise une API mockée qui simule une vraie API backend :

### Fonctionnalités de l'API
- ✅ Délais réseau simulés (300ms)
- ✅ Gestion d'erreurs
- ✅ Validation des données
- ✅ Génération d'IDs uniques
- ✅ Timestamps automatiques
- ✅ Logs d'audit automatiques
- ✅ Pagination
- ✅ Filtrage et recherche

### Méthodes disponibles

#### Authentification
- `login(credentials)` - Connexion
- `logout()` - Déconnexion
- `verifyToken(token)` - Vérification du token

#### Utilisateurs
- `getUsers(filters?)` - Liste des utilisateurs
- `getUserById(id)` - Détails d'un utilisateur
- `createUser(input)` - Créer un utilisateur
- `updateUser(id, input)` - Modifier un utilisateur
- `deleteUser(id)` - Désactiver un utilisateur
- `getUserPermissionStats(userId)` - Statistiques de permissions

#### Permissions
- `getPermissions(filters?)` - Liste des permissions
- `getPermissionById(id)` - Détails d'une permission
- `createPermission(input)` - Créer une permission
- `updatePermission(id, input)` - Modifier une permission
- `deletePermission(id)` - Supprimer une permission
- `getUserPermissions(userId)` - Permissions d'un utilisateur

#### Référentiels
- `getCountries()` - Liste des pays
- `getOrganizationalUnits()` - Liste des unités organisationnelles
- `getApplications()` - Liste des applications
- `getActiveApplications()` - Applications actives

#### Audit
- `getAuditLogs(page?, pageSize?)` - Logs d'audit paginés
- `getAuditLogsByUser(userId)` - Logs d'un utilisateur
- `getAuditLogsByEntity(type, id)` - Logs d'une entité

## Composants réutilisables

### PermissionBadge
```tsx
<PermissionBadge action="create" />
<PermissionBadge action="read" />
<PermissionBadge action="update" />
<PermissionBadge action="archive" />
```

### StatusBadge
```tsx
<StatusBadge status="active" />
<StatusBadge status="inactive" />
<StatusBadge status="suspended" />
```

### PageHeader
```tsx
<PageHeader
  title="Titre"
  description="Description"
  breadcrumbs={[{ label: 'Accueil', href: '/' }]}
  action={<Button>Action</Button>}
/>
```

### DataTable
```tsx
<DataTable
  data={items}
  columns={columns}
  keyExtractor={(item) => item.id}
  onRowClick={(item) => handleClick(item)}
  loading={loading}
/>
```

## Navigation

- `/` - Redirection vers le dashboard
- `/login` - Page de connexion
- `/dashboard` - Tableau de bord principal
- `/users` - Liste des utilisateurs
- `/users/:id` - Détails d'un utilisateur
- `/users/new` - Création d'utilisateur
- `/permissions` - Liste des permissions
- `/permissions/:id` - Détails d'une permission
- `/permissions/new` - Création de permission
- `/audit` - Historique d'audit
- `/profile` - Profil de l'utilisateur connecté

## Bonnes pratiques implémentées

### Code
- ✅ Séparation des responsabilités (composants, services, types)
- ✅ Pas de duplication de code
- ✅ Composants réutilisables
- ✅ Types TypeScript stricts
- ✅ Interface pour l'abstraction de l'API

### Design
- ✅ Système de tokens à 3 niveaux
- ✅ Mode sombre supporté
- ✅ Design responsive
- ✅ Cohérence visuelle

### Accessibilité
- ✅ Navigation au clavier
- ✅ ARIA labels
- ✅ Contraste de couleurs
- ✅ HTML sémantique
- ✅ Messages d'état

### UX
- ✅ Feedback visuel immédiat
- ✅ Messages d'erreur clairs
- ✅ États de chargement
- ✅ Confirmation des actions sensibles
- ✅ Fil d'Ariane pour la navigation

## Évolutions possibles

- [ ] Formulaires de création/modification d'utilisateurs
- [ ] Formulaires de création/modification de permissions
- [ ] Export CSV/Excel des données
- [ ] Graphiques et visualisations avancées
- [ ] Notifications en temps réel
- [ ] Gestion des rôles personnalisés
- [ ] Workflows d'approbation
- [ ] Intégration SSO (SAML, OAuth)
- [ ] API REST réelle avec backend
- [ ] Tests unitaires et E2E
- [ ] i18n (internationalisation)

## Notes importantes

⚠️ **Cette application est un environnement de démonstration** utilisant des données fictives et une API mockée. Elle n'est pas conçue pour :
- Collecter des données personnelles identifiables (PII) en production
- Sécuriser des données sensibles
- Un usage en production sans migration vers une infrastructure dédiée

Pour un environnement de production, il faudrait :
1. Implémenter une vraie API backend avec authentification sécurisée
2. Utiliser une base de données avec chiffrement
3. Mettre en place la sécurité au niveau des lignes (RLS)
4. Implémenter l'audit logging côté serveur
5. Ajouter la validation côté serveur
6. Mettre en place HTTPS/TLS
7. Implémenter une gestion des secrets sécurisée
8. Ajouter des tests de sécurité (OWASP)

## Support

Pour toute question ou suggestion, consultez la documentation du design system dans [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).
