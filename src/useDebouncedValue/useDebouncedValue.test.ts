import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial state immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 1000));
    expect(result.current).toBe('initial');
  });

  it('should debounce state updates', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 1000),
      {
        initialProps: { value: 'initial' },
      },
    );

    // Initial state
    expect(result.current).toBe('initial');

    // Update the state
    rerender({ value: 'updated' });
    expect(result.current).toBe('initial'); // Should still be initial

    // Fast forward time by 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('initial'); // Should still be initial

    // Fast forward remaining time
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('updated'); // Should now be updated
  });

  it('should cancel previous debounce on new updates', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 1000),
      {
        initialProps: { value: 'initial' },
      },
    );

    // First update
    rerender({ value: 'update1' });

    // Advance timer partially
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Second update before first one completes
    rerender({ value: 'update2' });

    // Advance timer partially again
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('initial'); // Should still be initial

    // Complete the second update's delay
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('update2');
  });

  it('should handle different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: 'initial', delay: 1000 },
      },
    );

    // Update with shorter delay
    rerender({ value: 'updated', delay: 500 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });
});
