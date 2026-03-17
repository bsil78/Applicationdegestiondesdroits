/**
 * Page de profil utilisateur
 */

import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/page-header';
import { PermissionBadge } from '../components/permission-badge';
import { StatusBadge } from '../components/status-badge';
import { useAuth } from '../contexts/auth-context';
import { api } from '../services/mock-api';
import type { Permission, Application, Country, OrganizationalUnit } from '../types';

export function ProfilePage() {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [country, setCountry] = useState<Country | null>(null);
  const [orgUnit, setOrgUnit] = useState<OrganizationalUnit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [permissionsData, applicationsData, countryData, orgUnitData] = await Promise.all([
        api.getUserPermissions(user.id),
        api.getApplications(),
        api.getCountryById(user.countryId),
        api.getOrganizationalUnitById(user.organizationalUnitId),
      ]);

      setPermissions(permissionsData);
      setApplications(applicationsData);
      setCountry(countryData);
      setOrgUnit(orgUnitData);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Chargement...</div>;
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

  return (
    <>
      <PageHeader
        title="Mon profil"
        description="Informations personnelles et permissions"
        breadcrumbs={[{ label: 'Accueil', href: '/dashboard' }, { label: 'Profil' }]}
      />

      {loading ? (
        <div className="text-center" style={{ padding: 'var(--semantic-spacing-section)' }}>
          <p style={{ color: 'var(--semantic-text-secondary)' }}>Chargement du profil...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info */}
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
              <h2 style={{ marginBottom: 'var(--primitive-space-xs)' }}>
                {user.firstName} {user.lastName}
              </h2>
              <p
                style={{
                  fontSize: 'var(--primitive-font-size-sm)',
                  color: 'var(--semantic-text-secondary)',
                  marginBottom: 'var(--semantic-spacing-compact)',
                }}
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
              <dl>
                <div style={{ marginBottom: 'var(--semantic-spacing-compact)' }}>
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

                <div style={{ marginBottom: 'var(--semantic-spacing-compact)' }}>
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

                <div style={{ marginBottom: 'var(--semantic-spacing-compact)' }}>
                  <dt
                    style={{
                      fontSize: 'var(--primitive-font-size-sm)',
                      color: 'var(--semantic-text-secondary)',
                      marginBottom: 'var(--primitive-space-xs)',
                    }}
                  >
                    Unité organisationnelle
                  </dt>
                  <dd style={{ fontWeight: 'var(--primitive-font-weight-medium)' }}>
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
                  <dd style={{ fontWeight: 'var(--primitive-font-weight-medium)' }}>
                    {user.lastLoginAt
                      ? new Intl.DateTimeFormat('fr-FR', {
                          dateStyle: 'long',
                          timeStyle: 'short',
                        }).format(new Date(user.lastLoginAt))
                      : 'Jamais'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Permissions */}
          <div
            className="lg:col-span-2"
            style={{
              backgroundColor: 'var(--component-card-bg)',
              border: `var(--primitive-border-width-thin) solid var(--component-card-border)`,
              borderRadius: 'var(--component-card-radius)',
              padding: 'var(--component-card-padding)',
            }}
          >
            <h2 style={{ marginBottom: 'var(--semantic-spacing-component)' }}>
              Mes permissions ({permissions.length})
            </h2>

            {permissions.length === 0 ? (
              <p style={{ color: 'var(--semantic-text-secondary)' }}>
                Aucune permission n'est actuellement attribuée à votre compte.
              </p>
            ) : (
              <div className="space-y-4">
                {permissions.map((permission) => {
                  const app = applications.find((a) => a.id === permission.applicationId);
                  return (
                    <div
                      key={permission.id}
                      style={{
                        padding: 'var(--semantic-spacing-element)',
                        backgroundColor: 'var(--semantic-surface-raised)',
                        borderRadius: 'var(--primitive-radius-md)',
                        border: `var(--primitive-border-width-thin) solid var(--semantic-border-subtle)`,
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3
                            style={{
                              marginBottom: 'var(--primitive-space-xs)',
                              fontSize: 'var(--primitive-font-size-base)',
                            }}
                          >
                            {app?.name || 'Application inconnue'}
                          </h3>
                          {app?.description && (
                            <p
                              style={{
                                fontSize: 'var(--primitive-font-size-sm)',
                                color: 'var(--semantic-text-secondary)',
                              }}
                            >
                              {app.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <p
                          style={{
                            fontSize: 'var(--primitive-font-size-sm)',
                            color: 'var(--semantic-text-secondary)',
                            marginBottom: 'var(--primitive-space-sm)',
                          }}
                        >
                          Actions autorisées:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {permission.actions.map((action) => (
                            <PermissionBadge key={action} action={action} />
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        {permission.expiresAt && (
                          <p>
                            Expire le:{' '}
                            {new Intl.DateTimeFormat('fr-FR').format(new Date(permission.expiresAt))}
                          </p>
                        )}
                        {permission.notes && <p className="mt-1">Note: {permission.notes}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
