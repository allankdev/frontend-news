"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login, user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardPath = user.role === "admin" ? "/admin" : "/dashboard";
      router.push(dashboardPath);
    }
  }, [isAuthenticated, user, router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      await login(email, password);
      const dashboardPath = user?.role === "admin" ? "/admin" : "/dashboard";
      router.push(dashboardPath);
    } catch  {
    
      setError("Credenciais inválidas");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">🔐 Login</h2>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm text-center mb-4"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-gray-700 font-semibold">📧 Email</label>
            <Input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold">🔑 Senha</label>
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold transition duration-300"
          >
            Entrar
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
