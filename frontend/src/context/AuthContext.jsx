import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user_info');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('jwt_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await axiosClient.get('/auth/me');
          if (res.success) {
            setUser(res.data);
            localStorage.setItem('user_info', JSON.stringify(res.data));
          }
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    if (res.success && res.data) {
      setToken(res.data.accessToken);
      setUser(res.data.user);
      localStorage.setItem('jwt_token', res.data.accessToken);
      localStorage.setItem('user_info', JSON.stringify(res.data.user));
    }
    return res;
  };

  const register = async (name, email, password, role) => {
    return await axiosClient.post('/auth/register', { name, email, password, role });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
  };

  const isAdmin = user?.role === 'ADMIN';
  const isReviewer = user?.role === 'REVIEWER' || isAdmin;
  const isIntern = user?.role === 'INTERN';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin, isReviewer, isIntern }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
