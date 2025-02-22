"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { Spinner } from "@/components/ui/spinner"

export default function LoginPage() {
  const { login, user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardPath = user.role === "admin" ? "/admin" : "/dashboard"
      router.push(dashboardPath)
    }
  }, [isAuthenticated, user, router])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    try {
      await login(email, password)
      const dashboardPath = user?.role === "admin" ? "/admin" : "/dashboard"
      router.push(dashboardPath)
    } catch {
      setError("Credenciais inválidas")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      {/* Adicione o overlay de carregamento aqui */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-4 rounded-lg bg-white/10 p-8 text-white">
              <Spinner className="size-12" />
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                Autenticando...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-96 space-y-6 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800"
      >
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">🔐 Login</h2>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="text-center text-sm text-red-500">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="font-medium text-gray-700 dark:text-gray-200">📧 Email</label>
            <Input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="font-medium text-gray-700 dark:text-gray-200">🔑 Senha</label>
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="relative w-full" size="lg">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="spinner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <Spinner />
                </motion.div>
              ) : (
                <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Entrar
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </form>
      </motion.div>
    </div>
  )
}

