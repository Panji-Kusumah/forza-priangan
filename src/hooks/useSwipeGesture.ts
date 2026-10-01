import { useEffect, useRef, RefObject } from 'react';

interface UseSwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  velocity?: number;
  enabled?: boolean;
}

/**
 * Custom hook wrapping Hammer.js for responsive and smooth touch swipe navigation.
 * Maps 'swipeleft' to Next Page and 'swiperight' to Previous Page,
 * while respecting vertical scrolling and exempting form controls.
 */
export function useSwipeGesture<T extends HTMLElement>(
  targetRef: RefObject<T | null>,
  options: UseSwipeGestureOptions
) {
  const onSwipeLeftRef = useRef(options.onSwipeLeft);
  onSwipeLeftRef.current = options.onSwipeLeft;

  const onSwipeRightRef = useRef(options.onSwipeRight);
  onSwipeRightRef.current = options.onSwipeRight;

  const enabled = options.enabled !== false;
  const threshold = options.threshold ?? 20;
  const velocity = options.velocity ?? 0.22;

  useEffect(() => {
    const element = targetRef.current;
    if (!element || !enabled) return;

    let cancelled = false;
    let hammer: HammerManager | undefined;

    void import('hammerjs').then(({ default: Hammer }) => {
      if (cancelled) return;

      hammer = new Hammer(element, { touchAction: 'pan-y' });
      hammer.get('swipe').set({
        direction: Hammer.DIRECTION_HORIZONTAL,
        threshold,
        velocity,
      });

      const handleSwipeLeft = (e: HammerInput) => {
        const target = e.target as HTMLElement | null;
        if (target && target.closest('input, textarea, select, button, a, form, label, [contenteditable="true"], [data-no-swipe]')) return;
        onSwipeLeftRef.current?.();
      };

      const handleSwipeRight = (e: HammerInput) => {
        const target = e.target as HTMLElement | null;
        if (target && target.closest('input, textarea, select, button, a, form, label, [contenteditable="true"], [data-no-swipe]')) return;
        onSwipeRightRef.current?.();
      };

      hammer.on('swipeleft', handleSwipeLeft);
      hammer.on('swiperight', handleSwipeRight);
    });

    return () => {
      cancelled = true;
      hammer?.destroy();
    };
  }, [targetRef, enabled, threshold, velocity]);
}
