// Shared Framer Motion variants — reused across pages so entrance
// animations stay consistent instead of every page inventing its
// own timing/easing. Keep this file the single source of truth.

// Ease curve: quick start, gentle settle. Avoid spring() for page
// entrances — springs read as "bouncy app", not "calm finance tool".
const EASE = [0.22, 1, 0.36, 1];

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