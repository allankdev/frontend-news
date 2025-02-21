import type { Metadata } from "next";
import "./globals.css"; // ✅ Caminho correto para dentro de `app`
import { AuthProvider } from "@/providers/AuthProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="pt">
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}
