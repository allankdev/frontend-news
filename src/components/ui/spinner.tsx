"use client"

import { motion } from "framer-motion"

export function Spinner({ className }: { className?: string }) {
  return (
    <div className="flex items-center justify-center" role="status" aria-label="Loading">
      <motion.div
        className="relative size-6"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <motion.span
          className="absolute size-full rounded-full border-2 border-r-primary border-b-primary border-l-primary/30 border-t-primary/30"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: [0.45, 0, 0.55, 1],
          }}
        />
        <motion.span
          className="absolute size-4 inset-1 rounded-full border-2 border-r-primary border-b-primary border-l-primary/30 border-t-primary/30"
          animate={{ rotate: -360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: [0.45, 0, 0.55, 1],
          }}
        />
      </motion.div>
    </div>
  )
}