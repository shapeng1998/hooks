import { useEffect, type EffectCallback, type DependencyList } from 'react';

export const useAbortableEffect = (
  effect: (signal: AbortSignal) => ReturnType<EffectCallback>,
  deps?: DependencyList,
) => {
  useEffect(() => {
    const controller = new AbortController();
    const cleanup = effect(controller.signal);

    return () => {
      controller.abort();
      cleanup?.();
    };
  }, deps);
};