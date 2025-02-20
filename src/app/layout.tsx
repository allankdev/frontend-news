import type { Metadata } from "next";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import "./globals.css";

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
