interface StreakCardProps {
  streak: number; // 🔥 Agora garantimos que `streak` é um número
}

export function StreakCard({ streak }: StreakCardProps) {
  return (
    <div className="border p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold">🔥 Streak Atual</h2>
      <p className="text-lg">{streak} dias consecutivos!</p>
    </div>
  );
}
