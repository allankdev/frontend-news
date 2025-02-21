"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { getUser, login as authLogin, logout as authLogout } from "@/lib/auth";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // 🔥 Se não houver token, não tenta buscar o usuário

    async function loadUser() {
      const userData = await getUser();
      if (userData) setUser(userData);
    }
    
    loadUser();
  }, []);

  async function login(email: string, password: string) {
    const data = await authLogin(email, password);
    const userData = await getUser();
    setUser(userData);
  }

  function logout() {
    authLogout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
