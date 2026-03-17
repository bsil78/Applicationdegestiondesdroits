/**
 * Implémentation mockée de l'API de conformité
 * Simule une vraie API avec délais réseau et gestion des données en mémoire
 */

import type { IComplianceApi } from './api-interface';
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
  PermissionAction,
} from '../types';

import {
  mockCountries,
  mockOrganizationalUnits,
  mockApplications,
  mockUsers,
  mockPermissions,
  mockAuditLogs,
  mockPasswordHash,
} from '../data/mock-data';

/**
 * Classe implémentant l'API mockée
 */
export class MockComplianceApi implements IComplianceApi {
  private users: User[] = [...mockUsers];
  private permissions: Permission[] = [...mockPermissions];
  private countries: Country[] = [...mockCountries];
  private organizationalUnits: OrganizationalUnit[] = [...mockOrganizationalUnits];
  private applications: Application[] = [...mockApplications];
  private auditLogs: AuditLog[] = [...mockAuditLogs];
  
  // Simulation de délais réseau (en ms)
  private readonly API_DELAY = 300;
  
  /**
   * Simule un délai réseau
   */
  private delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.API_DELAY));
  }
  
  /**
   * Génère un ID unique
   */
  private generateId(prefix: string): string {
    return `${prefix}${Date.now()}${Math.random().toString(36).substring(2, 9)}`;
  }
  
  /**
   * Crée un timestamp ISO
   */
  private now(): string {
    return new Date().toISOString();
  }
  
  // ============================================
  // Authentification
  // ============================================
  
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    await this.delay();
    
    const user = this.users.find((u) => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }
    
    if (user.status !== 'active') {
      throw new Error('Compte utilisateur inactif ou suspendu');
    }
    
    // Vérification simplifiée du mot de passe (dans un vrai système, utiliser bcrypt)
    if (credentials.password !== mockPasswordHash) {
      throw new Error('Email ou mot de passe incorrect');
    }
    
    // Mise à jour du dernier login
    user.lastLoginAt = this.now();
    
    // Génération d'un token fictif (dans un vrai système, utiliser JWT)
    const token = `mock_token_${user.id}_${Date.now()}`;
    
    // Log d'audit
    await this.createAuditLog({
      userId: user.id,
      action: 'USER_LOGIN',
      entityType: 'user',
      entityId: user.id,
      changes: {},
      ipAddress: '127.0.0.1',
    });
    
    return {
      user,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
    };
  }
  
  async logout(): Promise<void> {
    await this.delay();
    // Dans une vraie implémentation, on invaliderait le token
  }
  
  async verifyToken(token: string): Promise<User> {
    await this.delay();
    
    // Extraction simplifiée de l'ID depuis le token
    const match = token.match(/mock_token_([^_]+)_/);
    if (!match) {
      throw new Error('Token invalide');
    }
    
    const userId = match[1];
    const user = this.users.find((u) => u.id === userId);
    
    if (!user || user.status !== 'active') {
      throw new Error('Token invalide ou utilisateur inactif');
    }
    
    return user;
  }
  
  // ============================================
  // Utilisateurs
  // ============================================
  
  async getUsers(filters?: UserFilters): Promise<User[]> {
    await this.delay();
    
    let result = [...this.users];
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (u) =>
          u.email.toLowerCase().includes(search) ||
          u.firstName.toLowerCase().includes(search) ||
          u.lastName.toLowerCase().includes(search)
      );
    }
    
    if (filters?.role) {
      result = result.filter((u) => u.role === filters.role);
    }
    
    if (filters?.status) {
      result = result.filter((u) => u.status === filters.status);
    }
    
    if (filters?.countryId) {
      result = result.filter((u) => u.countryId === filters.countryId);
    }
    
    if (filters?.organizationalUnitId) {
      result = result.filter((u) => u.organizationalUnitId === filters.organizationalUnitId);
    }
    
    return result;
  }
  
  async getUserById(id: string): Promise<UserWithDetails> {
    await this.delay();
    
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new Error(`Utilisateur ${id} introuvable`);
    }
    
    const country = this.countries.find((c) => c.id === user.countryId)!;
    const organizationalUnit = this.organizationalUnits.find((ou) => ou.id === user.organizationalUnitId)!;
    const permissions = this.permissions.filter((p) => p.userId === id);
    
    return {
      ...user,
      country,
      organizationalUnit,
      permissions,
    };
  }
  
  async createUser(input: CreateUserInput): Promise<User> {
    await this.delay();
    
    // Vérifier si l'email existe déjà
    if (this.users.some((u) => u.email === input.email)) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }
    
    const newUser: User = {
      id: this.generateId('u'),
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      status: 'active',
      countryId: input.countryId,
      organizationalUnitId: input.organizationalUnitId,
      createdAt: this.now(),
      updatedAt: this.now(),
      lastLoginAt: null,
    };
    
    this.users.push(newUser);
    
    // Log d'audit
    await this.createAuditLog({
      userId: newUser.id,
      action: 'USER_CREATED',
      entityType: 'user',
      entityId: newUser.id,
      changes: { ...input },
      ipAddress: '127.0.0.1',
    });
    
    return newUser;
  }
  
  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    await this.delay();
    
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error(`Utilisateur ${id} introuvable`);
    }
    
    const oldUser = { ...this.users[userIndex] };
    const updatedUser: User = {
      ...this.users[userIndex],
      ...input,
      updatedAt: this.now(),
    };
    
    this.users[userIndex] = updatedUser;
    
    // Log d'audit
    await this.createAuditLog({
      userId: id,
      action: 'USER_UPDATED',
      entityType: 'user',
      entityId: id,
      changes: { old: oldUser, new: input },
      ipAddress: '127.0.0.1',
    });
    
    return updatedUser;
  }
  
  async deleteUser(id: string): Promise<void> {
    await this.delay();
    
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error(`Utilisateur ${id} introuvable`);
    }
    
    // Au lieu de supprimer, on désactive l'utilisateur
    this.users[userIndex].status = 'inactive';
    this.users[userIndex].updatedAt = this.now();
    
    // Log d'audit
    await this.createAuditLog({
      userId: id,
      action: 'USER_DELETED',
      entityType: 'user',
      entityId: id,
      changes: { status: 'inactive' },
      ipAddress: '127.0.0.1',
    });
  }
  
  async getUserPermissionStats(userId: string): Promise<UserPermissionStats> {
    await this.delay();
    
    const permissions = this.permissions.filter((p) => p.userId === userId);
    
    const permissionsByApplication: Record<string, number> = {};
    const permissionsByAction: Record<PermissionAction, number> = {
      create: 0,
      read: 0,
      update: 0,
      archive: 0,
    };
    
    permissions.forEach((p) => {
      permissionsByApplication[p.applicationId] = (permissionsByApplication[p.applicationId] || 0) + 1;
      p.actions.forEach((action) => {
        permissionsByAction[action]++;
      });
    });
    
    return {
      userId,
      totalPermissions: permissions.length,
      permissionsByApplication,
      permissionsByAction,
    };
  }
  
  // ============================================
  // Permissions
  // ============================================
  
  async getPermissions(filters?: PermissionFilters): Promise<Permission[]> {
    await this.delay();
    
    let result = [...this.permissions];
    
    if (filters?.userId) {
      result = result.filter((p) => p.userId === filters.userId);
    }
    
    if (filters?.applicationId) {
      result = result.filter((p) => p.applicationId === filters.applicationId);
    }
    
    if (filters?.action) {
      result = result.filter((p) => p.actions.includes(filters.action!));
    }
    
    if (filters?.countryId) {
      result = result.filter((p) => p.countryIds.includes(filters.countryId!));
    }
    
    if (filters?.organizationalUnitId) {
      result = result.filter((p) => p.organizationalUnitIds.includes(filters.organizationalUnitId!));
    }
    
    if (filters?.isExpired !== undefined) {
      const now = new Date();
      result = result.filter((p) => {
        if (!p.expiresAt) return !filters.isExpired;
        const isExpired = new Date(p.expiresAt) < now;
        return filters.isExpired ? isExpired : !isExpired;
      });
    }
    
    return result;
  }
  
  async getPermissionById(id: string): Promise<PermissionWithDetails> {
    await this.delay();
    
    const permission = this.permissions.find((p) => p.id === id);
    if (!permission) {
      throw new Error(`Permission ${id} introuvable`);
    }
    
    const user = this.users.find((u) => u.id === permission.userId)!;
    const application = this.applications.find((a) => a.id === permission.applicationId)!;
    const countries = this.countries.filter((c) => permission.countryIds.includes(c.id));
    const organizationalUnits = this.organizationalUnits.filter((ou) =>
      permission.organizationalUnitIds.includes(ou.id)
    );
    
    return {
      ...permission,
      user,
      application,
      countries,
      organizationalUnits,
    };
  }
  
  async createPermission(input: CreatePermissionInput): Promise<Permission> {
    await this.delay();
    
    // Vérifier si une permission similaire existe déjà
    const existing = this.permissions.find(
      (p) => p.userId === input.userId && p.applicationId === input.applicationId
    );
    
    if (existing) {
      throw new Error('Une permission existe déjà pour cet utilisateur et cette application');
    }
    
    const newPermission: Permission = {
      id: this.generateId('p'),
      userId: input.userId,
      applicationId: input.applicationId,
      actions: input.actions,
      countryIds: input.countryIds,
      organizationalUnitIds: input.organizationalUnitIds,
      grantedAt: this.now(),
      grantedBy: input.userId, // Dans un vrai système, ce serait l'utilisateur connecté
      expiresAt: input.expiresAt || null,
      notes: input.notes,
    };
    
    this.permissions.push(newPermission);
    
    // Log d'audit
    await this.createAuditLog({
      userId: input.userId,
      action: 'PERMISSION_CREATED',
      entityType: 'permission',
      entityId: newPermission.id,
      changes: { ...input },
      ipAddress: '127.0.0.1',
    });
    
    return newPermission;
  }
  
  async updatePermission(id: string, input: UpdatePermissionInput): Promise<Permission> {
    await this.delay();
    
    const permissionIndex = this.permissions.findIndex((p) => p.id === id);
    if (permissionIndex === -1) {
      throw new Error(`Permission ${id} introuvable`);
    }
    
    const oldPermission = { ...this.permissions[permissionIndex] };
    const updatedPermission: Permission = {
      ...this.permissions[permissionIndex],
      ...input,
    };
    
    this.permissions[permissionIndex] = updatedPermission;
    
    // Log d'audit
    await this.createAuditLog({
      userId: updatedPermission.userId,
      action: 'PERMISSION_UPDATED',
      entityType: 'permission',
      entityId: id,
      changes: { old: oldPermission, new: input },
      ipAddress: '127.0.0.1',
    });
    
    return updatedPermission;
  }
  
  async deletePermission(id: string): Promise<void> {
    await this.delay();
    
    const permissionIndex = this.permissions.findIndex((p) => p.id === id);
    if (permissionIndex === -1) {
      throw new Error(`Permission ${id} introuvable`);
    }
    
    const permission = this.permissions[permissionIndex];
    this.permissions.splice(permissionIndex, 1);
    
    // Log d'audit
    await this.createAuditLog({
      userId: permission.userId,
      action: 'PERMISSION_DELETED',
      entityType: 'permission',
      entityId: id,
      changes: { permission },
      ipAddress: '127.0.0.1',
    });
  }
  
  async getUserPermissions(userId: string): Promise<Permission[]> {
    await this.delay();
    return this.permissions.filter((p) => p.userId === userId);
  }
  
  // ============================================
  // Pays
  // ============================================
  
  async getCountries(): Promise<Country[]> {
    await this.delay();
    return [...this.countries];
  }
  
  async getCountryById(id: string): Promise<Country> {
    await this.delay();
    const country = this.countries.find((c) => c.id === id);
    if (!country) {
      throw new Error(`Pays ${id} introuvable`);
    }
    return country;
  }
  
  // ============================================
  // Unités organisationnelles
  // ============================================
  
  async getOrganizationalUnits(): Promise<OrganizationalUnit[]> {
    await this.delay();
    return [...this.organizationalUnits];
  }
  
  async getOrganizationalUnitById(id: string): Promise<OrganizationalUnit> {
    await this.delay();
    const ou = this.organizationalUnits.find((ou) => ou.id === id);
    if (!ou) {
      throw new Error(`Unité organisationnelle ${id} introuvable`);
    }
    return ou;
  }
  
  async getOrganizationalUnitsByCountry(countryId: string): Promise<OrganizationalUnit[]> {
    await this.delay();
    return this.organizationalUnits.filter((ou) => ou.countryId === countryId);
  }
  
  async getChildOrganizationalUnits(parentId: string): Promise<OrganizationalUnit[]> {
    await this.delay();
    return this.organizationalUnits.filter((ou) => ou.parentId === parentId);
  }
  
  // ============================================
  // Applications
  // ============================================
  
  async getApplications(): Promise<Application[]> {
    await this.delay();
    return [...this.applications];
  }
  
  async getApplicationById(id: string): Promise<Application> {
    await this.delay();
    const app = this.applications.find((a) => a.id === id);
    if (!app) {
      throw new Error(`Application ${id} introuvable`);
    }
    return app;
  }
  
  async getActiveApplications(): Promise<Application[]> {
    await this.delay();
    return this.applications.filter((a) => a.status === 'active');
  }
  
  // ============================================
  // Logs d'audit
  // ============================================
  
  async getAuditLogs(page = 1, pageSize = 20): Promise<PaginatedResponse<AuditLog>> {
    await this.delay();
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    // Trier par timestamp décroissant
    const sortedLogs = [...this.auditLogs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    const data = sortedLogs.slice(startIndex, endIndex);
    const total = this.auditLogs.length;
    const totalPages = Math.ceil(total / pageSize);
    
    return {
      data,
      total,
      page,
      pageSize,
      totalPages,
    };
  }
  
  async getAuditLogsByUser(userId: string): Promise<AuditLog[]> {
    await this.delay();
    return this.auditLogs
      .filter((log) => log.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  async getAuditLogsByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    await this.delay();
    return this.auditLogs
      .filter((log) => log.entityType === entityType && log.entityId === entityId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  async createAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const newLog: AuditLog = {
      ...log,
      id: this.generateId('log'),
      timestamp: this.now(),
    };
    
    this.auditLogs.push(newLog);
    return newLog;
  }
}

// Instance singleton de l'API mockée
export const api = new MockComplianceApi();
