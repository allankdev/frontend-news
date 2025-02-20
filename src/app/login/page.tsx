"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth"; // 🚀 Usa nosso sistema JWT
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const { login, user, isAuthenticated } = useAuth(); // 🚀 Agora pegamos o usuário autenticado
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Se o usuário já estiver autenticado, redireciona para a dashboard correta
    if (isAuthenticated && user) {
      const dashboardPath = user.role === "admin" ? "/admin" : "/dashboard";
      router.push(dashboardPath);
    }
  }, [isAuthenticated, user, router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      await login(email, password);
      // 🔥 Pegamos os dados do usuário após o login para direcionar corretamente
      const dashboardPath = user?.role === "admin" ? "/admin" : "/dashboard";
      router.push(dashboardPath);
    } catch (err) {
      setError("Credenciais inválidas");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        />
        <Button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Entrar
        </Button>
      </form>
    </div>
  );
}
