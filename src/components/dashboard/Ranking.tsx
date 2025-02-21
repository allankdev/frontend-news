"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Ranking() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    async function fetchRanking() {
      try {
        const response = await api.get("/admin/ranking");
        setRanking(response.data.ranking);
      } catch (error) {
        console.error("Erro ao buscar ranking", error);
      }
    }
    fetchRanking();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">🏆 Ranking dos Leitores</h2>
      {ranking.length > 0 ? (
        <ul className="space-y-2">
          {ranking.map((user, index) => (
            <li key={user.id} className="flex justify-between p-2 border rounded-lg">
              <span className="font-semibold">{index + 1}. {user.name}</span>
              <span>{user.streak} dias 🔥</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Carregando ranking...</p>
      )}
    </div>
  );
}
