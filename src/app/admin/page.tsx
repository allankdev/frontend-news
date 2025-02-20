"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      const response = await api.get("/admin/ranking");
      setRanking(response.data);
    } catch (error) {
      console.error("Erro ao buscar ranking", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Cabeçalho com botão de logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📊 Dashboard Administrativo</h1>
        <Button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Sair
        </Button>
      </div>

      {/* Tabela estilizada */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
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
                <tr
                  key={reader.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{reader.email}</td>
                  <td className="p-3 font-bold text-orange-600">{reader.streak} dias 🔥</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-3 text-center text-gray-500">
                  Nenhum dado encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
