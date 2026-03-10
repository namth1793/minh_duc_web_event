import { createContext, useContext, useState, useCallback } from 'react';
import api from '../lib/api';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('admin_token') || null);

  const isAdminLoggedIn = Boolean(adminToken);

  const authHeader = useCallback(() => {
    if (!adminToken) return {};
    return { Authorization: `Bearer ${adminToken}` };
  }, [adminToken]);

  const adminLogin = useCallback(async (username, password) => {
    const res = await api.post('/api/admin/login', { username, password });
    const { token } = res.data;
    localStorage.setItem('admin_token', token);
    setAdminToken(token);
    return res.data;
  }, []);

  const adminLogout = useCallback(() => {
    localStorage.removeItem('admin_token');
    setAdminToken(null);
  }, []);

  return (
    <AdminContext.Provider value={{ adminToken, isAdminLoggedIn, authHeader, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
