import { SessionGate } from "@/components/session-gate";
import { StrategyApp } from "@/components/strategy-app";

export default function Home() {
  return (
    <SessionGate>
      <StrategyApp />
    </SessionGate>
  );
}
