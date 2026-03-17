/**
 * Page tableau de bord avec statistiques
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { PageHeader } from '../components/page-header';
import { Users, Shield, Globe, Building2, TrendingUp } from 'lucide-react';
import { api } from '../services/mock-api';
import type { User, Permission, Country, OrganizationalUnit } from '../types';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  href?: string;
}

function StatCard({ title, value, icon: Icon, color, href }: StatCardProps) {
  const content = (
    <div
      style={{
        backgroundColor: 'var(--component-card-bg)',
        border: `var(--primitive-border-width-thin) solid var(--component-card-border)`,
        borderRadius: 'var(--component-card-radius)',
        padding: 'var(--component-card-padding)',
        boxShadow: 'var(--component-card-shadow)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          style={{
            fontSize: 'var(--primitive-font-size-sm)',
            color: 'var(--semantic-text-secondary)',
            fontWeight: 'var(--primitive-font-weight-medium)',
          }}
        >
          {title}
        </h3>
        <div
          className="flex items-center justify-center"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--primitive-radius-lg)',
            backgroundColor: color,
            opacity: 0.1,
          }}
        >
          <Icon
            className="w-5 h-5"
            style={{ color: color, opacity: 1 }}
            aria-hidden="true"
          />
        </div>
      </div>
      <p
        style={{
          fontSize: 'var(--primitive-font-size-3xl)',
          fontWeight: 'var(--primitive-font-weight-bold)',
          color: 'var(--semantic-text-primary)',
        }}
      >
        {value.toLocaleString('fr-FR')}
      </p>
    </div>
  );

  if (href) {
    return (
      <Link to={href} style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    );
  }

  return content;
}

export function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [orgUnits, setOrgUnits] = useState<OrganizationalUnit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, permissionsData, countriesData, orgUnitsData] = await Promise.all([
          api.getUsers(),
          api.getPermissions(),
          api.getCountries(),
          api.getOrganizationalUnits(),
        ]);

        setUsers(usersData);
        setPermissions(permissionsData);
        setCountries(countriesData);
        setOrgUnits(orgUnitsData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const activeUsers = users.filter((u) => u.status === 'active').length;
  const totalPermissions = permissions.length;
  const totalCountries = countries.length;
  const totalOrgUnits = orgUnits.length;

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de la gestion des droits et permissions"
        breadcrumbs={[{ label: 'Accueil' }, { label: 'Tableau de bord' }]}
      />

      {loading ? (
        <div className="text-center" style={{ padding: 'var(--semantic-spacing-section)' }}>
          <p style={{ color: 'var(--semantic-text-secondary)' }}>Chargement des données...</p>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            style={{ marginBottom: 'var(--semantic-spacing-section)' }}
          >
            <StatCard
              title="Utilisateurs actifs"
              value={activeUsers}
              icon={Users}
              color="var(--semantic-interactive-primary)"
              href="/users"
            />
            <StatCard
              title="Total permissions"
              value={totalPermissions}
              icon={Shield}
              color="var(--semantic-color-success)"
              href="/permissions"
            />
            <StatCard
              title="Pays"
              value={totalCountries}
              icon={Globe}
              color="var(--semantic-color-warning)"
            />
            <StatCard
              title="Unités organisationnelles"
              value={totalOrgUnits}
              icon={Building2}
              color="var(--semantic-color-info)"
            />
          </div>

          {/* Recent Users */}
          <div
            style={{
              backgroundColor: 'var(--component-card-bg)',
              border: `var(--primitive-border-width-thin) solid var(--component-card-border)`,
              borderRadius: 'var(--component-card-radius)',
              padding: 'var(--component-card-padding)',
              marginBottom: 'var(--semantic-spacing-component)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2>Utilisateurs récents</h2>
              <Link
                to="/users"
                style={{
                  color: 'var(--semantic-interactive-primary)',
                  fontSize: 'var(--primitive-font-size-sm)',
                  textDecoration: 'none',
                }}
                className="hover:underline"
              >
                Voir tous →
              </Link>
            </div>

            <div className="space-y-4">
              {users.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4"
                  style={{
                    padding: 'var(--primitive-space-md)',
                    borderRadius: 'var(--primitive-radius-md)',
                    backgroundColor: 'var(--semantic-surface-raised)',
                  }}
                >
                  <div
                    className="flex items-center justify-center"
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
                  <div className="flex-1">
                    <p
                      style={{
                        fontWeight: 'var(--primitive-font-weight-medium)',
                        color: 'var(--semantic-text-primary)',
                      }}
                    >
                      {user.firstName} {user.lastName}
                    </p>
                    <p
                      style={{
                        fontSize: 'var(--primitive-font-size-sm)',
                        color: 'var(--semantic-text-secondary)',
                      }}
                    >
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: 'var(--primitive-font-size-xs)',
                        color: 'var(--semantic-text-tertiary)',
                        textTransform: 'capitalize',
                      }}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div
            style={{
              backgroundColor: 'var(--component-card-bg)',
              border: `var(--primitive-border-width-thin) solid var(--component-card-border)`,
              borderRadius: 'var(--component-card-radius)',
              padding: 'var(--component-card-padding)',
            }}
          >
            <h2 style={{ marginBottom: 'var(--semantic-spacing-element)' }}>Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/users?action=create"
                className="flex items-center gap-3 p-4 rounded-lg border transition-colors hover:bg-gray-50"
                style={{
                  textDecoration: 'none',
                  borderColor: 'var(--semantic-border-default)',
                  borderRadius: 'var(--primitive-radius-md)',
                }}
              >
                <Users
                  className="w-5 h-5"
                  style={{ color: 'var(--semantic-interactive-primary)' }}
                  aria-hidden="true"
                />
                <div>
                  <p
                    style={{
                      fontWeight: 'var(--primitive-font-weight-medium)',
                      color: 'var(--semantic-text-primary)',
                    }}
                  >
                    Nouvel utilisateur
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--primitive-font-size-sm)',
                      color: 'var(--semantic-text-secondary)',
                    }}
                  >
                    Créer un compte
                  </p>
                </div>
              </Link>

              <Link
                to="/permissions?action=create"
                className="flex items-center gap-3 p-4 rounded-lg border transition-colors hover:bg-gray-50"
                style={{
                  textDecoration: 'none',
                  borderColor: 'var(--semantic-border-default)',
                  borderRadius: 'var(--primitive-radius-md)',
                }}
              >
                <Shield
                  className="w-5 h-5"
                  style={{ color: 'var(--semantic-color-success)' }}
                  aria-hidden="true"
                />
                <div>
                  <p
                    style={{
                      fontWeight: 'var(--primitive-font-weight-medium)',
                      color: 'var(--semantic-text-primary)',
                    }}
                  >
                    Nouvelle permission
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--primitive-font-size-sm)',
                      color: 'var(--semantic-text-secondary)',
                    }}
                  >
                    Attribuer des droits
                  </p>
                </div>
              </Link>

              <Link
                to="/audit"
                className="flex items-center gap-3 p-4 rounded-lg border transition-colors hover:bg-gray-50"
                style={{
                  textDecoration: 'none',
                  borderColor: 'var(--semantic-border-default)',
                  borderRadius: 'var(--primitive-radius-md)',
                }}
              >
                <TrendingUp
                  className="w-5 h-5"
                  style={{ color: 'var(--semantic-color-info)' }}
                  aria-hidden="true"
                />
                <div>
                  <p
                    style={{
                      fontWeight: 'var(--primitive-font-weight-medium)',
                      color: 'var(--semantic-text-primary)',
                    }}
                  >
                    Consulter l'audit
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--primitive-font-size-sm)',
                      color: 'var(--semantic-text-secondary)',
                    }}
                  >
                    Historique des actions
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
