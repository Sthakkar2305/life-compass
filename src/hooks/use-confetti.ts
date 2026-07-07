"use client";

import { useCallback } from "react";
import confetti from "canvas-confetti";

export function useConfetti() {
  return useCallback((colors = ["#2563EB", "#F59E0B", "#22C55E", "#FFFFFF"]) => {
    void confetti({
      particleCount: 120,
      spread: 68,
      startVelocity: 36,
      ticks: 180,
      origin: { y: 0.75 },
      colors
    });
  }, []);
}
