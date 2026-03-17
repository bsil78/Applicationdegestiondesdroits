/**
 * Composant Label pour les formulaires
 * Accessible et stylisé avec les tokens de design
 */

import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: React.ReactNode;
}

export function Label({ required, children, htmlFor, className, ...props }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={className}
      style={{
        display: 'block',
        fontSize: 'var(--primitive-font-size-sm)',
        fontWeight: 'var(--primitive-font-weight-medium)',
        color: 'var(--semantic-text-primary)',
        marginBottom: 'var(--primitive-space-sm)',
      }}
      {...props}
    >
      {children}
      {required && (
        <span
          style={{
            color: 'var(--semantic-color-danger)',
            marginLeft: 'var(--primitive-space-xs)',
          }}
          aria-label="requis"
        >
          *
        </span>
      )}
    </label>
  );
}
