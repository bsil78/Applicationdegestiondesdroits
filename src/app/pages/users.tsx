/**
 * Page de gestion des utilisateurs
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { PageHeader } from '../components/page-header';
import { DataTable, type Column } from '../components/data-table';
import { StatusBadge } from '../components/status-badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, Search } from 'lucide-react';
import { api } from '../services/mock-api';
import type { User, Country, OrganizationalUnit, UserFilters } from '../types';

export function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [orgUnits, setOrgUnits] = useState<OrganizationalUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({});

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, countriesData, orgUnitsData] = await Promise.all([
        api.getUsers(filters),
        api.getCountries(),
        api.getOrganizationalUnits(),
      ]);

      setUsers(usersData);
      setCountries(countriesData);
      setOrgUnits(orgUnitsData);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCountryName = (countryId: string) => {
    return countries.find((c) => c.id === countryId)?.name || '-';
  };

  const getOrgUnitName = (orgUnitId: string) => {
    return orgUnits.find((ou) => ou.id === orgUnitId)?.name || '-';
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Nom',
      render: (user) => (
        <div>
          <div style={{ fontWeight: 'var(--primitive-font-weight-medium)' }}>
            {user.firstName} {user.lastName}
          </div>
          <div
            style={{
              fontSize: 'var(--primitive-font-size-sm)',
              color: 'var(--semantic-text-secondary)',
            }}
          >
            {user.email}
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rôle',
      render: (user) => (
        <span
          style={{
            textTransform: 'capitalize',
            color: 'var(--semantic-text-primary)',
          }}
        >
          {user.role === 'admin'
            ? 'Administrateur'
            : user.role === 'manager'
            ? 'Manager'
            : user.role === 'user'
            ? 'Utilisateur'
            : 'Observateur'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (user) => <StatusBadge status={user.status} />,
    },
    {
      key: 'country',
      header: 'Pays',
      render: (user) => getCountryName(user.countryId),
    },
    {
      key: 'orgUnit',
      header: 'Unité organisationnelle',
      render: (user) => (
        <div style={{ maxWidth: '200px' }} className="truncate" title={getOrgUnitName(user.organizationalUnitId)}>
          {getOrgUnitName(user.organizationalUnitId)}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Gestion des utilisateurs"
        description="Gérer les comptes utilisateurs et leurs informations"
        breadcrumbs={[{ label: 'Accueil', href: '/dashboard' }, { label: 'Utilisateurs' }]}
        action={
          <Button
            onClick={() => navigate('/users/new')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--primitive-space-sm)',
            }}
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Nouvel utilisateur
          </Button>
        }
      />

      {/* Filters */}
      <div
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        style={{
          marginBottom: 'var(--semantic-spacing-component)',
          padding: 'var(--component-card-padding)',
          backgroundColor: 'var(--component-card-bg)',
          border: `var(--primitive-border-width-thin) solid var(--component-card-border)`,
          borderRadius: 'var(--component-card-radius)',
        }}
      >
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'var(--semantic-text-tertiary)' }}
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Rechercher..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{ paddingLeft: '2.5rem' }}
            aria-label="Rechercher des utilisateurs"
          />
        </div>

        <Select
          value={filters.role || 'all'}
          onValueChange={(value) =>
            setFilters({ ...filters, role: value === 'all' ? undefined : (value as any) })
          }
        >
          <SelectTrigger aria-label="Filtrer par rôle">
            <SelectValue placeholder="Tous les rôles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            <SelectItem value="admin">Administrateur</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="user">Utilisateur</SelectItem>
            <SelectItem value="viewer">Observateur</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status || 'all'}
          onValueChange={(value) =>
            setFilters({ ...filters, status: value === 'all' ? undefined : (value as any) })
          }
        >
          <SelectTrigger aria-label="Filtrer par statut">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
            <SelectItem value="suspended">Suspendu</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.countryId || 'all'}
          onValueChange={(value) =>
            setFilters({ ...filters, countryId: value === 'all' ? undefined : value })
          }
        >
          <SelectTrigger aria-label="Filtrer par pays">
            <SelectValue placeholder="Tous les pays" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les pays</SelectItem>
            {countries.map((country) => (
              <SelectItem key={country.id} value={country.id}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        data={users}
        columns={columns}
        keyExtractor={(user) => user.id}
        onRowClick={(user) => navigate(`/users/${user.id}`)}
        emptyMessage="Aucun utilisateur trouvé"
        caption="Liste des utilisateurs du système"
        loading={loading}
      />

      {/* Results count */}
      {!loading && (
        <p
          style={{
            marginTop: 'var(--semantic-spacing-element)',
            fontSize: 'var(--primitive-font-size-sm)',
            color: 'var(--semantic-text-secondary)',
          }}
          role="status"
          aria-live="polite"
        >
          {users.length} utilisateur{users.length > 1 ? 's' : ''} trouvé{users.length > 1 ? 's' : ''}
        </p>
      )}
    </>
  );
}
