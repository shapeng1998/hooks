import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEvent } from './use-event';

describe('useEvent', () => {
  it('should return a stable function reference', () => {
    const callback = vi.fn();
    const { result, rerender } = renderHook(() => useEvent(callback));

    const firstCallback = result.current;
    rerender();
    const secondCallback = result.current;

    expect(firstCallback).toBe(secondCallback);
  });

  it('should maintain stable reference even when callback changes', () => {
    const { result, rerender } = renderHook(
      (props: { callback: () => void }) => useEvent(props.callback),
      {
        initialProps: { callback: vi.fn() },
      },
    );

    const firstCallback = result.current;

    // Change the callback prop
    rerender({ callback: vi.fn() });
    const secondCallback = result.current;

    expect(firstCallback).toBe(secondCallback);
  });

  it('should call the latest callback while maintaining stable reference', () => {
    const firstImpl = vi.fn();
    const secondImpl = vi.fn();

    const { result, rerender } = renderHook(
      (props: { cb: () => void }) => useEvent(props.cb),
      {
        initialProps: { cb: firstImpl },
      },
    );

    const stableCallback = result.current;

    // Call with first implementation
    stableCallback();
    expect(firstImpl).toHaveBeenCalledTimes(1);
    expect(secondImpl).not.toHaveBeenCalled();

    // Change implementation
    rerender({ cb: secondImpl });

    // Same callback reference should now call new implementation
    stableCallback();
    expect(firstImpl).toHaveBeenCalledTimes(1);
    expect(secondImpl).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments correctly while maintaining reference stability', () => {
    const callback = vi.fn();
    const { result, rerender } = renderHook(() => useEvent(callback));

    const stableCallback = result.current;
    stableCallback(1, 'test', true);

    rerender();
    const sameCallback = result.current;
    sameCallback(2, 'test2', false);

    expect(stableCallback).toBe(sameCallback);
    expect(callback).toHaveBeenNthCalledWith(1, 1, 'test', true);
    expect(callback).toHaveBeenNthCalledWith(2, 2, 'test2', false);
  });
});
