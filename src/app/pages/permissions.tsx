/**
 * Page de gestion des permissions
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { PageHeader } from '../components/page-header';
import { DataTable, type Column } from '../components/data-table';
import { PermissionBadge } from '../components/permission-badge';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, AlertCircle } from 'lucide-react';
import { api } from '../services/mock-api';
import type { Permission, User, Application, Country, PermissionFilters } from '../types';

export function PermissionsPage() {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PermissionFilters>({});

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [permissionsData, usersData, applicationsData, countriesData] = await Promise.all([
        api.getPermissions(filters),
        api.getUsers(),
        api.getApplications(),
        api.getCountries(),
      ]);

      setPermissions(permissionsData);
      setUsers(usersData);
      setApplications(applicationsData);
      setCountries(countriesData);
    } catch (error) {
      console.error('Erreur lors du chargement des permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : '-';
  };

  const getApplicationName = (applicationId: string) => {
    return applications.find((a) => a.id === applicationId)?.name || '-';
  };

  const getCountryNames = (countryIds: string[]) => {
    return countryIds
      .map((id) => countries.find((c) => c.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const isExpired = (permission: Permission) => {
    if (!permission.expiresAt) return false;
    return new Date(permission.expiresAt) < new Date();
  };

  const columns: Column<Permission>[] = [
    {
      key: 'user',
      header: 'Utilisateur',
      render: (permission) => (
        <div style={{ fontWeight: 'var(--primitive-font-weight-medium)' }}>
          {getUserName(permission.userId)}
        </div>
      ),
    },
    {
      key: 'application',
      header: 'Application',
      render: (permission) => getApplicationName(permission.applicationId),
    },
    {
      key: 'actions',
      header: 'Actions autorisées',
      mobileLabel: 'Actions',
      render: (permission) => (
        <div className="flex flex-wrap gap-2">
          {permission.actions.map((action) => (
            <PermissionBadge key={action} action={action} />
          ))}
        </div>
      ),
    },
    {
      key: 'countries',
      header: 'Pays',
      hideOnMobile: true, // Caché sur mobile
      render: (permission) => (
        <div style={{ maxWidth: '150px' }} className="truncate" title={getCountryNames(permission.countryIds)}>
          {getCountryNames(permission.countryIds) || 'Aucun'}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (permission) => {
        const expired = isExpired(permission);
        return expired ? (
          <span
            className="inline-flex items-center gap-1"
            style={{
              fontSize: 'var(--primitive-font-size-xs)',
              color: 'var(--semantic-color-danger)',
              fontWeight: 'var(--primitive-font-weight-medium)',
            }}
          >
            <AlertCircle className="w-3 h-3" aria-hidden="true" />
            Expirée
          </span>
        ) : (
          <span
            style={{
              fontSize: 'var(--primitive-font-size-xs)',
              color: 'var(--semantic-color-success)',
              fontWeight: 'var(--primitive-font-weight-medium)',
            }}
          >
            Active
          </span>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="Gestion des permissions"
        description="Gérer les droits d'accès aux applications de conformité"
        breadcrumbs={[{ label: 'Accueil', href: '/dashboard' }, { label: 'Permissions' }]}
        action={
          <Button
            onClick={() => navigate('/permissions/new')}
            className="w-full sm:w-auto"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--primitive-space-sm)',
              minHeight: '44px',
            }}
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Nouvelle permission</span>
            <span className="sm:hidden">Nouveau</span>
          </Button>
        }
      />

      {/* Filters */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        style={{
          marginBottom: 'var(--semantic-spacing-component)',
          padding: 'var(--semantic-spacing-element)',
          backgroundColor: 'var(--component-card-bg)',
          border: `var(--primitive-border-width-thin) solid var(--component-card-border)`,
          borderRadius: 'var(--component-card-radius)',
        }}
      >
        <Select
          value={filters.userId || 'all'}
          onValueChange={(value) =>
            setFilters({ ...filters, userId: value === 'all' ? undefined : value })
          }
        >
          <SelectTrigger aria-label="Filtrer par utilisateur" style={{ minHeight: '44px' }}>
            <SelectValue placeholder="Tous les utilisateurs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les utilisateurs</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.applicationId || 'all'}
          onValueChange={(value) =>
            setFilters({ ...filters, applicationId: value === 'all' ? undefined : value })
          }
        >
          <SelectTrigger aria-label="Filtrer par application" style={{ minHeight: '44px' }}>
            <SelectValue placeholder="Toutes les applications" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les applications</SelectItem>
            {applications.filter(app => app.status === 'active').map((app) => (
              <SelectItem key={app.id} value={app.id}>
                {app.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.action || 'all'}
          onValueChange={(value) =>
            setFilters({ ...filters, action: value === 'all' ? undefined : (value as any) })
          }
        >
          <SelectTrigger aria-label="Filtrer par action" style={{ minHeight: '44px' }}>
            <SelectValue placeholder="Toutes les actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les actions</SelectItem>
            <SelectItem value="create">Créer</SelectItem>
            <SelectItem value="read">Consulter</SelectItem>
            <SelectItem value="update">Modifier</SelectItem>
            <SelectItem value="archive">Archiver</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.isExpired === undefined ? 'all' : filters.isExpired ? 'expired' : 'active'}
          onValueChange={(value) =>
            setFilters({
              ...filters,
              isExpired: value === 'all' ? undefined : value === 'expired',
            })
          }
        >
          <SelectTrigger aria-label="Filtrer par statut" style={{ minHeight: '44px' }}>
            <SelectValue placeholder="Toutes les permissions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="active">Actives</SelectItem>
            <SelectItem value="expired">Expirées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        data={permissions}
        columns={columns}
        keyExtractor={(permission) => permission.id}
        onRowClick={(permission) => navigate(`/permissions/${permission.id}`)}
        emptyMessage="Aucune permission trouvée"
        caption="Liste des permissions du système"
        loading={loading}
      />

      {/* Results count */}
      {!loading && (
        <p
          style={{
            marginTop: 'var(--semantic-spacing-element)',
            fontSize: 'var(--primitive-font-size-sm)',
            color: 'var(--semantic-text-secondary)',
            textAlign: 'center',
          }}
          role="status"
          aria-live="polite"
        >
          {permissions.length} permission{permissions.length > 1 ? 's' : ''} trouvée
          {permissions.length > 1 ? 's' : ''}
        </p>
      )}
    </>
  );
}