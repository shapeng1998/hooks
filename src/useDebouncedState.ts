import { useEffect, useState } from 'react';

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
