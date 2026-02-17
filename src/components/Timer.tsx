import { useState, useEffect, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

const CYCLE_DURATION = 7 * 60 + 40; // 7 minutes 40 seconds in seconds

interface TimerProps {
  isActive: boolean;
  sessionStart?: number;
  currentCycle: number;
  sessionId?: Id<"sessions">;
}

export function Timer({ isActive, sessionStart, currentCycle, sessionId }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(CYCLE_DURATION);
  const [cycleStartTime, setCycleStartTime] = useState<number | null>(null);
  const incrementCycle = useMutation(api.sessions.incrementCycle);

  const calculateTimeLeft = useCallback(() => {
    if (!isActive || !sessionStart) return CYCLE_DURATION;

    const now = Date.now();
    const elapsed = Math.floor((now - sessionStart) / 1000);
    const cycleElapsed = elapsed % CYCLE_DURATION;
    return CYCLE_DURATION - cycleElapsed;
  }, [isActive, sessionStart]);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(CYCLE_DURATION);
      setCycleStartTime(null);
      return;
    }

    setCycleStartTime(Date.now());
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Check if cycle just completed
      if (newTimeLeft === CYCLE_DURATION && sessionId) {
        incrementCycle({ id: sessionId });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, sessionStart, calculateTimeLeft, sessionId, incrementCycle]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((CYCLE_DURATION - timeLeft) / CYCLE_DURATION) * 100;

  return (
    <div className="text-center">
      {/* Cycle indicator */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-amber-500/10 rounded-full mb-4 md:mb-6">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
        <span className="text-amber-500 font-medium text-xs md:text-sm">Cycle {currentCycle}</span>
      </div>

      {/* Timer display */}
      <div className="relative inline-block">
        {/* Circular progress */}
        <svg className="w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          <span className="text-white/30 text-xs md:text-sm mt-1 md:mt-2 uppercase tracking-wider">
            {isActive ? "remaining" : "ready"}
          </span>
        </div>
      </div>

      {/* Status message */}
      <p className="mt-4 md:mt-6 text-white/40 text-xs md:text-sm">
        {isActive ? (
          <>Time to write your next tweet!</>
        ) : (
          <>Start a session to begin writing</>
        )}
      </p>
    </div>
  );
}
