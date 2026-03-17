# Guide du Design Responsive - Compliance Hub

## Vue d'ensemble

L'application Compliance Hub est entièrement responsive et optimisée pour fonctionner sur tous les appareils, de l'iPhone SE (375px) aux écrans desktop larges (1920px+).

## Stratégie Responsive

### Breakpoints

L'application utilise les breakpoints Tailwind CSS standard :

```css
sm: 640px   /* Petites tablettes */
md: 768px   /* Tablettes */
lg: 1024px  /* Petit desktop */
xl: 1280px  /* Desktop standard */
2xl: 1536px /* Grands écrans */
```

### Points de rupture clés

- **< 768px (Mobile)** : Layout en colonne unique, navigation mobile, affichage en cartes
- **768px - 1024px (Tablette)** : Layout en 2 colonnes, navigation partielle
- **> 1024px (Desktop)** : Layout complet avec sidebar fixe, tables, grilles multi-colonnes

## Composants Responsive

### 1. AppLayout (Navigation)

#### Mobile (< 1024px)
- **Sidebar** : Menu hamburger avec overlay
- **Navigation** : Drawer coulissant depuis la gauche
- **Header** : Bouton menu + titre de l'app
- **Fermeture auto** : La sidebar se ferme lors du changement de route

#### Desktop (≥ 1024px)
- **Sidebar** : Fixe et toujours visible (280px)
- **Navigation** : Visible en permanence
- **Header** : Minimal sans bouton menu

```tsx
// Détection automatique mobile/desktop
useEffect(() => {
  const checkMobile = () => {
    const mobile = window.innerWidth < 1024;
    setIsMobile(mobile);
    if (!mobile) {
      setSidebarOpen(true); // Sidebar ouverte sur desktop
    } else {
      setSidebarOpen(false); // Sidebar fermée sur mobile
    }
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);
```

**Caractéristiques mobile :**
- Overlay semi-transparent (backdrop)
- Animation slide-in/out
- Touch targets de 44px minimum
- Fermeture par tap sur l'overlay
- Gestion du z-index (sidebar: 50, overlay: 40)

### 2. DataTable

Le composant DataTable s'adapte automatiquement au viewport :

#### Mobile (< 768px)
- **Affichage** : Cartes empilées
- **Colonnes cachées** : Utilise `hideOnMobile: true`
- **Labels** : Affiche `mobileLabel` ou `header`
- **Interaction** : Touch-friendly (48px de hauteur minimum)

#### Desktop (≥ 768px)
- **Affichage** : Table classique
- **Colonnes** : Toutes visibles
- **Scroll horizontal** : Si nécessaire

```tsx
const columns: Column<User>[] = [
  {
    key: 'name',
    header: 'Nom',
    mobileLabel: 'Utilisateur', // Label pour mobile
    render: (user) => <UserInfo user={user} />,
  },
  {
    key: 'country',
    header: 'Pays',
    hideOnMobile: true, // Masqué sur mobile
    render: (user) => user.country,
  },
];
```

### 3. PageHeader

#### Mobile
- **Layout** : Colonne (stack vertical)
- **Titre** : Taille responsive avec `clamp()`
- **Fil d'Ariane** : Caché (hidden sm:block)
- **Actions** : Pleine largeur avec libellé court

#### Desktop
- **Layout** : Ligne (flex horizontal)
- **Fil d'Ariane** : Visible
- **Actions** : Largeur automatique avec libellé complet

```tsx
<Button className="w-full sm:w-auto">
  <Plus className="w-4 h-4" />
  <span className="hidden sm:inline">Nouvel utilisateur</span>
  <span className="sm:hidden">Nouveau</span>
</Button>
```

### 4. Grilles & Layouts

Toutes les grilles utilisent un système responsive :

```tsx
// 1 colonne sur mobile, 2 sur tablette, 4 sur desktop
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
```

**Exemples :**
- **Statistiques Dashboard** : 1 → 2 → 4 colonnes
- **Filtres** : 1 → 2 → 4 colonnes
- **Actions rapides** : 1 → 2 → 3 colonnes

### 5. Typographie Responsive

Utilisation de `clamp()` pour les titres :

```tsx
// S'adapte de 1.25rem à 1.5rem selon la largeur de l'écran
fontSize: 'clamp(1.25rem, 4vw, 1.5rem)'
```

### 6. Espacements Adaptatifs

```tsx
// Espacement petit sur mobile, grand sur desktop
className="gap-3 sm:gap-4"
className="space-y-3 sm:space-y-4"
className="p-4 sm:p-6"
```

## Touch Targets (Accessibilité Mobile)

Tous les éléments interactifs respectent les guidelines d'accessibilité mobile :

### Tailles minimales
- **Boutons** : 44px × 44px minimum
- **Liens de navigation** : 48px de hauteur
- **Inputs** : 44px de hauteur minimum
- **Selects** : 44px de hauteur minimum

```tsx
// Exemples
<button style={{ minHeight: '44px', minWidth: '44px' }}>
<Input style={{ minHeight: '44px' }} />
<SelectTrigger style={{ minHeight: '44px' }}>
```

## Optimisations Mobile

### 1. Performance
- Détection du resize avec debounce implicite
- Rendu conditionnel (mobile vs desktop)
- Pas de re-render inutile lors du resize

### 2. UX Mobile
- **Swipe** : Pas de swipe horizontal accidentel
- **Scroll** : Scroll vertical fluide
- **Overlay** : Tap pour fermer les modales
- **Focus** : Gestion automatique du focus lors des transitions

