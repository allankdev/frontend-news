import { Card } from "@/components/ui/card";

export function StreakCard({ streak }: { streak: number }) {
  return (
    <Card className="p-6 flex flex-col items-center text-center">
      <h2 className="text-3xl font-bold">🔥 {streak} dias seguidos!</h2>
      <p className="text-gray-600 mt-2">Continue lendo para manter seu streak!</p>
    </Card>
  );
}
