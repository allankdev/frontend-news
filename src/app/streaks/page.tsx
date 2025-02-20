"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { StreakCard } from "@/components/streaks/StreakCard";
import { useAuth } from "@/hooks/useAuth"; // 🚀 Substituindo useSession

export default function StreaksPage() {
  const { user } = useAuth(); // Agora usamos nosso sistema JWT
  const router = useRouter();
  const [streak, setStreak] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login"); // 🚀 Redireciona se não estiver autenticado
    } else {
      fetchStreak();
    }
  }, [user]);

  const fetchStreak = async () => {
    try {
      const response = await api.get("/streaks/me");
      setStreak(response.data.streak);
    } catch (error) {
      console.error("Erro ao buscar streak", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Seus Streaks 🔥</h1>
      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : streak !== null ? (
        <StreakCard streak={streak} />
      ) : (
        <p className="text-gray-500">Nenhum streak encontrado.</p>
      )}
    </div>
  );
}
