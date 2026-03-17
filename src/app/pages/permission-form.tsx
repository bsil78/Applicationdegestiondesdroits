/**
 * Page de création/édition de permission
 * Responsive et accessible
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { PageHeader } from '../components/page-header';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { AlertCircle, Save, X } from 'lucide-react';
import { api } from '../services/mock-api';
import type { Permission, User, Application, Country, PermissionAction } from '../types';

export function PermissionFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    userId: '',
    applicationId: '',
    actions: [] as PermissionAction[],
    countryIds: [] as string[],
    expiresAt: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, applicationsData, countriesData] = await Promise.all([
        api.getUsers(),
        api.getApplications(),
        api.getCountries(),
      ]);

      setUsers(usersData.filter((u) => u.status === 'active'));
      setApplications(applicationsData.filter((a) => a.status === 'active'));
      setCountries(countriesData);

      if (id) {
        const permission = await api.getPermissionById(id);
        if (permission) {
          setFormData({
            userId: permission.userId,
            applicationId: permission.applicationId,
            actions: permission.actions,
            countryIds: permission.countryIds,
            expiresAt: permission.expiresAt
              ? new Date(permission.expiresAt).toISOString().split('T')[0]
              : '',
            notes: permission.notes || '',
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.userId) {
      newErrors.userId = 'L\'utilisateur est requis';
    }

    if (!formData.applicationId) {
      newErrors.applicationId = 'L\'application est requise';
    }

    if (formData.actions.length === 0) {
      newErrors.actions = 'Au moins une action doit être sélectionnée';
    }

    if (formData.countryIds.length === 0) {
      newErrors.countryIds = 'Au moins un pays doit être sélectionné';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const permissionData = {
        ...formData,
        organizationalUnitIds: [], // Pour l'instant on utilise un tableau vide
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined,
      };

      if (isEditing && id) {
        await api.updatePermission(id, permissionData);
      } else {
        await api.createPermission(permissionData);
      }
      navigate('/permissions');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ submit: 'Une erreur est survenue lors de la sauvegarde' });
    } finally {
      setLoading(false);
    }
  };

  const toggleAction = (action: PermissionAction) => {
    const newActions = formData.actions.includes(action)
      ? formData.actions.filter((a) => a !== action)
      : [...formData.actions, action];
    setFormData({ ...formData, actions: newActions });
  };

  const toggleCountry = (countryId: string) => {
    const newCountries = formData.countryIds.includes(countryId)
      ? formData.countryIds.filter((c) => c !== countryId)
      : [...formData.countryIds, countryId];
    setFormData({ ...formData, countryIds: newCountries });
  };

  const allActions: PermissionAction[] = ['create', 'read', 'update', 'archive'];

  const getActionLabel = (action: PermissionAction): string => {
    const labels: Record<PermissionAction, string> = {
      create: 'Créer',
      read: 'Consulter',
      update: 'Modifier',
      archive: 'Archiver',
    };
    return labels[action];
  };

  return (
    <>
      <PageHeader
        title={isEditing ? 'Modifier la permission' : 'Nouvelle permission'}
        description={
          isEditing
            ? 'Modifier les droits d\'accès de l\'utilisateur'
            : 'Attribuer des droits d\'accès à un utilisateur'
        }
        breadcrumbs={[
          { label: 'Accueil', href: '/dashboard' },
          { label: 'Permissions', href: '/permissions' },
          { label: isEditing ? 'Modifier' : 'Nouvelle' },
        ]}
      />

      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Utilisateur et Application */}
          <div
            style={{
              backgroundColor: 'var(--component-card-bg)',
              border: `var(--primitive-border-width-thin) solid var(--component-card-border)`,
              borderRadius: 'var(--component-card-radius)',
              padding: 'var(--component-card-padding)',
              marginBottom: 'var(--semantic-spacing-component)',
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Utilisateur */}
              <div className="sm:col-span-2">
                <Label htmlFor="user" required>
                  Utilisateur
                </Label>
                <Select
                  value={formData.userId}
                  onValueChange={(value) => setFormData({ ...formData, userId: value })}
                  disabled={isEditing}
                >
                  <SelectTrigger
                    id="user"
                    aria-invalid={!!errors.userId}
                    style={{ minHeight: '44px' }}
                  >
                    <SelectValue placeholder="Sélectionner un utilisateur" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.userId && (
                  <p
                    style={{
                      marginTop: 'var(--primitive-space-xs)',
                      fontSize: 'var(--primitive-font-size-sm)',
                      color: 'var(--semantic-color-danger)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--primitive-space-xs)',
                    }}
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    {errors.userId}
                  </p>
                )}
              </div>

              {/* Application */}
              <div className="sm:col-span-2">
                <Label htmlFor="application" required>
                  Application
                </Label>
                <Select
                  value={formData.applicationId}
                  onValueChange={(value) => setFormData({ ...formData, applicationId: value })}
                  disabled={isEditing}
                >
                  <SelectTrigger
                    id="application"
                    aria-invalid={!!errors.applicationId}
                    style={{ minHeight: '44px' }}
                  >
                    <SelectValue placeholder="Sélectionner une application" />
                  </SelectTrigger>
                  <SelectContent>
                    {applications.map((app) => (
                      <SelectItem key={app.id} value={app.id}>
                        {app.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.applicationId && (
                  <p
                    style={{
                      marginTop: 'var(--primitive-space-xs)',
                      fontSize: 'var(--primitive-font-size-sm)',
                      color: 'var(--semantic-color-danger)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--primitive-space-xs)',
                    }}
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    {errors.applicationId}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              backgroundColor: 'var(--component-card-bg)',
              border: `var(--primitive-border-width-thin) solid var(--component-card-border)`,
              borderRadius: 'var(--component-card-radius)',
              padding: 'var(--component-card-padding)',
              marginBottom: 'var(--semantic-spacing-component)',
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
              Sélectionnez les actions que l'utilisateur pourra effectuer
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {allActions.map((action) => (
                <div
                  key={action}
                  className="flex items-center gap-3"
                  style={{
                    padding: 'var(--primitive-space-md)',
                    backgroundColor: formData.actions.includes(action)
                      ? 'var(--semantic-interactive-primary-subtle)'
                      : 'var(--semantic-surface-raised)',
                    borderRadius: 'var(--primitive-radius-md)',
                    border: `var(--primitive-border-width-thin) solid ${
                      formData.actions.includes(action)
                        ? 'var(--semantic-interactive-primary)'
                        : 'var(--semantic-border-default)'
                    }`,
                    cursor: 'pointer',
                    minHeight: '56px',
                  }}
                  onClick={() => toggleAction(action)}
                  role="checkbox"
                  aria-checked={formData.actions.includes(action)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleAction(action);
                    }
                  }}
                >
                  <Checkbox
                    id={`action-${action}`}
                    checked={formData.actions.includes(action)}
                    onCheckedChange={() => toggleAction(action)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label
                    htmlFor={`action-${action}`}
                    style={{
                      fontSize: 'var(--primitive-font-size-base)',
                      fontWeight: 'var(--primitive-font-weight-medium)',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {getActionLabel(action)}
                  </label>
                </div>
              ))}
            </div>

            {errors.actions && (
              <p
                style={{
                  marginTop: 'var(--semantic-spacing-compact)',
                  fontSize: 'var(--primitive-font-size-sm)',
                  color: 'var(--semantic-color-danger)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--primitive-space-xs)',
                }}
                role="alert"
              >
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                {errors.actions}
              </p>
            )}
          </div>

          {/* Pays */}
          <div
            style={{
              backgroundColor: 'var(--component-card-bg)',
              border: `var(--primitive-border-width-thin) solid var(--component-card-border)`,
              borderRadius: 'var(--component-card-radius)',
              padding: 'var(--component-card-padding)',
              marginBottom: 'var(--semantic-spacing-component)',
            }}
          >
            <h2
              style={{
                marginBottom: 'var(--semantic-spacing-compact)',
                fontSize: 'var(--primitive-font-size-lg)',
              }}
            >
              Périmètre géographique
            </h2>
            <p
              style={{
                fontSize: 'var(--primitive-font-size-sm)',
                color: 'var(--semantic-text-secondary)',
                marginBottom: 'var(--semantic-spacing-element)',
              }}
            >
              Sélectionnez les pays sur lesquels la permission s'applique
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {countries.map((country) => (
                <div
                  key={country.id}
                  className="flex items-center gap-2"
                  style={{
                    padding: 'var(--primitive-space-sm) var(--primitive-space-md)',
                    backgroundColor: formData.countryIds.includes(country.id)
                      ? 'var(--semantic-interactive-primary-subtle)'
                      : 'var(--semantic-surface-raised)',
                    borderRadius: 'var(--primitive-radius-md)',
                    border: `var(--primitive-border-width-thin) solid ${
                      formData.countryIds.includes(country.id)
                        ? 'var(--semantic-interactive-primary)'
                        : 'var(--semantic-border-default)'
                    }`,
                    cursor: 'pointer',
                    minHeight: '48px',
                  }}
                  onClick={() => toggleCountry(country.id)}
                  role="checkbox"
                  aria-checked={formData.countryIds.includes(country.id)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleCountry(country.id);
                    }
                  }}
                >
                  <Checkbox
                    id={`country-${country.id}`}
                    checked={formData.countryIds.includes(country.id)}
                    onCheckedChange={() => toggleCountry(country.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label
                    htmlFor={`country-${country.id}`}
                    style={{
                      fontSize: 'var(--primitive-font-size-sm)',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {country.name}
                  </label>
                </div>
              ))}
            </div>

            {errors.countryIds && (
              <p
                style={{
                  marginTop: 'var(--semantic-spacing-compact)',
                  fontSize: 'var(--primitive-font-size-sm)',
                  color: 'var(--semantic-color-danger)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--primitive-space-xs)',
                }}
                role="alert"
              >
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                {errors.countryIds}
              </p>
            )}
          </div>

          {/* Options additionnelles */}
          <div
            style={{
              backgroundColor: 'var(--component-card-bg)',
              border: `var(--primitive-border-width-thin) solid var(--component-card-border)`,
              borderRadius: 'var(--component-card-radius)',
              padding: 'var(--component-card-padding)',
              marginBottom: 'var(--semantic-spacing-component)',
            }}
          >
            <h2
              style={{
                marginBottom: 'var(--semantic-spacing-component)',
                fontSize: 'var(--primitive-font-size-lg)',
              }}
            >
              Options additionnelles
            </h2>

            <div className="space-y-4">
              {/* Date d'expiration */}
              <div>
                <Label htmlFor="expiresAt">Date d'expiration (optionnelle)</Label>
                <input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: 'var(--component-input-padding-y) var(--component-input-padding-x)',
                    borderRadius: 'var(--component-input-radius)',
                    border: `var(--component-input-border-width) solid var(--component-input-border-color)`,
                    backgroundColor: 'var(--component-input-bg)',
                    fontSize: 'var(--primitive-font-size-base)',
                    minHeight: '44px',
                  }}
                />
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notes (optionnelles)</Label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ajoutez des notes ou commentaires..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: 'var(--component-input-padding-y) var(--component-input-padding-x)',
                    borderRadius: 'var(--component-input-radius)',
                    border: `var(--component-input-border-width) solid var(--component-input-border-color)`,
                    backgroundColor: 'var(--component-input-bg)',
                    fontSize: 'var(--primitive-font-size-base)',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Erreur globale */}
          {errors.submit && (
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
                }}
              >
                <AlertCircle className="w-5 h-5" aria-hidden="true" />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/permissions')}
              className="w-full sm:w-auto"
              style={{ minHeight: '44px' }}
            >
              <X className="w-4 h-4 sm:mr-2" aria-hidden="true" />
              <span>Annuler</span>
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
              style={{ minHeight: '44px' }}
            >
              <Save className="w-4 h-4 sm:mr-2" aria-hidden="true" />
              <span>{loading ? 'Enregistrement...' : isEditing ? 'Enregistrer' : 'Créer'}</span>
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}