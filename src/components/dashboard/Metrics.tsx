"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Metrics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await api.get("/admin/stats");
        setData(response.data.metrics);
      } catch (error) {
        console.error("Erro ao buscar métricas", error);
      }
    }
    fetchMetrics();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">📊 Engajamento das Newsletters</h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="opens" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">Carregando métricas...</p>
      )}
    </div>
  );
}
