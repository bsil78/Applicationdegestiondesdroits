/**
 * Composant d'en-tête de page réutilisable
 * Responsive: adapté pour mobile et desktop
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
        paddingBottom: 'var(--semantic-spacing-element)',
        marginBottom: 'var(--semantic-spacing-component)',
      }}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Fil d'Ariane"
          style={{ marginBottom: 'var(--semantic-spacing-compact)' }}
          className="hidden sm:block"
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

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1">
          <h1
            style={{
              color: 'var(--semantic-text-primary)',
              marginBottom: description ? 'var(--semantic-spacing-compact)' : '0',
              fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', // Responsive font size
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                color: 'var(--semantic-text-secondary)',
                fontSize: 'var(--primitive-font-size-sm)',
                fontWeight: 'var(--primitive-font-weight-normal)',
              }}
            >
              {description}
            </p>
          )}
        </div>

        {action && (
          <div className="flex-shrink-0 w-full sm:w-auto">
            {action}
          </div>
        )}
      </div>
    </header>
  );
}