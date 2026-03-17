/**
 * Page de connexion avec accessibilité
 * Utilise les tokens de design système
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/auth-context';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Shield, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: 'var(--semantic-surface-raised)',
        padding: 'var(--semantic-spacing-component)',
      }}
    >
      <div
        className="w-full max-w-md"
        style={{
          backgroundColor: 'var(--component-card-bg)',
          border: `var(--primitive-border-width-thin) solid var(--component-card-border)`,
          borderRadius: 'var(--component-card-radius)',
          boxShadow: 'var(--component-card-shadow)',
          padding: 'var(--component-card-padding)',
        }}
      >
        {/* Header */}
        <div
          className="text-center"
          style={{ marginBottom: 'var(--semantic-spacing-component)' }}
        >
          <div
            className="inline-flex items-center justify-center"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--primitive-radius-xl)',
              backgroundColor: 'var(--semantic-interactive-primary)',
              marginBottom: 'var(--semantic-spacing-element)',
            }}
          >
            <Shield
              className="w-8 h-8"
              style={{ color: 'var(--semantic-text-inverse)' }}
              aria-hidden="true"
            />
          </div>
          <h1 style={{ marginBottom: 'var(--primitive-space-sm)' }}>
            Compliance Hub
          </h1>
          <p
            style={{
              color: 'var(--semantic-text-secondary)',
              fontSize: 'var(--primitive-font-size-sm)',
            }}
          >
            Connexion à la plateforme de gestion des droits
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: 'var(--semantic-spacing-element)' }}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@compliance.com"
              required
              autoComplete="email"
              autoFocus
              aria-describedby={error ? 'login-error' : undefined}
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: 'var(--semantic-spacing-element)' }}>
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                aria-describedby={error ? 'login-error' : undefined}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{
                  color: 'var(--semantic-text-tertiary)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 'var(--primitive-space-xs)',
                }}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Eye className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <Alert
              variant="destructive"
              style={{ marginBottom: 'var(--semantic-spacing-element)' }}
              role="alert"
            >
              <AlertDescription id="login-error">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !email || !password}
            aria-busy={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
        </form>

        {/* Help text */}
        <div
          className="text-center"
          style={{
            marginTop: 'var(--semantic-spacing-component)',
            padding: 'var(--semantic-spacing-element)',
            backgroundColor: 'var(--semantic-color-info-bg)',
            borderRadius: 'var(--primitive-radius-md)',
            border: `var(--primitive-border-width-thin) solid var(--semantic-color-info-border)`,
          }}
        >
          <p
            style={{
              fontSize: 'var(--primitive-font-size-sm)',
              color: 'var(--semantic-color-info)',
              marginBottom: 'var(--primitive-space-xs)',
            }}
          >
            <strong>Environnement de démonstration</strong>
          </p>
          <p style={{ fontSize: 'var(--primitive-font-size-xs)', color: 'var(--semantic-text-secondary)' }}>
            Email: <strong>admin@compliance.com</strong>
            <br />
            Mot de passe: <strong>Password123!</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
