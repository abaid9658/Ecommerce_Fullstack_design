import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authAPI from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('userInfo');

      if (token && savedUser) {
        try {
          // Optimistically set user from local storage first
          setUser(JSON.parse(savedUser));
          // Then validate with the server
          const profile = await authAPI.getProfile();
          setUser(profile);
          localStorage.setItem('userInfo', JSON.stringify(profile));
        } catch {
          // Token invalid/expired — clear local session silently
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userInfo');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await authAPI.login(email, password);
      localStorage.setItem('accessToken', data.accessToken);
      
      const userInfo = { _id: data._id, name: data.name, email: data.email, role: data.role };
      setUser(userInfo);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      setLoading(false);
      return userInfo;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await authAPI.register(name, email, password);
      localStorage.setItem('accessToken', data.accessToken);
      
      const userInfo = { _id: data._id, name: data.name, email: data.email, role: data.role };
      setUser(userInfo);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      setLoading(false);
      return userInfo;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('API logout request failed:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userInfo');
      setUser(null);
    }
  };

  const socialLogin = async (provider, providerData) => {
    setError(null);
    setLoading(true);
    try {
      const { default: axiosInst } = await import('../api/axios');
      const res = await axiosInst.post('/api/auth/social-login', { provider, ...providerData });
      const data = res.data;
      localStorage.setItem('accessToken', data.accessToken);
      const userInfo = { _id: data._id, name: data.name, email: data.email, role: data.role };
      setUser(userInfo);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      setLoading(false);
      return userInfo;
    } catch (err) {
      setError(err.response?.data?.message || 'Social login failed');
      setLoading(false);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        socialLogin,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
