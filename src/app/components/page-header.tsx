/**
 * Composant d'en-tête de page réutilisable
 * Utilise les tokens sémantiques pour l'espacement
 */

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageHeader({ title, description, action, breadcrumbs }: PageHeaderProps) {
  return (
    <header
      className="border-b"
      style={{
        borderColor: 'var(--semantic-border-default)',
        paddingBottom: 'var(--semantic-spacing-component)',
        marginBottom: 'var(--semantic-spacing-component)',
      }}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Fil d'Ariane"
          style={{ marginBottom: 'var(--semantic-spacing-compact)' }}
        >
          <ol className="flex items-center gap-2" style={{ fontSize: 'var(--primitive-font-size-sm)' }}>
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <span style={{ color: 'var(--semantic-text-tertiary)' }} aria-hidden="true">
                    /
                  </span>
                )}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    style={{ color: 'var(--semantic-interactive-primary)' }}
                    className="hover:underline"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span style={{ color: 'var(--semantic-text-secondary)' }}>{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            style={{
              color: 'var(--semantic-text-primary)',
              marginBottom: description ? 'var(--semantic-spacing-compact)' : '0',
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                color: 'var(--semantic-text-secondary)',
                fontSize: 'var(--primitive-font-size-base)',
                fontWeight: 'var(--primitive-font-weight-normal)',
              }}
            >
              {description}
            </p>
          )}
        </div>

        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </header>
  );
}
