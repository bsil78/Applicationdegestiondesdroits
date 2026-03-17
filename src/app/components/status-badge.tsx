/**
 * Composant Badge pour afficher les statuts utilisateur
 * Utilise les tokens de design système
 */

import React from 'react';
import type { UserStatus } from '../types';
import { CheckCircle, XCircle, Pause } from 'lucide-react';

interface StatusBadgeProps {
  status: UserStatus;
  className?: string;
}

const statusConfig: Record<
  UserStatus,
  { label: string; icon: React.ComponentType<{ className?: string }>; style: React.CSSProperties }
> = {
  active: {
    label: 'Actif',
    icon: CheckCircle,
    style: {
      backgroundColor: 'var(--semantic-color-success-bg)',
      color: 'var(--semantic-color-success)',
      borderColor: 'var(--semantic-color-success-border)',
    },
  },
  inactive: {
    label: 'Inactif',
    icon: XCircle,
    style: {
      backgroundColor: 'var(--primitive-gray-100)',
      color: 'var(--primitive-gray-600)',
      borderColor: 'var(--primitive-gray-300)',
    },
  },
  suspended: {
    label: 'Suspendu',
    icon: Pause,
    style: {
      backgroundColor: 'var(--semantic-color-danger-bg)',
      color: 'var(--semantic-color-danger)',
      borderColor: 'var(--semantic-color-danger-border)',
    },
  },
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium ${className}`}
      style={{
        ...config.style,
        padding: 'var(--component-badge-padding-y) var(--component-badge-padding-x)',
        borderRadius: 'var(--component-badge-radius)',
        fontSize: 'var(--component-badge-font-size)',
        border: `var(--primitive-border-width-thin) solid`,
      }}
      role="status"
      aria-label={`Statut: ${config.label}`}
    >
      <Icon className="w-3 h-3" aria-hidden="true" />
      {config.label}
    </span>
  );
}
