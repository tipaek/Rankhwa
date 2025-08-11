import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

const EVENTS = {
  fetchStart: 'app:fetch:start',
  fetchEnd: 'app:fetch:end',
  coldStartShow: 'app:coldstart:show',
  coldStartHide: 'app:coldstart:hide',
} as const;

/**
 * Shows a thin top progress bar while any request is in flight,
 * and a one-time "Waking up backend…" overlay if the first request is slow.
 */
export const GlobalLoading: React.FC = () => {
  const [inFlight, setInFlight] = useState(0);
  const [showCold, setShowCold] = useState(false);

  useEffect(() => {
    const onStart = () => setInFlight((n) => n + 1);
    const onEnd = () => setInFlight((n) => Math.max(0, n - 1));
    const onColdShow = () => setShowCold(true);
    const onColdHide = () => setShowCold(false);

    document.addEventListener(EVENTS.fetchStart, onStart as EventListener);
    document.addEventListener(EVENTS.fetchEnd, onEnd as EventListener);
    document.addEventListener(EVENTS.coldStartShow, onColdShow as EventListener);
    document.addEventListener(EVENTS.coldStartHide, onColdHide as EventListener);
    return () => {
      document.removeEventListener(EVENTS.fetchStart, onStart as EventListener);
      document.removeEventListener(EVENTS.fetchEnd, onEnd as EventListener);
      document.removeEventListener(EVENTS.coldStartShow, onColdShow as EventListener);
      document.removeEventListener(EVENTS.coldStartHide, onColdHide as EventListener);
    };
  }, []);

  return (
    <>
      {/* top progress bar */}
      <div
        className={cn(
          'fixed left-0 top-0 h-0.5 w-full z-[10000] transition-opacity',
          inFlight > 0 ? 'opacity-100' : 'opacity-0'
        )}
        aria-hidden
      >
        <div className="h-full w-[30%] animate-[progress_1.2s_ease-in-out_infinite] bg-primary" />
      </div>

      {/* cold start overlay */}
      {showCold && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <div className="rounded-md border border-border bg-card px-4 py-3 shadow">
            <p className="text-sm">
              Waking up backend service… This first load can take a moment.
            </p>
          </div>
        </div>
      )}

      {/* local keyframes for the bar */}
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); width: 20%; }
          50% { transform: translateX(60%); width: 35%; }
          100% { transform: translateX(120%); width: 20%; }
        }
      `}</style>
    </>
  );
};
