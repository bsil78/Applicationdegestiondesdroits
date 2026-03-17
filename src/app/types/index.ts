/**
 * Types pour l'application de gestion des droits utilisateurs
 * Application de conformité avec gestion hiérarchique et géographique
 */

// ============================================
// Types de base
// ============================================

export type PermissionAction = 'create' | 'read' | 'update' | 'archive';

export type UserRole = 'admin' | 'manager' | 'user' | 'viewer';

export type UserStatus = 'active' | 'inactive' | 'suspended';

// ============================================
// Entités principales
// ============================================

/**
 * Représente un pays dans le système
 */
export interface Country {
  id: string;
  code: string;
  name: string;
  region: string;
}

/**
 * Représente une unité organisationnelle (département, équipe, etc.)
 */
export interface OrganizationalUnit {
  id: string;
  name: string;
  parentId: string | null;
  countryId: string;
  level: number;
  path: string; // Ex: "Europe/France/Paris/Compliance"
}

/**
 * Représente une application métier de conformité
 */
export interface Application {
  id: string;
  name: string;
  description: string;
  code: string;
  icon?: string;
  status: 'active' | 'maintenance' | 'deprecated';
  createdAt: string;
  updatedAt: string;
}

/**
 * Représente un utilisateur du système
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  countryId: string;
  organizationalUnitId: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

/**
 * Représente une permission accordée à un utilisateur
 */
export interface Permission {
  id: string;
  userId: string;
  applicationId: string;
  actions: PermissionAction[];
  countryIds: string[]; // Pays pour lesquels la permission s'applique
  organizationalUnitIds: string[]; // Unités org pour lesquelles la permission s'applique
  grantedAt: string;
  grantedBy: string; // userId qui a accordé la permission
  expiresAt: string | null;
  notes?: string;
}

/**
 * Représente un log d'audit
 */
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: 'user' | 'permission' | 'application';
  entityId: string;
  changes: Record<string, unknown>;
  ipAddress: string;
  timestamp: string;
}

// ============================================
// Types dérivés et vues
// ============================================

/**
 * Vue enrichie d'un utilisateur avec ses relations
 */
export interface UserWithDetails extends User {
  country: Country;
  organizationalUnit: OrganizationalUnit;
  permissions: Permission[];
}

/**
 * Vue enrichie d'une permission avec ses relations
 */
export interface PermissionWithDetails extends Permission {
  user: User;
  application: Application;
  countries: Country[];
  organizationalUnits: OrganizationalUnit[];
}

/**
 * Statistiques sur les permissions d'un utilisateur
 */
export interface UserPermissionStats {
  userId: string;
  totalPermissions: number;
  permissionsByApplication: Record<string, number>;
  permissionsByAction: Record<PermissionAction, number>;
}

// ============================================
// Types pour l'authentification
// ============================================

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
  isAuthenticated: boolean;
}

// ============================================
// Types pour les filtres et recherches
// ============================================

export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  countryId?: string;
  organizationalUnitId?: string;
}

export interface PermissionFilters {
  userId?: string;
  applicationId?: string;
  action?: PermissionAction;
  countryId?: string;
  organizationalUnitId?: string;
  isExpired?: boolean;
}

// ============================================
// Types pour les formulaires
// ============================================

export interface CreateUserInput {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  countryId: string;
  organizationalUnitId: string;
  password: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  status?: UserStatus;
  countryId?: string;
  organizationalUnitId?: string;
}

export interface CreatePermissionInput {
  userId: string;
  applicationId: string;
  actions: PermissionAction[];
  countryIds: string[];
  organizationalUnitIds: string[];
  expiresAt?: string;
  notes?: string;
}

export interface UpdatePermissionInput {
  actions?: PermissionAction[];
  countryIds?: string[];
  organizationalUnitIds?: string[];
  expiresAt?: string;
  notes?: string;
}

// ============================================
// Types pour les réponses API
// ============================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
