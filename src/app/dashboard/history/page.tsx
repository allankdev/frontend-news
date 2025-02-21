"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

type HistoryItem = { date: Date; title: string };

export default function HistoryPage() {
  const {  } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get("/readers/my-newsletters");
      if (response.data?.newsletters) {
        setHistory(
          response.data.newsletters.map((news: { openedAt: string; resourceId: string }) => ({
            date: new Date(news.openedAt),
            title: news.resourceId,
          }))
        );
      }
    } catch (error) {
      console.error("Erro ao buscar histórico", error);
      setError("Erro ao carregar histórico.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">📜 Histórico de Leituras</h1>
        <Link href="/dashboard">
          <Button className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg transition duration-300">
            ← Voltar
          </Button>
        </Link>
      </div>

      <div className="p-5 bg-gray-100 border border-gray-300 rounded-xl text-center mb-6 shadow-lg">
        <h2 className="text-lg font-bold text-gray-900">📊 Total de Leituras</h2>
        <p className="text-3xl font-bold text-gray-900">{history.length}</p>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center text-lg animate-pulse">Carregando histórico...</p>
      ) : error ? (
        <p className="text-red-500 text-center text-lg">{error}</p>
      ) : history.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {history.map((item, index) => (
            <div
              key={index}
              className="p-5 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <p className="text-lg font-semibold text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-600">📅 {dayjs(item.date).format("DD/MM/YYYY")}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center text-lg">Nenhuma leitura encontrada.</p>
      )}
    </div>
  );
}
