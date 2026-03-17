# Documentation du Design System - Compliance Hub

## Vue d'ensemble

Cette application utilise un système de design basé sur une architecture à **trois niveaux de tokens CSS** pour garantir la cohérence, la maintenabilité et la flexibilité.

## Architecture des Tokens CSS

### Niveau 1 : Primitives (Valeurs concrètes)

Les primitives constituent la base du système. **C'est le seul niveau qui contient des valeurs concrètes** (hexadécimales, pixels, etc.) ou des valeurs Tailwind.

#### Couleurs Primitives
```css
--primitive-white: #ffffff;
--primitive-black: #000000;
--primitive-gray-50 à --primitive-gray-900
--primitive-blue-50 à --primitive-blue-700
--primitive-green-50 à --primitive-green-700
--primitive-yellow-50 à --primitive-yellow-600
--primitive-red-50 à --primitive-red-700
--primitive-purple-50 à --primitive-purple-600
```

#### Espacements Primitifs
```css
--primitive-space-xs: 0.25rem;    /* 4px */
--primitive-space-sm: 0.5rem;     /* 8px */
--primitive-space-md: 1rem;       /* 16px */
--primitive-space-lg: 1.5rem;     /* 24px */
--primitive-space-xl: 2rem;       /* 32px */
--primitive-space-2xl: 3rem;      /* 48px */
```

#### Typographie Primitive
```css
--primitive-font-size-xs: 0.75rem;    /* 12px */
--primitive-font-size-sm: 0.875rem;   /* 14px */
--primitive-font-size-base: 1rem;     /* 16px */
--primitive-font-size-lg: 1.125rem;   /* 18px */
--primitive-font-size-xl: 1.25rem;    /* 20px */
--primitive-font-size-2xl: 1.5rem;    /* 24px */
--primitive-font-size-3xl: 1.875rem;  /* 30px */

--primitive-font-weight-normal: 400;
--primitive-font-weight-medium: 500;
--primitive-font-weight-semibold: 600;
--primitive-font-weight-bold: 700;
```

#### Autres Primitives
- Rayons de bordure (`--primitive-radius-*`)
- Largeurs de bordure (`--primitive-border-width-*`)
- Ombres (`--primitive-shadow-*`)
- Transitions (`--primitive-transition-*`)
- Z-index (`--primitive-z-*`)

### Niveau 2 : Sémantique (Intentions)

Les tokens sémantiques expriment l'**intention** et sont **indépendants des composants**. Ils référencent uniquement des primitives.

#### États et Intentions
```css
/* Succès */
--semantic-color-success: var(--primitive-green-600);
--semantic-color-success-bg: var(--primitive-green-50);
--semantic-color-success-border: var(--primitive-green-500);

/* Avertissement */
--semantic-color-warning: var(--primitive-yellow-600);
--semantic-color-warning-bg: var(--primitive-yellow-50);
--semantic-color-warning-border: var(--primitive-yellow-500);

/* Danger */
--semantic-color-danger: var(--primitive-red-600);
--semantic-color-danger-bg: var(--primitive-red-50);
--semantic-color-danger-border: var(--primitive-red-500);

/* Information */
--semantic-color-info: var(--primitive-blue-600);
--semantic-color-info-bg: var(--primitive-blue-50);
--semantic-color-info-border: var(--primitive-blue-500);
```

#### Surfaces
```css
--semantic-surface-base: var(--primitive-white);
--semantic-surface-raised: var(--primitive-gray-50);
--semantic-surface-overlay: var(--primitive-white);
```

#### Texte
```css
--semantic-text-primary: var(--primitive-gray-900);
--semantic-text-secondary: var(--primitive-gray-600);
--semantic-text-tertiary: var(--primitive-gray-500);
--semantic-text-disabled: var(--primitive-gray-400);
--semantic-text-inverse: var(--primitive-white);
```

