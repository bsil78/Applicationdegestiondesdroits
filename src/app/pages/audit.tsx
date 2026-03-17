/**
 * Page des logs d'audit
 */

import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/page-header';
import { DataTable, type Column } from '../components/data-table';
import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../services/mock-api';
import type { AuditLog, User } from '../types';

export function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [logsData, usersData] = await Promise.all([
        api.getAuditLogs(page, pageSize),
        api.getUsers(),
      ]);

      setLogs(logsData.data);
      setTotalPages(logsData.totalPages);
      setUsers(usersData);
    } catch (error) {
      console.error('Erreur lors du chargement des logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Système';
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'medium',
    }).format(date);
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      USER_LOGIN: 'Connexion',
      USER_CREATED: 'Utilisateur créé',
      USER_UPDATED: 'Utilisateur modifié',
      USER_DELETED: 'Utilisateur supprimé',
      USER_STATUS_CHANGED: 'Statut modifié',
      PERMISSION_CREATED: 'Permission créée',
      PERMISSION_UPDATED: 'Permission modifiée',
      PERMISSION_DELETED: 'Permission supprimée',
      PERMISSION_GRANTED: 'Permission accordée',
      APPLICATION_ACCESSED: 'Application accédée',
    };
    return labels[action] || action;
  };

  const getEntityTypeLabel = (entityType: string) => {
    const labels: Record<string, string> = {
      user: 'Utilisateur',
      permission: 'Permission',
      application: 'Application',
    };
    return labels[entityType] || entityType;
  };

  const columns: Column<AuditLog>[] = [
    {
      key: 'timestamp',
      header: 'Date et heure',
      render: (log) => (
        <div style={{ fontSize: 'var(--primitive-font-size-sm)' }}>
          {formatDate(log.timestamp)}
        </div>
      ),
      width: '180px',
    },
    {
      key: 'user',
      header: 'Utilisateur',
      render: (log) => (
        <div style={{ fontWeight: 'var(--primitive-font-weight-medium)' }}>
          {getUserName(log.userId)}
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (log) => (
        <div>
          <div style={{ fontWeight: 'var(--primitive-font-weight-medium)' }}>
            {getActionLabel(log.action)}
          </div>
          <div
            style={{
              fontSize: 'var(--primitive-font-size-xs)',
              color: 'var(--semantic-text-secondary)',
            }}
          >
            {getEntityTypeLabel(log.entityType)}
          </div>
        </div>
      ),
    },
    {
      key: 'ipAddress',
      header: 'Adresse IP',
      render: (log) => (
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 'var(--primitive-font-size-sm)',
            color: 'var(--semantic-text-secondary)',
          }}
        >
          {log.ipAddress}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Historique d'audit"
        description="Traçabilité complète de toutes les actions effectuées dans le système"
        breadcrumbs={[{ label: 'Accueil', href: '/dashboard' }, { label: 'Audit' }]}
      />

      {/* Info box */}
      <div
        style={{
          marginBottom: 'var(--semantic-spacing-component)',
          padding: 'var(--component-alert-padding)',
          backgroundColor: 'var(--semantic-color-info-bg)',
          border: `var(--component-alert-border-width) solid var(--semantic-color-info-border)`,
          borderRadius: 'var(--component-alert-radius)',
          color: 'var(--semantic-color-info)',
        }}
        role="status"
      >
        <p style={{ fontSize: 'var(--primitive-font-size-sm)' }}>
          Les logs d'audit sont conservés de manière permanente pour assurer la traçabilité et la
          conformité réglementaire. Toutes les actions sensibles sont automatiquement enregistrées.
        </p>
      </div>

      {/* Table */}
      <DataTable
        data={logs}
        columns={columns}
        keyExtractor={(log) => log.id}
        emptyMessage="Aucun log d'audit disponible"
        caption="Historique complet des actions dans le système"
        loading={loading}
      />

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div
          className="flex items-center justify-between"
          style={{
            marginTop: 'var(--semantic-spacing-component)',
            padding: 'var(--semantic-spacing-element)',
            backgroundColor: 'var(--component-card-bg)',
            border: `var(--primitive-border-width-thin) solid var(--component-card-border)`,
            borderRadius: 'var(--component-card-radius)',
          }}
        >
          <p
            style={{
              fontSize: 'var(--primitive-font-size-sm)',
              color: 'var(--semantic-text-secondary)',
            }}
          >
            Page {page} sur {totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--primitive-space-xs)',
              }}
              aria-label="Page précédente"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              Précédent
            </Button>

            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--primitive-space-xs)',
              }}
              aria-label="Page suivante"
            >
              Suivant
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
