import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isTeacher: false,
  login: () => {},
  logout: () => {}
});

const parseJwt = (token) => {
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.warn('Token inválido en AuthContext:', error);
    localStorage.removeItem('token');
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => parseJwt(localStorage.getItem('token')));

  const login = (token) => {
    localStorage.setItem('token', token);
    setUser(parseJwt(token));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isTeacher = !!user && (user.role === 'teacher' || user.role === 'docente');
  const isAuthenticated = !!user;

  const value = useMemo(
    () => ({ user, isAuthenticated, isTeacher, login, logout }),
    [user, isAuthenticated, isTeacher]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
export default AuthContext;
