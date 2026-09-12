import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  async function refreshUser() {
    try {
      const res = await api.get("/user/me");
      setUser(res.data.data);
      return res.data.data;
    } catch {
      setUser(null);
      return null;
    }
  }

  async function login({ email, password }) {
    await api.post("/auth/login", { email, password });
    const me = await refreshUser();
    return me;
  }

  async function register({ name, email, password }) {
    const res = await api.post("/auth/register", { name, email, password });
    return res.data.data;
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
