import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

// Shared Framer Motion variants — reused across pages so entrance
// animations stay consistent instead of every page inventing its
// own timing/easing. Keep this file the single source of truth.

// Ease curve: quick start, gentle settle. Avoid spring() for page
// entrances — springs read as "bouncy app", not "calm finance tool".
export const EASE = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

export const slideIn = (direction = "left", distance = 24) => ({
  hidden: { opacity: 0, x: direction === "left" ? -distance : distance },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
});

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

// once: true — reveal on the way down, never re-trigger scrolling
// back up. Re-triggering on every scroll direction reads as gimmicky
// on a marketing page, not polished.
export const viewportOnce = { once: true, margin: "-80px" };

/**
 * Animates a number counting up (or down) to `target` whenever it
 * changes, formatting each intermediate frame with `format`.
 *
 * First mount always starts from 0 — that's the "numbers land on
 * page load" effect. Later updates (e.g. the underlying data
 * changes while the page is still open) animate from the previous
 * value instead, which is the correct behavior for both cases.
 *
 * Respects prefers-reduced-motion by jumping straight to the final
 * value with no animation.
 */
export function useCountUp(
  target,
  { duration = 0.9, format = (n) => Math.round(n).toLocaleString("en-IN") } = {}
) {
  const prevTarget = useRef(0);
  const [display, setDisplay] = useState(format(0));
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplay(format(target));
      prevTarget.current = target;
      return;
    }

    const controls = animate(prevTarget.current, target, {
      duration,
      ease: EASE,
      onUpdate: (v) => setDisplay(format(v)),
    });

    prevTarget.current = target;
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return display;
}