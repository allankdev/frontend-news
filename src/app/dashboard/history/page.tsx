"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { Table } from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]); // 🔥 Inicia como array vazio
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get("/readers/my-newsletters");
      setHistory(Array.isArray(response.data) ? response.data : []); // 🔥 Evita erro se a API não retornar array
    } catch (error) {
      console.error("Erro ao buscar histórico", error);
      setError("Erro ao carregar histórico.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">📜 Seu Histórico de Leituras</h1>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : history.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Newsletter</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.title}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-gray-500">Nenhuma leitura encontrada.</p>
      )}

      <div className="mt-6">
        <Link href="/dashboard">
          <Button className="bg-gray-500 text-white">Voltar</Button>
        </Link>
      </div>
    </div>
  );
}
