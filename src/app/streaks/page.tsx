"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { StreakCard } from "@/components/streaks/StreakCard";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function StreaksPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [streak, setStreak] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nextBadge, setNextBadge] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchStreak();
  }, [user, isAuthenticated, router]);

  const fetchStreak = async () => {
    try {
      const response = await api.get("/streaks/me");

      if (response.data && typeof response.data.streak === "number") {
        setStreak(response.data.streak);
        setNextBadge(getNextBadge(response.data.streak));
      } else {
        setStreak(null);
      }
    } catch (error) {
      console.error("Erro ao buscar streak", error);
      setError("Erro ao carregar streak.");
    } finally {
      setLoading(false);
    }
  };

  const getNextBadge = (streak: number) => {
    const badgeMilestones = [3, 7, 14, 30];
    return badgeMilestones.find((milestone) => milestone > streak) || null;
  };

  if (!isAuthenticated) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🔥 Seus Streaks</h1>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : streak !== null ? (
        <>
          <StreakCard streak={streak} />
          {nextBadge && (
            <>
              <p className="mt-4 text-sm text-gray-600">
                🔜 Faltam {nextBadge - streak} dias para conquistar um novo badge!
              </p>
              <Progress value={(streak / nextBadge) * 100} />
            </>
          )}
        </>
      ) : (
        <p className="text-gray-500">Nenhum streak encontrado.</p>
      )}

      {/* Botão de Logout */}
      <div className="mt-6">
        <Button 
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          Sair
        </Button>
      </div>
    </div>
  );
}
