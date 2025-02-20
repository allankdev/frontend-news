"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BadgesPage() {
  const { user } = useAuth();
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await api.get("/badges/mine");
      setBadges(response.data);
    } catch (error) {
      console.error("Erro ao buscar badges", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🏅 Seus Badges</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge, index) => (
          <div key={index} className="p-4 bg-yellow-100 border border-yellow-500 rounded-lg">
            <p className="font-bold">{badge.name}</p>
            <p className="text-sm">{badge.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link href="/dashboard">
          <Button className="bg-gray-500 text-white">Voltar</Button>
        </Link>
      </div>
    </div>
  );
}
