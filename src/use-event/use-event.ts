import { useCallback, useRef } from 'react';

type AnyFunction = (...args: any[]) => any;

export function useEvent<TCallback extends AnyFunction>(
  callback: TCallback,
): TCallback {
  const callbackRef = useLatestRef(callback);

  return useCallback(
    (...args: any[]) => callbackRef.current(...args),
    [callbackRef],
  ) as TCallback;
}

function useLatestRef<TValue>(value: TValue) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
