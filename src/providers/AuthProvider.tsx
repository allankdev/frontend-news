"use client";

import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUser, login as authLogin, logout as authLogout } from "@/lib/auth";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  streak?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean; // Adicionado para evitar redirecionamentos antes do carregamento
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true); // 🔥 Novo estado para evitar redirecionamentos antes da verificação

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getUser();

        if (userData) {
          userData.streak = typeof userData.streak === "number" ? userData.streak : null;
          setUser(userData);
          setIsAuthenticated(true);

          // ✅ Redireciona usuários somente se eles já estiverem autenticados e não estiverem na tela inicial
          if (pathname !== "/" && pathname !== "/login") {
            if (userData.role === "admin") {
              router.push("/admin");
            } else {
              router.push("/dashboard");
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // 🔥 Agora marcamos o carregamento como finalizado
      }
    }

    loadUser();
  }, []);

  async function login(email: string, password: string) {
    try {
      const data = await authLogin(email, password);
      if (data) {
        const userData = await getUser();
        userData.streak = typeof userData.streak === "number" ? userData.streak : null;
        setUser(userData);
        setIsAuthenticated(true);

        // ✅ Redireciona corretamente após login
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
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
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