#### Bordures
```css
--semantic-border-default: var(--primitive-gray-200);
--semantic-border-strong: var(--primitive-gray-300);
--semantic-border-subtle: var(--primitive-gray-100);
```

#### Interactions
```css
--semantic-interactive-primary: var(--primitive-blue-600);
--semantic-interactive-primary-hover: var(--primitive-blue-700);
--semantic-interactive-secondary: var(--primitive-gray-200);
--semantic-interactive-secondary-hover: var(--primitive-gray-300);
```

#### Focus
```css
--semantic-focus-ring: var(--primitive-blue-500);
--semantic-focus-ring-width: var(--primitive-border-width-medium);
```

#### Espacements Contextuels
```css
--semantic-spacing-section: var(--primitive-space-2xl);
--semantic-spacing-component: var(--primitive-space-lg);
--semantic-spacing-element: var(--primitive-space-md);
--semantic-spacing-compact: var(--primitive-space-sm);
```

### Niveau 3 : Composants (Contextuels)

Les tokens de composant sont **liés aux composants stylisés** et référencent des tokens sémantiques.

#### Boutons
```css
--component-button-primary-bg: var(--semantic-interactive-primary);
--component-button-primary-bg-hover: var(--semantic-interactive-primary-hover);
--component-button-primary-text: var(--semantic-text-inverse);
--component-button-padding-x: var(--primitive-space-lg);
--component-button-padding-y: var(--primitive-space-sm);
--component-button-radius: var(--primitive-radius-md);
```

#### Inputs
```css
--component-input-bg: var(--semantic-surface-base);
--component-input-border: var(--semantic-border-default);
--component-input-border-focus: var(--semantic-focus-ring);
--component-input-text: var(--semantic-text-primary);
--component-input-padding-x: var(--primitive-space-md);
--component-input-padding-y: var(--primitive-space-sm);
--component-input-radius: var(--primitive-radius-md);
```

#### Cards
```css
--component-card-bg: var(--semantic-surface-base);
--component-card-border: var(--semantic-border-default);
--component-card-shadow: var(--primitive-shadow-sm);
--component-card-padding: var(--primitive-space-lg);
--component-card-radius: var(--primitive-radius-lg);
```

#### Tables
```css
--component-table-header-bg: var(--semantic-surface-raised);
--component-table-header-text: var(--semantic-text-secondary);
--component-table-row-hover-bg: var(--semantic-surface-raised);
--component-table-border: var(--semantic-border-default);
--component-table-cell-padding-x: var(--primitive-space-md);
--component-table-cell-padding-y: var(--primitive-space-sm);
```

#### Badges
```css
--component-badge-radius: var(--primitive-radius-full);
--component-badge-padding-x: var(--primitive-space-sm);
--component-badge-padding-y: var(--primitive-space-xs);
--component-badge-font-size: var(--primitive-font-size-xs);
```

#### Modals
```css
--component-modal-overlay-bg: rgba(0, 0, 0, 0.5);
--component-modal-bg: var(--semantic-surface-overlay);
--component-modal-shadow: var(--primitive-shadow-xl);
--component-modal-radius: var(--primitive-radius-lg);
--component-modal-padding: var(--primitive-space-xl);
```

#### Sidebar
```css
--component-sidebar-bg: var(--semantic-surface-base);
--component-sidebar-border: var(--semantic-border-default);
--component-sidebar-item-hover-bg: var(--semantic-interactive-secondary);
--component-sidebar-item-active-bg: var(--semantic-interactive-primary);
--component-sidebar-item-active-text: var(--semantic-text-inverse);
```

#### Alerts
```css
--component-alert-padding: var(--primitive-space-md);
--component-alert-radius: var(--primitive-radius-md);
--component-alert-border-width: var(--primitive-border-width-thin);
```

## Composants Réutilisables

### PermissionBadge
Affiche un badge pour une action de permission (create, read, update, archive).
Utilise les tokens sémantiques pour les couleurs selon l'intention.

