/**
 * Page de création/édition d'utilisateur
 * Responsive et accessible
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { PageHeader } from '../components/page-header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AlertCircle, Save, X } from 'lucide-react';
import { api } from '../services/mock-api';
import type { User, Country, OrganizationalUnit } from '../types';

export function UserFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [orgUnits, setOrgUnits] = useState<OrganizationalUnit[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user' as User['role'],
    countryId: '',
    organizationalUnitId: '',
    status: 'active' as User['status'],
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [countriesData, orgUnitsData] = await Promise.all([
        api.getCountries(),
        api.getOrganizationalUnits(),
      ]);

      setCountries(countriesData);
      setOrgUnits(orgUnitsData);

      if (id) {
        const user = await api.getUserById(id);
        if (user) {
          setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: '', // Ne pas pré-remplir le mot de passe
            role: user.role,
            countryId: user.countryId,
            organizationalUnitId: user.organizationalUnitId,
            status: user.status,
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!isEditing && !formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (!formData.countryId) {
      newErrors.countryId = 'Le pays est requis';
    }

    if (!formData.organizationalUnitId) {
      newErrors.organizationalUnitId = 'L\'unité organisationnelle est requise';
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
      if (isEditing && id) {
        await api.updateUser(id, formData);
      } else {
        await api.createUser(formData);
      }
      navigate('/users');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ submit: 'Une erreur est survenue lors de la sauvegarde' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title={isEditing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
        description={isEditing ? 'Modifier les informations de l\'utilisateur' : 'Créer un nouveau compte utilisateur'}
        breadcrumbs={[
          { label: 'Accueil', href: '/dashboard' },
          { label: 'Utilisateurs', href: '/users' },
          { label: isEditing ? 'Modifier' : 'Nouveau' },
        ]}
      />

      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <form onSubmit={handleSubmit}>
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
              Informations personnelles
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Prénom */}
              <div>
                <Label htmlFor="firstName" required>
                  Prénom
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Jean"
                  required
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  style={{ minHeight: '44px' }}
                />
                {errors.firstName && (
                  <p
                    id="firstName-error"
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
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Nom */}
              <div>
                <Label htmlFor="lastName" required>
                  Nom
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Dupont"
                  required
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  style={{ minHeight: '44px' }}
                />
                {errors.lastName && (
                  <p
                    id="lastName-error"
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
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <Label htmlFor="email" required>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jean.dupont@example.com"
                  required
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  style={{ minHeight: '44px' }}
                />
                {errors.email && (
                  <p
                    id="email-error"
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
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Mot de passe */}
              <div className="sm:col-span-2">
                <Label htmlFor="password" required={!isEditing}>
                  {isEditing ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={isEditing ? 'Laisser vide pour ne pas modifier' : 'Minimum 8 caractères'}
                  required={!isEditing}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  style={{ minHeight: '44px' }}
                />
                {errors.password && (
                  <p
                    id="password-error"
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
                    {errors.password}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Organisation */}
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
              Organisation
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Rôle */}
              <div>
                <Label htmlFor="role" required>
                  Rôle
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as User['role'] })}
                >
                  <SelectTrigger id="role" style={{ minHeight: '44px' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">Utilisateur</SelectItem>
                    <SelectItem value="viewer">Observateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Statut */}
              <div>
                <Label htmlFor="status" required>
                  Statut
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as User['status'] })}
                >
                  <SelectTrigger id="status" style={{ minHeight: '44px' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="suspended">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pays */}
              <div>
                <Label htmlFor="country" required>
                  Pays
                </Label>
                <Select
                  value={formData.countryId}
                  onValueChange={(value) => setFormData({ ...formData, countryId: value })}
                >
                  <SelectTrigger
                    id="country"
                    aria-invalid={!!errors.countryId}
                    style={{ minHeight: '44px' }}
                  >
                    <SelectValue placeholder="Sélectionner un pays" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.countryId && (
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
                    {errors.countryId}
                  </p>
                )}
              </div>

              {/* Unité organisationnelle */}
              <div>
                <Label htmlFor="orgUnit" required>
                  Unité organisationnelle
                </Label>
                <Select
                  value={formData.organizationalUnitId}
                  onValueChange={(value) => setFormData({ ...formData, organizationalUnitId: value })}
                >
                  <SelectTrigger
                    id="orgUnit"
                    aria-invalid={!!errors.organizationalUnitId}
                    style={{ minHeight: '44px' }}
                  >
                    <SelectValue placeholder="Sélectionner une unité" />
                  </SelectTrigger>
                  <SelectContent>
                    {orgUnits.map((orgUnit) => (
                      <SelectItem key={orgUnit.id} value={orgUnit.id}>
                        {orgUnit.path}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.organizationalUnitId && (
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
                    {errors.organizationalUnitId}
                  </p>
                )}
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
              onClick={() => navigate('/users')}
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
