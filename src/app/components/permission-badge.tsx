/**
 * Composant Badge pour afficher les permissions
 * Utilise les tokens de design système niveau 3 (composant)
 */

import React from 'react';
import type { PermissionAction } from '../types';

interface PermissionBadgeProps {
  action: PermissionAction;
  className?: string;
}

const actionConfig: Record<
  PermissionAction,
  { label: string; style: React.CSSProperties }
> = {
  create: {
    label: 'Créer',
    style: {
      backgroundColor: 'var(--semantic-color-success-bg)',
      color: 'var(--semantic-color-success)',
      borderColor: 'var(--semantic-color-success-border)',
    },
  },
  read: {
    label: 'Consulter',
    style: {
      backgroundColor: 'var(--semantic-color-info-bg)',
      color: 'var(--semantic-color-info)',
      borderColor: 'var(--semantic-color-info-border)',
    },
  },
  update: {
    label: 'Modifier',
    style: {
      backgroundColor: 'var(--semantic-color-warning-bg)',
      color: 'var(--semantic-color-warning)',
      borderColor: 'var(--semantic-color-warning-border)',
    },
  },
  archive: {
    label: 'Archiver',
    style: {
      backgroundColor: 'var(--semantic-color-danger-bg)',
      color: 'var(--semantic-color-danger)',
      borderColor: 'var(--semantic-color-danger-border)',
    },
  },
};

export function PermissionBadge({ action, className = '' }: PermissionBadgeProps) {
  const config = actionConfig[action];

  return (
    <span
      className={`inline-flex items-center font-medium ${className}`}
      style={{
        ...config.style,
        padding: 'var(--component-badge-padding-y) var(--component-badge-padding-x)',
        borderRadius: 'var(--component-badge-radius)',
        fontSize: 'var(--component-badge-font-size)',
        border: `var(--primitive-border-width-thin) solid`,
      }}
      role="status"
      aria-label={`Permission: ${config.label}`}
    >
      {config.label}
    </span>
  );
}
