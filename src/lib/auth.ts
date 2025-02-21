"use client";

import { api } from "./api";
import { AxiosError } from "axios";

export async function login(email: string, password: string) {
  try {
    const response = await api.post<{ token: string; role: string }>("/auth/login", { email, password });
    
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      return response.data;
    }

    throw new Error("Credenciais inválidas");
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error("❌ Erro no login:", axiosError.response?.data || axiosError.message);
    throw new Error(axiosError.response?.data?.message || "Erro ao autenticar");
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
      return null;
    }

    const response = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error("❌ Erro ao buscar usuário:", axiosError.response?.data || axiosError.message);
    return null; // Retorna null em vez de lançar um erro
  }
}
