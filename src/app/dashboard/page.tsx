"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth"; // 🚀 Substituindo NextAuth por JWT
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, logout } = useAuth(); // 🚀 Agora usamos nosso sistema JWT
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login"); // 🔥 Redireciona para login se não estiver autenticado
    } else {
      fetchStats();
    }
  }, [user, router]);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Erro ao buscar estatísticas", error);
    }
  };

  if (!user) return null; // 🔥 Evita renderizar o conteúdo antes da autenticação

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard Administrativo</h1>

      {stats ? (
        <div className="mt-4">
          <p>📈 Total de leituras: {stats.totalReads}</p>
          <p>🔥 Top usuário: {stats.topUser}</p>
        </div>
      ) : (
        <p className="text-gray-500">Carregando estatísticas...</p>
      )}

      <Button className="mt-6" onClick={logout}>
        Sair
      </Button>
    </div>
  );
}
