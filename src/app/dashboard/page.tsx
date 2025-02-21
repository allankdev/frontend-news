"use client";

import { useEffect, useState } from "react";
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

type ChartDataType = { date: string; opens: number };

export default function UserDashboardPage() {
  const { user, logout } = useAuth();
  const [streak, setStreak] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextBadge, setNextBadge] = useState<number | null>(null);
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    fetchStreak();
  }, []); 

  useEffect(() => {
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchStreak = async () => {
    try {
      const response = await api.get("/streaks/me");
      if (response.data && typeof response.data.streak === "number") {
        setStreak(response.data.streak);
        setNextBadge(getNextBadge(response.data.streak));

        if (response.data.history) {
          setChartData(
            response.data.history.map((entry: { date: string; streak: number }) => ({
              date: dayjs(entry.date).format("DD/MM"),
              opens: entry.streak,
            }))
          );
        } else {
          setChartData([
            { date: "Últimos 7 dias", opens: response.data.streak - 3 },
            { date: "Últimos 30 dias", opens: response.data.streak },
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
  };

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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-white border border-gray-200 rounded-xl text-center shadow-lg"
          >
            <h2 className="text-lg font-bold text-gray-900">🔥 Streak Atual</h2>
            <p className="text-4xl font-semibold text-gray-900">{streak} dias</p>
          </motion.div>
        </>
      ) : (
        <p className="text-gray-500 text-center">Nenhum streak encontrado.</p>
      )}
    </div>
  );
}
