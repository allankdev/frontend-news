import { api } from "./api";

export async function login(email: string, password: string) {
  try {
    console.log("📡 Enviando login para o backend:", email, password); // 🔥 Debug

    const response = await api.post("/auth/login", { email, password });

    console.log("✅ Resposta do backend:", response.data); // 🔥 Debug

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role); // ✅ Agora salvamos corretamente o token
      return response.data;
    }

    throw new Error("Credenciais inválidas");
  } catch (error: any) {
    console.error("❌ Erro no login:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Erro ao autenticar");
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}

export function getToken() {
  return localStorage.getItem("token");
}

export async function getUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ Nenhum token encontrado, retornando null.");
      return null; // Apenas retorna null sem lançar erro
    }

    const response = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Agora o token será enviado corretamente
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Erro ao buscar usuário:", error.response?.data || error.message);
    return null; // Retorna null em vez de lançar um erro
  }
}
