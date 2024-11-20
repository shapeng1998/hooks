import { useEffect, useState } from 'react';

/**
 * Debounces a state update.
 * @param state - The state to debounce.
 * @param delay - The delay in milliseconds.
 * @returns The debounced state.
 */
export const useDebouncedState = <TState>(
  state: TState,
  delay: number,
): TState => {
  const [debouncedState, setDebouncedState] = useState(state);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedState(state);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [state, delay]);

  return debouncedState;
};
