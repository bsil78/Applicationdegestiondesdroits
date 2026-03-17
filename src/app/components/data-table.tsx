/**
 * Composant Table de données réutilisable avec accessibilité
 * Responsive: affichage table sur desktop, cards sur mobile
 */

import React, { useState, useEffect } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  mobileLabel?: string; // Label optionnel pour l'affichage mobile
  hideOnMobile?: boolean; // Cacher cette colonne sur mobile
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  caption?: string;
  loading?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  emptyMessage = 'Aucune donnée disponible',
  caption,
  loading = false,
}: DataTableProps<T>) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Affichage mobile en cartes
  if (isMobile) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--primitive-space-md)',
        }}
      >
        {caption && <h2 className="sr-only">{caption}</h2>}

        {loading ? (
          <div
            className="text-center"
            style={{
              padding: 'var(--semantic-spacing-component)',
              color: 'var(--semantic-text-secondary)',
            }}
          >
            Chargement...
          </div>
        ) : data.length === 0 ? (
          <div
            className="text-center"
            style={{
              padding: 'var(--semantic-spacing-component)',
              color: 'var(--semantic-text-secondary)',
            }}
          >
            {emptyMessage}
          </div>
        ) : (
          data.map((item, index) => (
            <div
              key={keyExtractor(item)}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              className={onRowClick ? 'cursor-pointer' : ''}
              style={{
                backgroundColor: 'var(--component-card-bg)',
                border: `var(--primitive-border-width-thin) solid var(--component-card-border)`,
                borderRadius: 'var(--component-card-radius)',
                padding: 'var(--semantic-spacing-element)',
                transition: `box-shadow var(--primitive-transition-fast) ease`,
              }}
              onMouseEnter={(e) => {
                if (onRowClick) {
                  e.currentTarget.style.boxShadow = 'var(--primitive-shadow-md)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
              tabIndex={onRowClick ? 0 : undefined}
              role={onRowClick ? 'button' : undefined}
              onKeyDown={
                onRowClick
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onRowClick(item);
                      }
                    }
                  : undefined
              }
              aria-label={onRowClick ? `Sélectionner l'élément ${index + 1}` : undefined}
            >
              {columns
                .filter((col) => !col.hideOnMobile)
                .map((column) => (
                  <div
                    key={column.key}
                    style={{
                      marginBottom: 'var(--primitive-space-sm)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 'var(--primitive-font-size-xs)',
                        color: 'var(--semantic-text-secondary)',
                        marginBottom: 'var(--primitive-space-xs)',
                        fontWeight: 'var(--primitive-font-weight-medium)',
                      }}
                    >
                      {column.mobileLabel || column.header}
                    </div>
                    <div style={{ fontSize: 'var(--primitive-font-size-sm)' }}>
                      {column.render(item)}
                    </div>
                  </div>
                ))}
            </div>
          ))
        )}
      </div>
    );
  }

  // Affichage desktop en table
  return (
    <div
      className="overflow-x-auto"
      style={{
        border: `var(--primitive-border-width-thin) solid var(--component-table-border)`,
        borderRadius: 'var(--component-card-radius)',
      }}
    >
      <table
        className="w-full"
        style={{
          borderCollapse: 'separate',
          borderSpacing: 0,
        }}
      >
        {caption && <caption className="sr-only">{caption}</caption>}

        <thead
          style={{
            backgroundColor: 'var(--component-table-header-bg)',
            color: 'var(--component-table-header-text)',
          }}
        >
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="text-left"
                style={{
                  padding: 'var(--component-table-cell-padding-y) var(--component-table-cell-padding-x)',
                  fontWeight: 'var(--primitive-font-weight-semibold)',
                  fontSize: 'var(--primitive-font-size-sm)',
                  borderBottom: `var(--primitive-border-width-thin) solid var(--component-table-border)`,
                  width: column.width,
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center"
                style={{
                  padding: 'var(--semantic-spacing-component)',
                  color: 'var(--semantic-text-secondary)',
                }}
              >
                Chargement...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center"
                style={{
                  padding: 'var(--semantic-spacing-component)',
                  color: 'var(--semantic-text-secondary)',
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={keyExtractor(item)}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                className={onRowClick ? 'cursor-pointer' : ''}
                style={{
                  backgroundColor: 'var(--semantic-surface-base)',
                  transition: `background-color var(--primitive-transition-fast) ease`,
                }}
                onMouseEnter={(e) => {
                  if (onRowClick) {
                    e.currentTarget.style.backgroundColor = 'var(--component-table-row-hover-bg)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--semantic-surface-base)';
                }}
                tabIndex={onRowClick ? 0 : undefined}
                role={onRowClick ? 'button' : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onRowClick(item);
                        }
                      }
                    : undefined
                }
                aria-label={onRowClick ? `Sélectionner la ligne ${rowIndex + 1}` : undefined}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    style={{
                      padding: 'var(--component-table-cell-padding-y) var(--component-table-cell-padding-x)',
                      borderBottom: `var(--primitive-border-width-thin) solid var(--component-table-border)`,
                      fontSize: 'var(--primitive-font-size-sm)',
                    }}
                  >
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}