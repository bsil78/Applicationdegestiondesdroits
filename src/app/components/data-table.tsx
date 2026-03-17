/**
 * Composant Table de données réutilisable avec accessibilité
 * Utilise les tokens de design système niveau 3
 */

import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
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
