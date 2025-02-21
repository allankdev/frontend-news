"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

dayjs.extend(relativeTime);

interface StreakEntry {
  date: string;
  streak: number;
}

export default function UserDashboardPage() {
  const { logout } = useAuth();
  const [streak, setStreak] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextBadge, setNextBadge] = useState<number | null>(null);
  const [chartData, setChartData] = useState<StreakEntry[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const fetchStreak = useCallback(async () => {
    try {
      const response = await api.get("/streaks/me");
      if (response.data && typeof response.data.streak === "number") {
        setStreak(response.data.streak);
        setNextBadge(getNextBadge(response.data.streak));

        // Se a API enviar um histórico de streaks, usamos os dados reais no gráfico
        if (response.data.history) {
          setChartData(
            response.data.history.map((entry: StreakEntry) => ({
              date: dayjs(entry.date).format("DD/MM"),
              streak: entry.streak,
            }))
          );
        } else {
          // Se não houver histórico, mantém os dados antigos
          setChartData([
            { date: "Últimos 7 dias", streak: response.data.streak - 3 },
            { date: "Últimos 30 dias", streak: response.data.streak },
          ]);
        }
      } else {
        setStreak(null);
      }
    } catch (error) {
      console.error("Erro ao buscar streak", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]); // ✅ Agora está correto!

  useEffect(() => {
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Atualiza a cada minuto
    return () => clearInterval(interval);
  }, []);

  const getNextBadge = (streak: number) => {
    const badgeMilestones = [3, 7, 14, 30];
    return badgeMilestones.find((milestone) => milestone > streak) || null;
  };

  const calculateTimeLeft = () => {
    const now = dayjs();
    const endOfDay = dayjs().endOf("day");
    setTimeLeft(now.to(endOfDay, true));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">🔥 Sua Dashboard</h1>
        <Button
          onClick={logout}
          className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg transition duration-300"
        >
          Sair
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center text-lg animate-pulse">Carregando...</p>
      ) : streak !== null ? (
        <>
          {/* Streak com Animação */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-white border border-gray-200 rounded-xl text-center shadow-lg"
          >
            <h2 className="text-lg font-bold text-gray-900">🔥 Streak Atual</h2>
            <p className="text-4xl font-semibold text-gray-900">{streak} dias</p>
            {nextBadge && (
              <>
                <p className="mt-2 text-sm text-gray-600">
                  🔜 Faltam <span className="font-bold">{nextBadge - streak}</span> dias para um novo prêmio!
                </p>
                <Progress value={(streak / nextBadge) * 100} className="mt-2" />
              </>
            )}
          </motion.div>

          {/* Meta Diária */}
          <div className="p-5 bg-gray-100 border border-gray-300 rounded-xl text-center mt-4 shadow-md">
            <h2 className="text-lg font-bold text-gray-900">🎯 Meta Diária</h2>
            <p className="text-sm text-gray-700">
              Você tem <span className="font-bold">{timeLeft}</span> para manter seu streak!
            </p>
          </div>

          {/* Botões para Histórico e Badges */}
          <div className="mt-6 flex gap-4">
            <Link href="/dashboard/history">
              <Button className="bg-gray-700 hover:bg-gray-900 text-white px-6 py-3 rounded-lg transition duration-300">
                📜 Histórico
              </Button>
            </Link>
            <Link href="/dashboard/badges">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-300">
                🏅 Seus prêmios
              </Button>
            </Link>
          </div>

          {/* Gráfico de Evolução do Streak */}
          <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900">📈 Evolução do Streak</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="streak" stroke="#2563eb" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center">Nenhum dado disponível.</p>
            )}
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center">Nenhum streak encontrado.</p>
      )}
    </div>
  );
}
