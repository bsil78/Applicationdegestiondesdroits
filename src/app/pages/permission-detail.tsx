/**
 * Page de détail d'une permission
 * Avec actions: éditer, bloquer une action, archiver
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { PageHeader } from '../components/page-header';
import { PermissionBadge } from '../components/permission-badge';
import { Button } from '../components/ui/button';
import { Edit, Archive, Ban, Shield, AlertCircle } from 'lucide-react';
import { api } from '../services/mock-api';
import type { Permission, User, Application, Country, PermissionAction } from '../types';

export function PermissionDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [permission, setPermission] = useState<Permission | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const permissionData = await api.getPermissionById(id);

      if (permissionData) {
        setPermission(permissionData);

        const [userData, applicationData, allCountries] = await Promise.all([
          api.getUserById(permissionData.userId),
          api.getApplicationById(permissionData.applicationId),
          api.getCountries(),
        ]);

        setUser(userData);
        setApplication(applicationData);
        setCountries(allCountries);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockAction = async (action: PermissionAction) => {
    if (!id || !permission) return;

    const actionLabel = {
      create: 'Créer',
      read: 'Consulter',
      update: 'Modifier',
      archive: 'Archiver',
    }[action];

    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir bloquer l'action "${actionLabel}" ?\n\nCette action sera retirée de la permission.`
    );

    if (!confirmed) return;

    setProcessing(true);
    try {
      const newActions = permission.actions.filter((a) => a !== action);
      
      if (newActions.length === 0) {
        alert('Impossible de bloquer la dernière action. Archivez plutôt la permission entière.');
        setProcessing(false);
        return;
      }

      await api.updatePermission(id, { actions: newActions });
      await loadData();
      alert(`Action "${actionLabel}" bloquée avec succès`);
    } catch (error) {
      console.error('Erreur lors du blocage:', error);
      alert('Une erreur est survenue lors du blocage de l\'action');
    } finally {
      setProcessing(false);
    }
  };

  const handleArchive = async () => {
    if (!id || !permission) return;

    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir archiver cette permission ?\n\nL'utilisateur perdra tous les droits associés à cette permission.`
    );

    if (!confirmed) return;

    setProcessing(true);
    try {
      await api.deletePermission(id);
      alert('Permission archivée avec succès');
      navigate('/permissions');
    } catch (error) {
      console.error('Erreur lors de l\'archivage:', error);
      alert('Une erreur est survenue lors de l\'archivage');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center" style={{ padding: 'var(--semantic-spacing-section)' }}>
        <p style={{ color: 'var(--semantic-text-secondary)' }}>Chargement...</p>
      </div>
    );
  }

  if (!permission) {
    return (
      <div className="text-center" style={{ padding: 'var(--semantic-spacing-section)' }}>
        <p style={{ color: 'var(--semantic-text-secondary)' }}>Permission non trouvée</p>
        <Button onClick={() => navigate('/permissions')} style={{ marginTop: 'var(--semantic-spacing-element)' }}>
          Retour à la liste
        </Button>
      </div>
    );
  }

  const isExpired = permission.expiresAt && new Date(permission.expiresAt) < new Date();
  const selectedCountries = countries.filter((c) => permission.countryIds.includes(c.id));

  return (
    <>
      <PageHeader
        title="Détail de la permission"
        description="Gérer les droits d'accès de l'utilisateur"
        breadcrumbs={[
          { label: 'Accueil', href: '/dashboard' },
          { label: 'Permissions', href: '/permissions' },
          { label: 'Détail' },
        ]}
        action={
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              onClick={handleArchive}
              disabled={processing}
              variant="outline"
              className="w-full sm:w-auto"
              style={{
                borderColor: 'var(--semantic-color-danger)',
                color: 'var(--semantic-color-danger)',
                minHeight: '44px',
              }}
            >
              <Archive className="w-4 h-4 sm:mr-2" aria-hidden="true" />
              <span>{processing ? 'Archivage...' : 'Archiver'}</span>
            </Button>
            <Button
              onClick={() => navigate(`/permissions/${id}/edit`)}
              className="w-full sm:w-auto"
              style={{ minHeight: '44px' }}
            >
              <Edit className="w-4 h-4 sm:mr-2" aria-hidden="true" />
              <span>Modifier</span>
            </Button>
          </div>
        }
      />

      {/* Warning si expirée */}
      {isExpired && (
        <div
          style={{
            padding: 'var(--semantic-spacing-element)',
            backgroundColor: 'var(--semantic-color-danger-bg)',
            border: `var(--primitive-border-width-thin) solid var(--semantic-color-danger)`,
            borderRadius: 'var(--primitive-radius-md)',
            marginBottom: 'var(--semantic-spacing-component)',
          }}
          role="alert"
        >
          <p
            style={{
              color: 'var(--semantic-color-danger)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--primitive-space-sm)',
              fontWeight: 'var(--primitive-font-weight-medium)',
            }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            Cette permission a expiré le{' '}
            {new Intl.DateTimeFormat('fr-FR').format(new Date(permission.expiresAt!))}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Utilisateur et Application */}
          <div
            style={{
              backgroundColor: 'var(--component-card-bg)',
              border: `var(--primitive-border-width-thin) solid var(--component-card-border)`,
              borderRadius: 'var(--component-card-radius)',
              padding: 'var(--component-card-padding)',
            }}
          >
            <h2
              style={{
                marginBottom: 'var(--semantic-spacing-component)',
                fontSize: 'var(--primitive-font-size-lg)',
              }}
            >
              Informations de base
            </h2>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt
                  style={{
                    fontSize: 'var(--primitive-font-size-sm)',
                    color: 'var(--semantic-text-secondary)',
                    marginBottom: 'var(--primitive-space-sm)',
                  }}
                >
                  Utilisateur
                </dt>
                <dd>
                  {user && (
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center flex-shrink-0"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--primitive-radius-full)',
                          backgroundColor: 'var(--semantic-interactive-primary)',
                          color: 'var(--semantic-text-inverse)',
                          fontSize: 'var(--primitive-font-size-sm)',
                          fontWeight: 'var(--primitive-font-weight-semibold)',
                        }}
                      >
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 'var(--primitive-font-weight-medium)' }}>
                          {user.firstName} {user.lastName}
                        </div>
                        <div
                          style={{
                            fontSize: 'var(--primitive-font-size-sm)',
                            color: 'var(--semantic-text-secondary)',
                          }}
                          className="break-all"
                        >
                          {user.email}
                        </div>
                      </div>
                    </div>
                  )}
                </dd>
              </div>

              <div>
                <dt
                  style={{
                    fontSize: 'var(--primitive-font-size-sm)',
                    color: 'var(--semantic-text-secondary)',
                    marginBottom: 'var(--primitive-space-sm)',
                  }}
                >
                  Application
                </dt>
                <dd>
                  {application && (
                    <div>
                      <div style={{ fontWeight: 'var(--primitive-font-weight-medium)' }}>
                        {application.name}
                      </div>
                      {application.description && (
                        <div
                          style={{
                            fontSize: 'var(--primitive-font-size-sm)',
                            color: 'var(--semantic-text-secondary)',
                          }}
                        >
                          {application.description}
                        </div>
                      )}
                    </div>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Actions */}
          <div
            style={{
              backgroundColor: 'var(--component-card-bg)',
              border: `var(--primitive-border-width-thin) solid var(--component-card-border)`,
              borderRadius: 'var(--component-card-radius)',
              padding: 'var(--component-card-padding)',
            }}
          >
            <h2
              style={{
                marginBottom: 'var(--semantic-spacing-compact)',
                fontSize: 'var(--primitive-font-size-lg)',
              }}
            >
              Actions autorisées
            </h2>
            <p
              style={{
                fontSize: 'var(--primitive-font-size-sm)',
                color: 'var(--semantic-text-secondary)',
                marginBottom: 'var(--semantic-spacing-element)',
              }}
            >
              Cliquez sur une action pour la bloquer
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {permission.actions.map((action) => (
                <div
                  key={action}
                  className="flex items-center justify-between gap-3"
                  style={{
                    padding: 'var(--primitive-space-md)',
                    backgroundColor: 'var(--semantic-surface-raised)',
                    borderRadius: 'var(--primitive-radius-md)',
                    border: `var(--primitive-border-width-thin) solid var(--semantic-border-default)`,
                  }}
                >
                  <PermissionBadge action={action} />
                  <Button
                    onClick={() => handleBlockAction(action)}
                    disabled={processing || permission.actions.length === 1}
                    size="sm"
                    variant="ghost"
                    style={{
                      color: 'var(--semantic-color-danger)',
                      minHeight: '36px',
                      minWidth: '36px',
                      padding: 'var(--primitive-space-xs)',
                    }}
                    title={
                      permission.actions.length === 1
                        ? 'Impossible de bloquer la dernière action'
                        : 'Bloquer cette action'
                    }
                  >
                    <Ban className="w-4 h-4" aria-hidden="true" />
                    <span className="sr-only">Bloquer cette action</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Pays */}
          <div
            style={{
              backgroundColor: 'var(--component-card-bg)',
              border: `var(--primitive-border-width-thin) solid var(--component-card-border)`,
              borderRadius: 'var(--component-card-radius)',
              padding: 'var(--component-card-padding)',
            }}
          >
            <h2
              style={{
                marginBottom: 'var(--semantic-spacing-element)',
                fontSize: 'var(--primitive-font-size-lg)',
              }}
            >
              Périmètre géographique
            </h2>

            <div className="flex flex-wrap gap-2">
              {selectedCountries.map((country) => (
                <span
                  key={country.id}
                  style={{
                    padding: 'var(--primitive-space-xs) var(--primitive-space-md)',
                    backgroundColor: 'var(--semantic-interactive-primary-subtle)',
                    borderRadius: 'var(--primitive-radius-full)',
                    fontSize: 'var(--primitive-font-size-sm)',
                    fontWeight: 'var(--primitive-font-weight-medium)',
                    color: 'var(--semantic-interactive-primary)',
                  }}
                >
                  {country.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Métadonnées */}
        <div className="lg:col-span-1">
          <div
            style={{
              backgroundColor: 'var(--component-card-bg)',
              border: `var(--primitive-border-width-thin) solid var(--component-card-border)`,
              borderRadius: 'var(--component-card-radius)',
              padding: 'var(--component-card-padding)',
            }}
          >
            <h2
              style={{
                marginBottom: 'var(--semantic-spacing-component)',
                fontSize: 'var(--primitive-font-size-lg)',
              }}
            >
              Informations complémentaires
            </h2>

            <dl className="space-y-4">
              <div>
                <dt
                  style={{
                    fontSize: 'var(--primitive-font-size-sm)',
                    color: 'var(--semantic-text-secondary)',
                    marginBottom: 'var(--primitive-space-xs)',
                  }}
                >
                  Date de création
                </dt>
                <dd style={{ fontWeight: 'var(--primitive-font-weight-medium)' }}>
                  {new Intl.DateTimeFormat('fr-FR', {
                    dateStyle: 'long',
                  }).format(new Date(permission.grantedAt))}
                </dd>
              </div>

              {permission.expiresAt && (
                <div>
                  <dt
                    style={{
                      fontSize: 'var(--primitive-font-size-sm)',
                      color: 'var(--semantic-text-secondary)',
                      marginBottom: 'var(--primitive-space-xs)',
                    }}
                  >
                    Date d'expiration
                  </dt>
                  <dd
                    style={{
                      fontWeight: 'var(--primitive-font-weight-medium)',
                      color: isExpired ? 'var(--semantic-color-danger)' : 'inherit',
                    }}
                  >
                    {new Intl.DateTimeFormat('fr-FR', {
                      dateStyle: 'long',
                    }).format(new Date(permission.expiresAt))}
                    {isExpired && (
                      <span
                        style={{
                          display: 'block',
                          fontSize: 'var(--primitive-font-size-xs)',
                          marginTop: 'var(--primitive-space-xs)',
                        }}
                      >
                        (Expirée)
                      </span>
                    )}
                  </dd>
                </div>
              )}

              {permission.notes && (
                <div>
                  <dt
                    style={{
                      fontSize: 'var(--primitive-font-size-sm)',
                      color: 'var(--semantic-text-secondary)',
                      marginBottom: 'var(--primitive-space-xs)',
                    }}
                  >
                    Notes
                  </dt>
                  <dd
                    style={{
                      fontSize: 'var(--primitive-font-size-sm)',
                      padding: 'var(--primitive-space-sm)',
                      backgroundColor: 'var(--semantic-surface-raised)',
                      borderRadius: 'var(--primitive-radius-md)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {permission.notes}
                  </dd>
                </div>
              )}

              <div>
                <dt
                  style={{
                    fontSize: 'var(--primitive-font-size-sm)',
                    color: 'var(--semantic-text-secondary)',
                    marginBottom: 'var(--primitive-space-xs)',
                  }}
                >
                  ID
                </dt>
                <dd
                  style={{
                    fontSize: 'var(--primitive-font-size-xs)',
                    fontFamily: 'monospace',
                    color: 'var(--semantic-text-tertiary)',
                  }}
                  className="break-all"
                >
                  {permission.id}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}