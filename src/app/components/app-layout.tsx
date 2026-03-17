/**
 * Layout principal de l'application avec sidebar de navigation
 * Utilise les tokens de composant sidebar
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Users,
  Shield,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';
import { useAuth } from '../contexts/auth-context';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navItems: NavItem[] = [
  {
    path: '/dashboard',
    label: 'Tableau de bord',
    icon: LayoutDashboard,
    description: 'Vue d\'ensemble des droits et permissions',
  },
  {
    path: '/users',
    label: 'Utilisateurs',
    icon: Users,
    description: 'Gestion des utilisateurs',
  },
  {
    path: '/permissions',
    label: 'Permissions',
    icon: Shield,
    description: 'Gestion des droits d\'accès',
  },
  {
    path: '/audit',
    label: 'Audit',
    icon: FileText,
    description: 'Historique des actions',
  },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--semantic-surface-raised)' }}>
      {/* Sidebar */}
      <aside
        className={`flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'}`}
        style={{
          backgroundColor: 'var(--component-sidebar-bg)',
          borderRight: `var(--primitive-border-width-thin) solid var(--component-sidebar-border)`,
          overflow: 'hidden',
        }}
        aria-label="Navigation principale"
      >
        <div
          className="flex items-center justify-between"
          style={{
            padding: 'var(--semantic-spacing-component)',
            borderBottom: `var(--primitive-border-width-thin) solid var(--component-sidebar-border)`,
          }}
        >
          <h2
            style={{
              fontSize: 'var(--primitive-font-size-lg)',
              fontWeight: 'var(--primitive-font-weight-semibold)',
              color: 'var(--semantic-text-primary)',
            }}
          >
            Compliance Hub
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            style={{
              padding: 'var(--primitive-space-xs)',
              borderRadius: 'var(--primitive-radius-sm)',
            }}
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav
          className="flex-1 overflow-y-auto"
          style={{ padding: 'var(--semantic-spacing-compact)' }}
          aria-label="Menu principal"
        >
          <ul role="list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 transition-colors duration-200"
                    style={{
                      padding: 'var(--primitive-space-sm) var(--primitive-space-md)',
                      marginBottom: 'var(--primitive-space-xs)',
                      borderRadius: 'var(--primitive-radius-md)',
                      backgroundColor: isActive
                        ? 'var(--component-sidebar-item-active-bg)'
                        : 'transparent',
                      color: isActive
                        ? 'var(--component-sidebar-item-active-text)'
                        : 'var(--semantic-text-primary)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'var(--component-sidebar-item-hover-bg)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={item.description}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                    <span style={{ fontWeight: 'var(--primitive-font-weight-medium)' }}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div
          style={{
            borderTop: `var(--primitive-border-width-thin) solid var(--component-sidebar-border)`,
            padding: 'var(--semantic-spacing-component)',
          }}
        >
          {user && (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-3 mb-2 transition-colors"
                style={{
                  padding: 'var(--primitive-space-sm) var(--primitive-space-md)',
                  borderRadius: 'var(--primitive-radius-md)',
                  color: 'var(--semantic-text-primary)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--component-sidebar-item-hover-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                aria-label="Profil utilisateur"
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--primitive-radius-full)',
                    backgroundColor: 'var(--semantic-interactive-primary)',
                    color: 'var(--semantic-text-inverse)',
                  }}
                >
                  <User className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    style={{
                      fontSize: 'var(--primitive-font-size-sm)',
                      fontWeight: 'var(--primitive-font-weight-medium)',
                    }}
                    className="truncate"
                  >
                    {user.firstName} {user.lastName}
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--primitive-font-size-xs)',
                      color: 'var(--semantic-text-secondary)',
                    }}
                    className="truncate"
                  >
                    {user.email}
                  </div>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full transition-colors"
                style={{
                  padding: 'var(--primitive-space-sm) var(--primitive-space-md)',
                  borderRadius: 'var(--primitive-radius-md)',
                  color: 'var(--semantic-color-danger)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--semantic-color-danger-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                aria-label="Se déconnecter"
              >
                <LogOut className="w-5 h-5" aria-hidden="true" />
                <span style={{ fontWeight: 'var(--primitive-font-weight-medium)' }}>
                  Déconnexion
                </span>
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center"
          style={{
            padding: 'var(--semantic-spacing-component)',
            borderBottom: `var(--primitive-border-width-thin) solid var(--semantic-border-default)`,
            backgroundColor: 'var(--semantic-surface-base)',
          }}
        >
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                padding: 'var(--primitive-space-sm)',
                borderRadius: 'var(--primitive-radius-md)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                marginRight: 'var(--primitive-space-md)',
              }}
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          <h1 className="sr-only">Application de gestion des droits utilisateurs</h1>
        </header>

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{
            padding: 'var(--semantic-spacing-section)',
            backgroundColor: 'var(--semantic-surface-raised)',
          }}
          role="main"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