### 3. Texte
- **Wrapping** : `break-words` et `break-all` sur les emails longs
- **Truncate** : `truncate` avec `title` pour le texte trop long
- **Padding** : Espacement suffisant pour éviter le texte coupé

```tsx
<p className="break-all px-2">{user.email}</p>
<div className="truncate" title={fullText}>{fullText}</div>
```

## Pages Responsive

### Dashboard
- **Cards statistiques** : 1 → 2 → 4 colonnes
- **Liste utilisateurs** : Avatars plus petits sur mobile
- **Actions rapides** : 1 → 2 → 3 colonnes
- **Role badge** : Caché sur mobile (hidden sm:block)

### Users & Permissions
- **Filtres** : Stack vertical sur mobile
- **Tableau** : Cartes sur mobile, table sur desktop
- **Bouton action** : Pleine largeur mobile, auto desktop
- **Colonnes cachées** : Pays et unité org masqués sur mobile

### Profile
- **Layout** : 1 colonne mobile → 3 colonnes desktop
- **Avatar** : Centré sur mobile
- **Email** : Break-all pour éviter le débordement
- **Permissions** : Cards empilées avec wrapping

### Audit
- **Table logs** : Format carte sur mobile
- **Pagination** : Boutons pleine largeur sur très petit écran
- **Timestamps** : Format court sur mobile

## Bonnes Pratiques Implémentées

### ✅ Design Mobile-First
1. Layout de base pour mobile
2. Ajout progressif de complexité pour desktop
3. Utilisation de classes Tailwind responsive (`sm:`, `md:`, `lg:`)

### ✅ Touch-Friendly
1. Tous les boutons font au moins 44px
2. Espacement suffisant entre les éléments tactiles
3. Zones de tap généreuses

### ✅ Performance
1. Détection resize optimisée
2. Composants conditionnels (mobile/desktop)
3. Pas de re-render inutile

### ✅ Accessibilité
1. Navigation au clavier maintenue
2. ARIA labels appropriés
3. Focus visible
4. Contraste respecté

### ✅ Contenu Adaptatif
1. Texte responsive avec `clamp()`
2. Images et icônes proportionnelles
3. Espacement fluide

## Tests Recommandés

### Appareils à tester
- ✅ **iPhone SE** (375px) - Plus petit smartphone courant
- ✅ **iPhone 12/13/14** (390px)
- ✅ **iPhone 14 Plus** (428px)
- ✅ **iPad Mini** (768px)
- ✅ **iPad Pro** (1024px)
- ✅ **Desktop** (1280px, 1440px, 1920px)

### Orientations
- Portrait (mobile/tablette)
- Paysage (mobile/tablette)

### Navigateurs
- Safari iOS
- Chrome Android
- Safari Desktop
- Chrome Desktop
- Firefox Desktop

## Breakpoints par Page

| Page | Mobile (< 768px) | Tablette (768-1024px) | Desktop (> 1024px) |
|------|------------------|----------------------|-------------------|
| Login | 1 col, pleine largeur | 1 col, max 28rem | 1 col, max 28rem |
| Dashboard | 1 col | 2 cols | 4 cols statistiques |
| Users | Cards | Cards/Table hybrid | Table complète |
| Permissions | Cards | Cards/Table hybrid | Table complète |
| Profile | 1 col | 1 col | 3 cols (1+2) |
| Audit | Cards | Cards/Table hybrid | Table + pagination |

## Métrique de Succès

L'application est considérée comme réussie sur mobile si :

1. ✅ **Utilisable sur iPhone SE** (375px) sans scroll horizontal
2. ✅ **Touch targets** ≥ 44px
3. ✅ **Aucun texte coupé** ou illisible
4. ✅ **Navigation fluide** sans latence
5. ✅ **Pas de zoom** involontaire sur les inputs
6. ✅ **Interactions tactiles** naturelles et intuitives
7. ✅ **Performance** : Rendu rapide et transitions fluides

## Code Patterns Réutilisables

### Pattern 1: Grid Responsive
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
  {/* Contenu */}
</div>
```

### Pattern 2: Bouton Responsive
```tsx
<Button className="w-full sm:w-auto" style={{ minHeight: '44px' }}>
  <Icon className="w-4 h-4" />
  <span className="hidden sm:inline">Texte complet</span>
  <span className="sm:hidden">Court</span>
</Button>
```

### Pattern 3: Texte Responsive
```tsx
<h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
  Titre adaptatif
</h1>
```

### Pattern 4: Détection Mobile
```tsx
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 768);
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);
```

### Pattern 5: Composant Conditionnel
```tsx
{isMobile ? (
  <MobileVersion />
) : (
  <DesktopVersion />
)}
```

## Améliorations Futures

- [ ] **Gestes tactiles** : Swipe pour naviguer, pull-to-refresh
- [ ] **PWA** : Mode hors ligne, installation sur écran d'accueil
- [ ] **Lazy loading** : Images et composants chargés à la demande
- [ ] **Optimisation tablette** : Layout spécifique iPad
- [ ] **Mode sombre mobile** : Respect des préférences système
- [ ] **Haptic feedback** : Vibrations tactiles sur actions importantes

---

L'application est maintenant parfaitement utilisable sur iPhone SE et tous les formats d'écran jusqu'aux grands desktops, avec une expérience optimale pour chaque taille d'écran.
