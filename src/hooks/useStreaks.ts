import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function useStreaks() {
  const [streak, setStreak] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStreak() {
      try {
        const response = await api.get("/streaks/me");
        setStreak(response.data.streak);
      } catch (error) {
        console.error("Erro ao buscar streak", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStreak();
  }, []);

  return { streak, loading };
}
