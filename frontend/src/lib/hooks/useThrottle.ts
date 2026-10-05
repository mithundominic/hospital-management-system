// Responsibility: Generic throttle hook for limiting function invocation frequency

import { useRef, useCallback, useEffect } from "react";

export const useThrottle = <T extends (...args: unknown[]) => void>(
  fn: T,
  limitMs: number = 300,
): T => {
  const lastRan = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fnRef = useRef<T>(fn);
  const lastArgsRef = useRef<Parameters<T> | null>(null);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const throttled = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRan.current >= limitMs) {
        lastRan.current = now;
        fnRef.current(...args);
      } else {
        lastArgsRef.current = args;
        if (!timeoutRef.current) {
          timeoutRef.current = setTimeout(() => {
            lastRan.current = Date.now();
            timeoutRef.current = null;
            if (lastArgsRef.current) {
              fnRef.current(...lastArgsRef.current);
              lastArgsRef.current = null;
            }
          }, limitMs - (now - lastRan.current));
        }
      }
    },
    [limitMs],
  );

  return throttled as unknown as T;
};
