"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

export default function BadgesPage() {
  const { user } = useAuth();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await api.get("/badges/mine");
      if (Array.isArray(response.data)) {
        setBadges(
          response.data.map((badge) => ({
            id: badge.id,
            name: badge.badgeType,
            earnedAt: dayjs(badge.earnedAt).format("DD/MM/YYYY"),
          }))
        );
      }
    } catch (error) {
      console.error("Erro ao buscar badges", error);
      setError("Erro ao carregar seus badges.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">🏅 Seus Badges</h1>
        <Link href="/dashboard">
          <Button className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg transition duration-300">
            ← Voltar
          </Button>
        </Link>
      </div>

      {/* Status de Carregamento e Erro */}
      {loading ? (
        <p className="text-gray-500 text-center text-lg animate-pulse">Carregando...</p>
      ) : error ? (
        <p className="text-red-500 text-center text-lg">{error}</p>
      ) : badges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="p-5 bg-white/30 backdrop-blur-lg border border-gray-300/50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <h2 className="font-bold text-lg text-gray-900">{badge.name}</h2>
              <p className="text-sm text-gray-600">🏆 Conquistado em {badge.earnedAt}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center text-lg">Você ainda não ganhou nenhum badge.</p>
      )}
    </div>
  );
}
