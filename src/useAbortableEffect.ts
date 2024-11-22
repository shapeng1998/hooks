import { useEffect, type EffectCallback, type DependencyList } from 'react';

/**
 * Aborts the effect when the component unmounts.
 * @param effect The effect to abort.
 * @param deps The dependencies of the effect.
 */
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
