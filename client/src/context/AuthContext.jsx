import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const loadUser = async (authToken) => {
    try {
      const res = await api.get('/auth', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error('Failed to load user', err);
      logout();
    }
  };

  useEffect(() => {
    if (token) {
      loadUser(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: newToken } = res.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      await loadUser(newToken);
    } catch (err) {
      console.error('Login failed', err);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
