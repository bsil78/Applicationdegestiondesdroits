/**
 * Layout principal de l'application avec sidebar de navigation
 * Responsive : sidebar mobile avec overlay sur petits écrans
 */

import React, { useState, useEffect } from 'react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Détection mobile et gestion du resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fermer la sidebar mobile lors du changement de route
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--semantic-surface-raised)' }}>
      {/* Overlay pour mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: 'var(--component-modal-overlay-bg)' }}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`flex flex-col fixed lg:relative inset-y-0 left-0 z-50 transition-transform duration-300 ${
          isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : ''
        }`}
        style={{
          width: '280px',
          backgroundColor: 'var(--component-sidebar-bg)',
          borderRight: `var(--primitive-border-width-thin) solid var(--component-sidebar-border)`,
        }}
        aria-label="Navigation principale"
      >
        <div
          className="flex items-center justify-between"
          style={{
            padding: 'var(--semantic-spacing-element)',
            borderBottom: `var(--primitive-border-width-thin) solid var(--component-sidebar-border)`,
            minHeight: '60px',
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
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                padding: 'var(--primitive-space-xs)',
                borderRadius: 'var(--primitive-radius-sm)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Fermer le menu"
            >
              <X className="w-6 h-6" />
            </button>
          )}
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
                      padding: 'var(--primitive-space-md)',
                      marginBottom: 'var(--primitive-space-xs)',
                      borderRadius: 'var(--primitive-radius-md)',
                      backgroundColor: isActive
                        ? 'var(--component-sidebar-item-active-bg)'
                        : 'transparent',
                      color: isActive
                        ? 'var(--component-sidebar-item-active-text)'
                        : 'var(--semantic-text-primary)',
                      textDecoration: 'none',
                      minHeight: '48px', // Touch target size
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
            padding: 'var(--semantic-spacing-element)',
          }}
        >
          {user && (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-3 mb-2 transition-colors"
                style={{
                  padding: 'var(--primitive-space-md)',
                  borderRadius: 'var(--primitive-radius-md)',
                  color: 'var(--semantic-text-primary)',
                  textDecoration: 'none',
                  minHeight: '48px', // Touch target
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
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--primitive-radius-full)',
                    backgroundColor: 'var(--semantic-interactive-primary)',
                    color: 'var(--semantic-text-inverse)',
                  }}
                >
                  <User className="w-5 h-5" aria-hidden="true" />
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
                  padding: 'var(--primitive-space-md)',
                  borderRadius: 'var(--primitive-radius-md)',
                  color: 'var(--semantic-color-danger)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  minHeight: '48px', // Touch target
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
        {/* Top bar - Mobile & Desktop */}
        <header
          className="flex items-center flex-shrink-0"
          style={{
            padding: 'var(--semantic-spacing-compact)',
            borderBottom: `var(--primitive-border-width-thin) solid var(--semantic-border-default)`,
            backgroundColor: 'var(--semantic-surface-base)',
            minHeight: '60px',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center justify-center"
            style={{
              padding: 'var(--primitive-space-sm)',
              borderRadius: 'var(--primitive-radius-md)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              marginRight: 'var(--primitive-space-md)',
              minWidth: '44px', // Touch target
              minHeight: '44px',
            }}
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 lg:hidden">
            <h1
              style={{
                fontSize: 'var(--primitive-font-size-base)',
                fontWeight: 'var(--primitive-font-weight-semibold)',
                color: 'var(--semantic-text-primary)',
              }}
            >
              Compliance Hub
            </h1>
          </div>

          {/* Desktop: peut ajouter des actions globales ici */}
          <div className="hidden lg:block">
            <h1 className="sr-only">Application de gestion des droits utilisateurs</h1>
          </div>
        </header>

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{
            padding: 'var(--semantic-spacing-element)',
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