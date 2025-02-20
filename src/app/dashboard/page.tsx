"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StreakCard } from "@/components/streaks/StreakCard";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default function UserDashboardPage() {
  const { user, logout } = useAuth();
  const [streak, setStreak] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextBadge, setNextBadge] = useState<number | null>(null);

  useEffect(() => {
    fetchStreak();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const getNextBadge = (streak: number) => {
    const badgeMilestones = [3, 7, 14, 30];
    return badgeMilestones.find((milestone) => milestone > streak) || null;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🔥 Sua Dashboard</h1>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : (
        streak !== null ? (
          <>
            <StreakCard streak={streak} />
            {nextBadge && (
              <>
                <p className="mt-4 text-sm text-gray-600">
                  🔜 Faltam {nextBadge - streak} dias para um novo badge!
                </p>
                <Progress value={(streak / nextBadge) * 100} />
              </>
            )}
          </>
        ) : (
          <p className="text-gray-500">Nenhum streak encontrado.</p>
        )
      )}

      {/* 🔥 Links para Histórico e Badges */}
      <div className="mt-6 flex gap-4">
        <Link href="/dashboard/history">
          <Button className="bg-blue-500 text-white">📜 Histórico</Button>
        </Link>
        <Link href="/dashboard/badges">
          <Button className="bg-yellow-500 text-white">🏅 Seus Badges</Button>
        </Link>
      </div>

      {/* 🔥 Botão de Logout */}
      <div className="mt-6">
        <Button 
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          onClick={logout}
        >
          Sair
        </Button>
      </div>
    </div>
  );
}
