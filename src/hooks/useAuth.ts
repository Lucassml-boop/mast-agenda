import { useState } from 'react';
import type { LoginData, UseAuthReturn } from '../types';
import { ADMIN_CREDENTIALS, VALIDATION_MESSAGES } from '../constants';

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');

  const login = (credentials: LoginData): boolean => {
    if (credentials.username === ADMIN_CREDENTIALS.username && 
        credentials.password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setLoginError('');
      return true;
    } else {
      setLoginError(VALIDATION_MESSAGES.LOGIN_INVALID);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setLoginError('');
  };

  return {
    isAuthenticated,
    login,
    logout,
    loginError
  };
};