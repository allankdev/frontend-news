"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { Table } from "@/components/ui/table";

export default function AdminDashboardPage() {
  const { user } = useAuth();
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
    <div className="p-6">
      <h1 className="text-2xl font-bold">📊 Dashboard Administrativo</h1>
      <Table>
        <thead>
          <tr>
            <th>Posição</th>
            <th>Usuário</th>
            <th>Streak</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((reader, index) => (
            <tr key={reader.id}>
              <td>{index + 1}</td>
              <td>{reader.email}</td>
              <td>{reader.streak} dias 🔥</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
