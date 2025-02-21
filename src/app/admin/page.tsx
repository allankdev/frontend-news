"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";

// Definição da interface para os itens do ranking
interface Reader {
  id: string;
  email: string;
  streak: number;
}

export default function AdminDashboardPage() {
  const {  logout } = useAuth();
  const [ranking, setRanking] = useState<Reader[]>([]);
  const [, setStats] = useState(null);
  const [chartData, setChartData] = useState<{ date: string; opens: number }[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState("");

  // Estados dos filtros
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [selectedNewsletter, setSelectedNewsletter] = useState("");
  const [selectedStreakStatus, setSelectedStreakStatus] = useState("");

  const fetchRanking = useCallback(async () => {
    try {
      const response = await api.get("/admin/ranking", {
        params: {
          period: selectedPeriod,
          newsletter: selectedNewsletter,
          streakStatus: selectedStreakStatus,
        },
      });
      setRanking(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar ranking", error);
      setError("Erro ao carregar ranking.");
    }
  }, [selectedPeriod, selectedNewsletter, selectedStreakStatus]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get("/admin/stats", {
        params: {
          period: selectedPeriod,
          newsletter: selectedNewsletter,
        },
      });
      setStats(response.data || {});

      if (response.data?.daily_open_rate) {
        setChartData(response.data.daily_open_rate);
      } else if (response.data?.totalNewslettersOpened) {
        const totalOpens = response.data.totalNewslettersOpened;
        const days = parseInt(selectedPeriod, 10) || 30;
        const averageOpens = Math.max(1, Math.floor(totalOpens / days));

        const simulatedData: { date: string; opens: number }[] = Array.from({ length: days }).map((_, i) => ({
          date: dayjs().subtract(days - i, "day").format("DD/MM"),
          opens: Math.max(1, averageOpens + Math.floor(Math.random() * 3)),
        }));

        setChartData(simulatedData);
      } else {
        setChartData([]);
      }
    } catch (error) {
      console.error("Erro ao buscar estatísticas", error);
      setError("Erro ao carregar estatísticas.");
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod, selectedNewsletter]);

  useEffect(() => {
    fetchRanking();
    fetchStats();
  }, [fetchRanking, fetchStats]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">📊 Dashboard Administrativo</h1>
        <Button onClick={logout} className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg">
          Sair
        </Button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-4 shadow-md rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">📅 Período</label>
          <select className="w-full p-2 border border-gray-300 rounded-md" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">📰 Newsletter</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Digite o nome da newsletter..." value={selectedNewsletter} onChange={(e) => setSelectedNewsletter(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">🔥 Status do Streak</label>
          <select className="w-full p-2 border border-gray-300 rounded-md" value={selectedStreakStatus} onChange={(e) => setSelectedStreakStatus(e.target.value)}>
            <option value="">Todos</option>
            <option value="active">Ativo</option>
            <option value="lost">Perdido</option>
          </select>
        </div>
      </div>

      {/* 📈 Gráfico de Evolução das Aberturas */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-lg font-bold mb-4 text-gray-900">📈 Evolução das Aberturas</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="opens" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center">Nenhum dado disponível para exibir.</p>
        )}
      </div>

      {/* 🏆 Ranking de Leitores */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-900">🏆 Ranking de Leitores</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 text-left">🏆 Posição</th>
              <th className="p-3 text-left">📧 Usuário</th>
              <th className="p-3 text-left">🔥 Streak</th>
            </tr>
          </thead>
          <tbody>
            {ranking.length > 0 ? (
              ranking.map((reader, index) => (
                <tr key={reader.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{reader.email}</td>
                  <td className="p-3 font-bold text-orange-600">{reader.streak} dias</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-3 text-center text-gray-500">Nenhum dado encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
