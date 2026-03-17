/**
 * Configuration du routage de l'application
 * Utilise React Router Data Mode
 */

import { createBrowserRouter, Navigate } from 'react-router';
import { AppLayout } from './components/app-layout';
import { LoginPage } from './pages/login';
import { DashboardPage } from './pages/dashboard';
import { UsersPage } from './pages/users';
import { UserFormPage } from './pages/user-form';
import { UserDetailPage } from './pages/user-detail';
import { PermissionsPage } from './pages/permissions';
import { PermissionFormPage } from './pages/permission-form';
import { PermissionDetailPage } from './pages/permission-detail';
import { AuditPage } from './pages/audit';
import { ProfilePage } from './pages/profile';

/**
 * Composant de protection des routes
 * Vérifie si l'utilisateur est authentifié
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('compliance_auth_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}

/**
 * Page 404
 */
function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: 'var(--semantic-surface-raised)',
        padding: 'var(--semantic-spacing-component)',
      }}
    >
      <div className="text-center">
        <h1
          style={{
            fontSize: 'var(--primitive-font-size-3xl)',
            fontWeight: 'var(--primitive-font-weight-bold)',
            marginBottom: 'var(--semantic-spacing-element)',
            color: 'var(--semantic-text-primary)',
          }}
        >
          404
        </h1>
        <p
          style={{
            fontSize: 'var(--primitive-font-size-lg)',
            color: 'var(--semantic-text-secondary)',
            marginBottom: 'var(--semantic-spacing-component)',
          }}
        >
          Page non trouvée
        </p>
        <a
          href="/dashboard"
          style={{
            color: 'var(--semantic-interactive-primary)',
            textDecoration: 'underline',
          }}
        >
          Retour au tableau de bord
        </a>
      </div>
    </div>
  );
}

/**
 * Configuration du routeur
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute>
        <UsersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/users/new',
    element: (
      <ProtectedRoute>
        <UserFormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/users/:id',
    element: (
      <ProtectedRoute>
        <UserDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/users/:id/edit',
    element: (
      <ProtectedRoute>
        <UserFormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/permissions',
    element: (
      <ProtectedRoute>
        <PermissionsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/permissions/new',
    element: (
      <ProtectedRoute>
        <PermissionFormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/permissions/:id',
    element: (
      <ProtectedRoute>
        <PermissionDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/permissions/:id/edit',
    element: (
      <ProtectedRoute>
        <PermissionFormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/audit',
    element: (
      <ProtectedRoute>
        <AuditPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);