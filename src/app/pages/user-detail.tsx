/**
 * Page de détail d'un utilisateur
 * Avec actions: éditer, suspendre/activer
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { PageHeader } from '../components/page-header';
import { DataTable, type Column } from '../components/data-table';
import { StatusBadge } from '../components/status-badge';
import { PermissionBadge } from '../components/permission-badge';
import { Button } from '../components/ui/button';
import { Edit, Ban, CheckCircle, User as UserIcon } from 'lucide-react';
import { api } from '../services/mock-api';
import type { User, Permission, Application, Country, OrganizationalUnit } from '../types';

export function UserDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [country, setCountry] = useState<Country | null>(null);
  const [orgUnit, setOrgUnit] = useState<OrganizationalUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [suspending, setSuspending] = useState(false);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const [userData, permissionsData, applicationsData] = await Promise.all([
        api.getUserById(id),
        api.getUserPermissions(id),
        api.getApplications(),
      ]);

      if (userData) {
        setUser(userData);

        const [countryData, orgUnitData] = await Promise.all([
          api.getCountryById(userData.countryId),
          api.getOrganizationalUnitById(userData.organizationalUnitId),
        ]);

        setCountry(countryData);
        setOrgUnit(orgUnitData);
      }

      setPermissions(permissionsData);
      setApplications(applicationsData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async () => {
    if (!id || !user) return;

    const action = user.status === 'suspended' ? 'activer' : 'suspendre';
    const confirmed = window.confirm(
      user.status === 'suspended'
        ? `Êtes-vous sûr de vouloir activer cet utilisateur ?\n\nToutes ses permissions seront réactivées.`
        : `Êtes-vous sûr de vouloir suspendre cet utilisateur ?\n\nToutes ses permissions seront désactivées immédiatement.`
    );

    if (!confirmed) return;

    setSuspending(true);
    try {
      const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
      await api.updateUser(id, { status: newStatus });
      
      // Recharger les données
      await loadData();

      alert(
        newStatus === 'suspended'
          ? 'Utilisateur suspendu avec succès. Toutes ses permissions sont désactivées.'
          : 'Utilisateur activé avec succès. Toutes ses permissions sont réactivées.'
      );
    } catch (error) {
      console.error('Erreur lors de la suspension:', error);
      alert('Une erreur est survenue lors de l\'opération');
    } finally {
      setSuspending(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center" style={{ padding: 'var(--semantic-spacing-section)' }}>
        <p style={{ color: 'var(--semantic-text-secondary)' }}>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center" style={{ padding: 'var(--semantic-spacing-section)' }}>
        <p style={{ color: 'var(--semantic-text-secondary)' }}>Utilisateur non trouvé</p>
        <Button onClick={() => navigate('/users')} style={{ marginTop: 'var(--semantic-spacing-element)' }}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrateur',
      manager: 'Manager',
      user: 'Utilisateur',
      viewer: 'Observateur',
    };
    return labels[role] || role;
  };

  const columns: Column<Permission>[] = [
    {
      key: 'application',
      header: 'Application',
      render: (permission) => {
        const app = applications.find((a) => a.id === permission.applicationId);
        return (
          <div>
            <div style={{ fontWeight: 'var(--primitive-font-weight-medium)' }}>{app?.name || '-'}</div>
            {app?.description && (
              <div
                style={{
                  fontSize: 'var(--primitive-font-size-sm)',
                  color: 'var(--semantic-text-secondary)',
                }}
              >
                {app.description}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (permission) => (
        <div className="flex flex-wrap gap-2">
          {permission.actions.map((action) => (
            <PermissionBadge key={action} action={action} />
          ))}
        </div>
      ),
    },
    {
      key: 'expiresAt',
      header: 'Expiration',
      hideOnMobile: true,
      render: (permission) =>
        permission.expiresAt
          ? new Intl.DateTimeFormat('fr-FR').format(new Date(permission.expiresAt))
          : 'Jamais',
    },
  ];

  return (
    <>
      <PageHeader
        title={`${user.firstName} ${user.lastName}`}
        description="Détails et permissions de l'utilisateur"
        breadcrumbs={[
          { label: 'Accueil', href: '/dashboard' },
          { label: 'Utilisateurs', href: '/users' },
          { label: `${user.firstName} ${user.lastName}` },
        ]}
        action={
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            {user.status === 'suspended' ? (
              <Button
                onClick={handleSuspendUser}
                disabled={suspending}
                variant="outline"
                className="w-full sm:w-auto"
                style={{
                  borderColor: 'var(--semantic-color-success)',
                  color: 'var(--semantic-color-success)',
                  minHeight: '44px',
                }}
              >
                <CheckCircle className="w-4 h-4 sm:mr-2" aria-hidden="true" />
                <span>{suspending ? 'Activation...' : 'Activer'}</span>
              </Button>
            ) : (
              <Button
                onClick={handleSuspendUser}
                disabled={suspending}
                variant="outline"
                className="w-full sm:w-auto"
                style={{
                  borderColor: 'var(--semantic-color-danger)',
                  color: 'var(--semantic-color-danger)',
                  minHeight: '44px',
                }}
              >
                <Ban className="w-4 h-4 sm:mr-2" aria-hidden="true" />
                <span>{suspending ? 'Suspension...' : 'Suspendre'}</span>
              </Button>
            )}
            <Button
              onClick={() => navigate(`/users/${id}/edit`)}
              className="w-full sm:w-auto"
              style={{ minHeight: '44px' }}
            >
              <Edit className="w-4 h-4 sm:mr-2" aria-hidden="true" />
              <span>Modifier</span>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* User Info Card */}
        <div
          className="lg:col-span-1"
          style={{
            backgroundColor: 'var(--component-card-bg)',
            border: `var(--primitive-border-width-thin) solid var(--component-card-border)`,
            borderRadius: 'var(--component-card-radius)',
            padding: 'var(--component-card-padding)',
          }}
        >
          <div className="text-center" style={{ marginBottom: 'var(--semantic-spacing-component)' }}>
            <div
              className="inline-flex items-center justify-center mx-auto"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: 'var(--primitive-radius-full)',
                backgroundColor: 'var(--semantic-interactive-primary)',
                color: 'var(--semantic-text-inverse)',
                fontSize: 'var(--primitive-font-size-2xl)',
                fontWeight: 'var(--primitive-font-weight-bold)',
                marginBottom: 'var(--semantic-spacing-element)',
              }}
            >
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <h2 style={{ marginBottom: 'var(--primitive-space-xs)', fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>
              {user.firstName} {user.lastName}
            </h2>
            <p
              style={{
                fontSize: 'var(--primitive-font-size-sm)',
                color: 'var(--semantic-text-secondary)',
                marginBottom: 'var(--semantic-spacing-compact)',
              }}
              className="break-all px-2"
            >
              {user.email}
            </p>
            <StatusBadge status={user.status} />
          </div>

          <div
            style={{
              borderTop: `var(--primitive-border-width-thin) solid var(--semantic-border-default)`,
              paddingTop: 'var(--semantic-spacing-element)',
            }}
          >
            <dl className="space-y-3 sm:space-y-4">
              <div>
                <dt
                  style={{
                    fontSize: 'var(--primitive-font-size-sm)',
                    color: 'var(--semantic-text-secondary)',
                    marginBottom: 'var(--primitive-space-xs)',
                  }}
                >
                  Rôle
                </dt>
                <dd style={{ fontWeight: 'var(--primitive-font-weight-medium)' }}>
                  {getRoleLabel(user.role)}
                </dd>
              </div>

              <div>
                <dt
                  style={{
                    fontSize: 'var(--primitive-font-size-sm)',
                    color: 'var(--semantic-text-secondary)',
                    marginBottom: 'var(--primitive-space-xs)',
                  }}
                >
                  Pays
                </dt>
                <dd style={{ fontWeight: 'var(--primitive-font-weight-medium)' }}>
                  {country?.name || '-'}
                </dd>
              </div>

              <div>
                <dt
                  style={{
                    fontSize: 'var(--primitive-font-size-sm)',
                    color: 'var(--semantic-text-secondary)',
                    marginBottom: 'var(--primitive-space-xs)',
                  }}
                >
                  Unité organisationnelle
                </dt>
                <dd style={{ fontWeight: 'var(--primitive-font-weight-medium)' }} className="break-words">
                  {orgUnit?.path || '-'}
                </dd>
              </div>

              <div>
                <dt
                  style={{
                    fontSize: 'var(--primitive-font-size-sm)',
                    color: 'var(--semantic-text-secondary)',
                    marginBottom: 'var(--primitive-space-xs)',
                  }}
                >
                  Dernière connexion
                </dt>
                <dd style={{ fontWeight: 'var(--primitive-font-weight-medium)' }} className="break-words text-sm">
                  {user.lastLoginAt
                    ? new Intl.DateTimeFormat('fr-FR', {
                        dateStyle: 'long',
                        timeStyle: 'short',
                      }).format(new Date(user.lastLoginAt))
                    : 'Jamais'}
                </dd>
              </div>

              <div>
                <dt
                  style={{
                    fontSize: 'var(--primitive-font-size-sm)',
                    color: 'var(--semantic-text-secondary)',
                    marginBottom: 'var(--primitive-space-xs)',
                  }}
                >
                  Créé le
                </dt>
                <dd style={{ fontWeight: 'var(--primitive-font-weight-medium)' }}>
                  {new Intl.DateTimeFormat('fr-FR').format(new Date(user.createdAt))}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Permissions */}
        <div className="lg:col-span-2">
          <div
            style={{
              backgroundColor: 'var(--component-card-bg)',
              border: `var(--primitive-border-width-thin) solid var(--component-card-border)`,
              borderRadius: 'var(--component-card-radius)',
              padding: 'var(--component-card-padding)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>
                Permissions ({permissions.length})
              </h2>
              <Button
                onClick={() => navigate('/permissions/new')}
                size="sm"
                style={{ minHeight: '40px' }}
              >
                Ajouter
              </Button>
            </div>

            <DataTable
              data={permissions}
              columns={columns}
              keyExtractor={(permission) => permission.id}
              onRowClick={(permission) => navigate(`/permissions/${permission.id}`)}
              emptyMessage="Aucune permission attribuée"
              caption={`Permissions de ${user.firstName} ${user.lastName}`}
            />
          </div>
        </div>
      </div>
    </>
  );
}
