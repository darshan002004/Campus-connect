import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('campusconnect_token');
      const storedUser = localStorage.getItem('campusconnect_user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verify token validity by calling /auth/me
          const res = await authService.getMe();
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('campusconnect_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.warn('Session expired or invalid, logging out:', error.message);
          localStorage.removeItem('campusconnect_token');
          localStorage.removeItem('campusconnect_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.data.success) {
      const { token: authToken, user: userData } = res.data;
      setToken(authToken);
      setUser(userData);
      localStorage.setItem('campusconnect_token', authToken);
      localStorage.setItem('campusconnect_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.data.success) {
      const { token: authToken, user: newUser } = res.data;
      setToken(authToken);
      setUser(newUser);
      localStorage.setItem('campusconnect_token', authToken);
      localStorage.setItem('campusconnect_user', JSON.stringify(newUser));
      return newUser;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('campusconnect_token');
    localStorage.removeItem('campusconnect_user');
  };

  const updateProfileState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('campusconnect_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
    login,
    register,
    logout,
    updateProfileState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
