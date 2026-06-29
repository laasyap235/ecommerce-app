import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signupUser, logoutUser, getCurrentUser, microsoftLogin } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    getCurrentUser()
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
  }, []);

  const signin = async (credentials) => {
    const res = await loginUser(credentials);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const signup = async (details) => {
    const res = await signupUser(details);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const signout = async () => {
    try {
      await logoutUser();
    } catch {
      // Even if the request fails, drop the local session anyway.
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  const microsoftSignin = async (accessToken) => {
    const res = await microsoftLogin(accessToken);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, loading, signin, signup, signout, microsoftSignin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export default AuthContext;