import type { Metadata } from "next";
import { AuthProvider } from "@/providers/AuthProvider";
import "./globals.css"; // ✅ Certifique-se que este caminho está correto


export const metadata: Metadata = {
  title: "The News - Gamificação de Newsletters",
  description: "Acompanhe seus streaks e conquistas ao abrir nossas newsletters!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="pt">
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}
