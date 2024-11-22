import { useEffect } from 'react';
import type { EffectCallback, DependencyList } from 'react';

export function useAbortableEffect(
  effect: (signal: AbortSignal) => ReturnType<EffectCallback>,
  deps?: DependencyList,
) {
  useEffect(() => {
    const controller = new AbortController();
    const cleanup = effect(controller.signal);

    return () => {
      controller.abort();
      cleanup?.();
    };
  }, deps);
}
