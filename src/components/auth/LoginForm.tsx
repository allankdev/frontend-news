"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Credenciais inválidas!");
    } else {
      window.location.href = "/dashboard"; // 🔥 Redireciona após login
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="p-2 border border-gray-300 rounded"
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="p-2 border border-gray-300 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Entrar
      </button>
    </form>
  );
}
