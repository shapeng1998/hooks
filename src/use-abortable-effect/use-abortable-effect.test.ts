import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAbortableEffect } from './use-abortable-effect';

describe('useAbortableEffect', () => {
  it('should execute effect with abort signal', () => {
    const mockEffect = vi.fn();
    renderHook(() => useAbortableEffect(mockEffect));
    expect(mockEffect).toHaveBeenCalledTimes(1);
    expect(mockEffect.mock.calls[0]?.[0]).toBeInstanceOf(AbortSignal);
  });

  it('should call cleanup function on unmount', () => {
    const mockCleanup = vi.fn();
    const mockEffect = vi.fn().mockReturnValue(mockCleanup);

    const { unmount } = renderHook(() => useAbortableEffect(mockEffect));
    unmount();

    expect(mockCleanup).toHaveBeenCalledTimes(1);
  });

  it('should abort controller on unmount', () => {
    const mockEffect = vi.fn((signal: AbortSignal) => {
      return () => {
        expect(signal.aborted).toBe(true);
      };
    });

    const { unmount } = renderHook(() => useAbortableEffect(mockEffect));
    unmount();
  });

  it('should respect dependencies array', () => {
    const mockEffect = vi.fn();
    const { rerender } = renderHook(
      ({ dep }) => useAbortableEffect(mockEffect, [dep]),
      {
        initialProps: { dep: 1 },
      },
    );

    expect(mockEffect).toHaveBeenCalledTimes(1);

    // Rerender with same dependency
    rerender({ dep: 1 });
    expect(mockEffect).toHaveBeenCalledTimes(1);

    // Rerender with different dependency
    rerender({ dep: 2 });
    expect(mockEffect).toHaveBeenCalledTimes(2);
  });

  it('should handle async effects', async () => {
    const mockAsyncOperation = vi.fn();
    const mockEffect = vi.fn((signal: AbortSignal) => {
      Promise.resolve().then(() => {
        if (!signal.aborted) {
          mockAsyncOperation();
        }
      });
    });

    const { unmount } = renderHook(() => useAbortableEffect(mockEffect));

    // Effect should have been called
    expect(mockEffect).toHaveBeenCalledTimes(1);

    // Unmount before async operation completes
    unmount();

    // Wait for any pending promises
    await Promise.resolve();

    // Async operation should not have been called due to abort
    expect(mockAsyncOperation).not.toHaveBeenCalled();
  });

  it('should handle null cleanup function', () => {
    const mockEffect = vi.fn().mockReturnValue(null);

    const { unmount } = renderHook(() => useAbortableEffect(mockEffect));

    // Should not throw when unmounting
    expect(() => unmount()).not.toThrow();
  });
});
