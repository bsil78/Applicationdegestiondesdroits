/**
 * Composant Checkbox accessible
 * Stylisé avec les tokens de design
 */

import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function Checkbox({ checked, onCheckedChange, className, id, ...props }: CheckboxProps) {
  return (
    <div className="relative inline-flex" style={{ width: '20px', height: '20px' }}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className={className}
        style={{
          position: 'absolute',
          width: '20px',
          height: '20px',
          margin: 0,
          opacity: 0,
          cursor: 'pointer',
        }}
        {...props}
      />
      <div
        style={{
          width: '20px',
          height: '20px',
          borderRadius: 'var(--primitive-radius-sm)',
          border: `2px solid ${
            checked ? 'var(--semantic-interactive-primary)' : 'var(--semantic-border-default)'
          }`,
          backgroundColor: checked
            ? 'var(--semantic-interactive-primary)'
            : 'var(--semantic-surface-base)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: `all var(--primitive-transition-fast) ease`,
          pointerEvents: 'none',
        }}
      >
        {checked && (
          <Check
            className="w-4 h-4"
            style={{ color: 'var(--semantic-text-inverse)' }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
