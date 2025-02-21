"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user } = useAuth(); // Usa nosso novo sistema JWT
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard"); // Redireciona para o dashboard se estiver autenticado
    } else {
      router.push("/login"); // Senão, vai para o login
    }
  }, [user, router]);

  return <p className="text-center mt-10 text-gray-600">Carregando...</p>;
}
