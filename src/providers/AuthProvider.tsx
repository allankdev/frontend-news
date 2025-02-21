"use client";

import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { useRouter } from "next/navigation"; // ✅ Importa o router
import { getUser, login as authLogin, logout as authLogout } from "@/lib/auth";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  streak?: number; // 🔥 Agora streak é opcional
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter(); // ✅ Instancie o router
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getUser();

        if (userData) {
          userData.streak = typeof userData.streak === "number" ? userData.streak : null; // 🔥 Evita erro
          setUser(userData);
          setIsAuthenticated(true);

          // ✅ Redireciona automaticamente para a dashboard correta
          if (userData.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        } else {
          console.warn("⚠️ Nenhum usuário carregado, deslogando.");
          logout();
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        logout();
      }
    }

    loadUser();
  }, []);

  async function login(email: string, password: string) {
    try {
      const data = await authLogin(email, password);
      if (data) {
        const userData = await getUser();
        userData.streak = typeof userData.streak === "number" ? userData.streak : null; // 🔥 Corrige erro de streak
        setUser(userData);
        setIsAuthenticated(true);

        // ✅ Redireciona para a dashboard correta após login
        if (userData.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Erro no login:", error);
      throw new Error("Falha ao autenticar. Verifique suas credenciais.");
    }
  }

  function logout() {
    authLogout();
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login"); // ✅ Redireciona para login
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