```tsx
<PermissionBadge action="create" />
```

### StatusBadge
Affiche un badge pour le statut d'un utilisateur (active, inactive, suspended).

```tsx
<StatusBadge status="active" />
```

### PageHeader
En-tête de page avec titre, description, fil d'Ariane et actions.

```tsx
<PageHeader
  title="Titre de la page"
  description="Description optionnelle"
  breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Page actuelle' }]}
  action={<Button>Action</Button>}
/>
```

### DataTable
Table de données générique avec tri, filtrage et accessibilité.

```tsx
<DataTable
  data={items}
  columns={columns}
  keyExtractor={(item) => item.id}
  onRowClick={(item) => navigate(`/detail/${item.id}`)}
  emptyMessage="Aucune donnée"
  caption="Description de la table pour l'accessibilité"
  loading={isLoading}
/>
```

### AppLayout
Layout principal avec sidebar de navigation.

```tsx
<AppLayout>
  <YourPageContent />
</AppLayout>
```

## Principes d'Accessibilité

L'application respecte les meilleures pratiques WCAG 2.1 AA :

1. **Navigation au clavier** : Tous les éléments interactifs sont accessibles au clavier
2. **ARIA labels** : Labels appropriés pour les lecteurs d'écran
3. **Contraste** : Ratios de contraste conformes (4.5:1 minimum)
4. **Focus visible** : Indicateurs de focus clairs
5. **Structure sémantique** : HTML sémantique (header, nav, main, etc.)
6. **Messages d'état** : `role="status"` et `aria-live` pour les changements dynamiques
7. **Formulaires** : Labels associés, messages d'erreur, validation

## Mode Sombre

Le système supporte le mode sombre via la classe `.dark` qui redéfinit les tokens sémantiques.

## Bonnes Pratiques

### ✅ À FAIRE

1. Utiliser les tokens de composant dans les composants React
2. Utiliser les tokens sémantiques pour les intentions
3. Référencer les primitives uniquement depuis les tokens sémantiques
4. Créer de nouveaux tokens de composant si nécessaire
5. Maintenir la hiérarchie à 3 niveaux

### ❌ À NE PAS FAIRE

1. Utiliser des valeurs codées en dur dans les composants
2. Référencer directement les primitives depuis les composants
3. Dupliquer le code - créer des composants réutilisables à la place
4. Ignorer l'accessibilité

## Structure des Fichiers

```
/src/
  /app/
    /components/
      permission-badge.tsx       # Badge de permission
      status-badge.tsx          # Badge de statut
      page-header.tsx           # En-tête de page
      data-table.tsx            # Table de données
      app-layout.tsx            # Layout principal
      /ui/                      # Composants UI de base (shadcn)
    /contexts/
      auth-context.tsx          # Contexte d'authentification
    /data/
      mock-data.ts              # Données fictives
    /pages/
      login.tsx                 # Page de connexion
      dashboard.tsx             # Tableau de bord
      users.tsx                 # Gestion utilisateurs
      permissions.tsx           # Gestion permissions
      audit.tsx                 # Logs d'audit
      profile.tsx               # Profil utilisateur
    /services/
      api-interface.ts          # Interface API
      mock-api.ts               # Implémentation mockée
    /types/
      index.ts                  # Types TypeScript
    routes.tsx                  # Configuration routing
    App.tsx                     # Point d'entrée
  /styles/
    theme.css                   # Système de tokens CSS
```

## Évolution du Système

Pour ajouter de nouvelles couleurs ou espacements :

1. Ajouter la primitive dans le niveau 1
2. Créer un token sémantique dans le niveau 2 qui référence la primitive
3. Utiliser le token sémantique dans les tokens de composant (niveau 3)
4. Utiliser les tokens de composant dans les composants React

Cette architecture garantit qu'un changement au niveau primitif se propage automatiquement à travers tout le système.
