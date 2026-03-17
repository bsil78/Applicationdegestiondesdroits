/**
 * Contexte d'authentification pour l'application
 * Gère l'état de l'utilisateur connecté et les opérations d'authentification
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, AuthCredentials } from '../types';
import { api } from '../services/mock-api';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'compliance_auth_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Vérifie le token au chargement de l'application
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          const user = await api.verifyToken(token);
          setUser(user);
        }
      } catch (error) {
        // Token invalide, on le supprime
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Connexion de l'utilisateur
   */
  const login = useCallback(async (credentials: AuthCredentials) => {
    setIsLoading(true);
    try {
      const response = await api.login(credentials);
      localStorage.setItem(TOKEN_KEY, response.token);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Déconnexion de l'utilisateur
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.logout();
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Rafraîchit les données de l'utilisateur
   */
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        const user = await api.verifyToken(token);
        setUser(user);
      } catch (error) {
        // Token invalide
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      }
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook pour utiliser le contexte d'authentification
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}
