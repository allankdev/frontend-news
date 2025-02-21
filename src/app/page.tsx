"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F8F8] text-[#240E0B] px-6">
      {/* Logo e Título */}
      <div className="flex flex-col items-center mb-12">
        <div className="flex items-center space-x-3">
          {/* Nova xícara de café estilizada */}
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 22h32v18a10 10 0 01-10 10H26a10 10 0 01-10-10V22z" fill="#D6D1CD" />
            <path d="M48 26h3a6 6 0 110 12h-3" stroke="#615A5A" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="32" cy="22" rx="16" ry="5" fill="#3E2723" />
            <path d="M16 22v18a10 10 0 0010 10h12a10 10 0 0010-10V22" stroke="#615A5A" strokeWidth="2" />
            <path d="M24 14c0-2 2-4 8-4s8 2 8 4" stroke="#FFCE04" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h1 className="text-5xl font-extrabold text-[#FFCE04] tracking-wide">the news</h1>
        </div>
      </div>

      {/* Mensagem Principal */}
      <p className="text-[#240E0B] text-lg text-center max-w-lg leading-relaxed">
        Mantenha sua leitura em dia e conquiste recompensas exclusivas! 🚀
      </p>

      {/* Botão de Acesso */}
      <Link href="/login">
        <button className="mt-6 px-10 py-4 bg-[#FFCE04] text-[#000000] font-bold rounded-full text-lg shadow-md hover:bg-[#E5B700] transition duration-300">
          Acessar
        </button>
      </Link>

      {/* Rodapé Minimalista */}
      <div className="absolute bottom-8 text-sm text-[#615A5A]">
        <p>© 2025 The News. Todos os direitos reservados.</p>
      </div>
    </div>
  );
}
