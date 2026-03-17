/**
 * Interface API pour l'accès aux données
 * Cette interface définit le contrat que doit respecter toute implémentation
 * (mockée ou réelle)
 */

import type {
  User,
  Country,
  OrganizationalUnit,
  Application,
  Permission,
  AuditLog,
  UserWithDetails,
  PermissionWithDetails,
  AuthCredentials,
  AuthResponse,
  CreateUserInput,
  UpdateUserInput,
  CreatePermissionInput,
  UpdatePermissionInput,
  UserFilters,
  PermissionFilters,
  PaginatedResponse,
  UserPermissionStats,
} from '../types';

/**
 * Interface principale de l'API
 * Toutes les méthodes retournent des Promises pour simuler des appels asynchrones
 */
export interface IComplianceApi {
  // ============================================
  // Authentification
  // ============================================
  
  /**
   * Authentifie un utilisateur avec email et mot de passe
   * @throws Error si les credentials sont invalides
   */
  login(credentials: AuthCredentials): Promise<AuthResponse>;
  
  /**
   * Déconnecte l'utilisateur courant
   */
  logout(): Promise<void>;
  
  /**
   * Vérifie la validité du token actuel
   */
  verifyToken(token: string): Promise<User>;
  
  // ============================================
  // Utilisateurs
  // ============================================
  
  /**
   * Récupère tous les utilisateurs avec filtres optionnels
   */
  getUsers(filters?: UserFilters): Promise<User[]>;
  
  /**
   * Récupère un utilisateur par son ID avec toutes ses relations
   */
  getUserById(id: string): Promise<UserWithDetails>;
  
  /**
   * Crée un nouvel utilisateur
   * @throws Error si l'email existe déjà
   */
  createUser(input: CreateUserInput): Promise<User>;
  
  /**
   * Met à jour un utilisateur existant
   * @throws Error si l'utilisateur n'existe pas
   */
  updateUser(id: string, input: UpdateUserInput): Promise<User>;
  
  /**
   * Supprime (ou archive) un utilisateur
   */
  deleteUser(id: string): Promise<void>;
  
  /**
   * Récupère les statistiques de permissions d'un utilisateur
   */
  getUserPermissionStats(userId: string): Promise<UserPermissionStats>;
  
  // ============================================
  // Permissions
  // ============================================
  
  /**
   * Récupère toutes les permissions avec filtres optionnels
   */
  getPermissions(filters?: PermissionFilters): Promise<Permission[]>;
  
  /**
   * Récupère une permission par son ID avec toutes ses relations
   */
  getPermissionById(id: string): Promise<PermissionWithDetails>;
  
  /**
   * Crée une nouvelle permission
   * @throws Error si la permission existe déjà pour cet utilisateur/application
   */
  createPermission(input: CreatePermissionInput): Promise<Permission>;
  
  /**
   * Met à jour une permission existante
   * @throws Error si la permission n'existe pas
   */
  updatePermission(id: string, input: UpdatePermissionInput): Promise<Permission>;
  
  /**
   * Supprime une permission
   */
  deletePermission(id: string): Promise<void>;
  
  /**
   * Récupère toutes les permissions d'un utilisateur
   */
  getUserPermissions(userId: string): Promise<Permission[]>;
  
  // ============================================
  // Pays
  // ============================================
  
  /**
   * Récupère tous les pays
   */
  getCountries(): Promise<Country[]>;
  
  /**
   * Récupère un pays par son ID
   */
  getCountryById(id: string): Promise<Country>;
  
  // ============================================
  // Unités organisationnelles
  // ============================================
  
  /**
   * Récupère toutes les unités organisationnelles
   */
  getOrganizationalUnits(): Promise<OrganizationalUnit[]>;
  
  /**
   * Récupère une unité organisationnelle par son ID
   */
  getOrganizationalUnitById(id: string): Promise<OrganizationalUnit>;
  
  /**
   * Récupère les unités organisationnelles d'un pays
   */
  getOrganizationalUnitsByCountry(countryId: string): Promise<OrganizationalUnit[]>;
  
  /**
   * Récupère les unités organisationnelles enfants d'une unité parente
   */
  getChildOrganizationalUnits(parentId: string): Promise<OrganizationalUnit[]>;
  
  // ============================================
  // Applications
  // ============================================
  
  /**
   * Récupère toutes les applications
   */
  getApplications(): Promise<Application[]>;
  
  /**
   * Récupère une application par son ID
   */
  getApplicationById(id: string): Promise<Application>;
  
  /**
   * Récupère les applications actives uniquement
   */
  getActiveApplications(): Promise<Application[]>;
  
  // ============================================
  // Logs d'audit
  // ============================================
  
  /**
   * Récupère les logs d'audit avec pagination
   */
  getAuditLogs(page?: number, pageSize?: number): Promise<PaginatedResponse<AuditLog>>;
  
  /**
   * Récupère les logs d'audit pour un utilisateur spécifique
   */
  getAuditLogsByUser(userId: string): Promise<AuditLog[]>;
  
  /**
   * Récupère les logs d'audit pour une entité spécifique
   */
  getAuditLogsByEntity(entityType: string, entityId: string): Promise<AuditLog[]>;
  
  /**
   * Crée un nouveau log d'audit
   */
  createAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog>;
}
