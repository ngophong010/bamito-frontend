"use client";
import { useEffect, useState } from "react";

/**
 * A custom React hook that debounces a value.
 * It delays updating the output value until the input value has stopped changing for a specified time.
 * @template T The type of the value to be debounced.
 * @param {T} value The value to debounce.
 * @param {number} delay The debounce delay in milliseconds.
 * @returns {T} The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Return a cleanup function that will be called:
    // 1. When the component unmounts.
    // 2. Before the effect runs again if the 'value' or 'delay' dependencies change.
    // This prevents the old timer from firing if the value changes quickly.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run the effect if the value or delay changes

  return debouncedValue;
}
