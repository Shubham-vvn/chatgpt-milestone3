import { useState, useEffect, useMemo } from 'react';

/**
 * Calculates accurate word count using Unicode-aware whitespace and alphanumeric boundaries.
 * Correctly handles multi-spaces, newlines, tabs, and punctuation.
 */
export function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;

  // Split on any whitespace sequence and filter to tokens with alphanumeric characters
  const tokens = trimmed.split(/\s+/).filter(word => /[\p{L}\p{N}]/u.test(word));
  return tokens.length;
}

/**
 * Hook to provide debounced word count and 15-word threshold status to avoid UI jitter.
 */
export function useWordCounter(text = '', threshold = 15, debounceMs = 120) {
  const [debouncedCount, setDebouncedCount] = useState(() => countWords(text));

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCount(countWords(text));
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [text, debounceMs]);

  const immediateCount = useMemo(() => countWords(text), [text]);

  return {
    wordCount: debouncedCount,
    immediateCount,
    isThresholdMet: debouncedCount >= threshold,
    threshold
  };
}
