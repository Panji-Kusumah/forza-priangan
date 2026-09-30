/**
 * Paper Spring Physics Engine for Antique Parchment Turning.
 * Simulates real-world elasticity, binding friction, snap release,
 * and aerodynamic air cushioning based on page position in the book.
 */

export interface ParchmentPhysics {
  timingFunction: string;
  durationMs: number;
  midpointMs: number;
  snapIntensity: number;
  stackWeight: number;
  cssStyle: React.CSSProperties;
}

/**
 * Calculates dynamic spring-physics parameters and a custom cubic-bezier timing function
 * that adjusts based on the current page spread and flip direction.
 *
 * @param currentSpread - Current spread index (0 to totalSpreads - 1)
 * @param totalSpreads - Total number of spreads in the book
 * @param direction - Direction of flip ('next' or 'prev')
 */
export function getParchmentTurnPhysics(
  currentSpread: number,
  totalSpreads: number,
  direction: 'next' | 'prev'
): ParchmentPhysics {
  // Normalized position: 0 (front of book) to 1 (back of book)
  const pos = totalSpreads > 1 ? currentSpread / (totalSpreads - 1) : 0.5;

  // Stack thickness at the origin side:
  // When flipping 'next', page lifts from the RIGHT stack (thicker at start of book)
  // When flipping 'prev', page lifts from the LEFT stack (thicker at end of book)
  const stackWeight = direction === 'next' ? (1 - pos) : pos;

  // 1. Dynamic Cubic-Bezier Timing Function:
  // High stackWeight = thick stack with high binding grip -> crisp snap release (high initial slope + spring overshoot)
  // Low stackWeight = thin stack -> softer release with gentle air-cushioned landing
  const x1 = +(0.15 + (1 - stackWeight) * 0.08).toFixed(3); // 0.15 to 0.23
  const y1 = +(0.94 + stackWeight * 0.22).toFixed(3);       // 0.94 to 1.16 (snap release overshoot!)
  const x2 = +(0.20 + (1 - stackWeight) * 0.10).toFixed(3); // 0.20 to 0.30
  const y2 = +(1.02 + stackWeight * 0.07).toFixed(3);       // 1.02 to 1.09 (elastic spring settle)

  const timingFunction = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;

  // 2. Dynamic Duration:
  // Thicker leaves have slightly more inertia and air resistance: 600ms - 660ms
  const durationMs = Math.round(590 + stackWeight * 65);

  // 3. Dynamic Midpoint:
  // Due to the initial snap acceleration, 90° edge-on orientation is reached slightly before 50% time
  // Midpoint aligns precisely with the moment the turning sheet stands perpendicular to the eye
  const midpointMs = Math.round(durationMs * (0.47 - stackWeight * 0.04)); // ~265ms - 290ms

  // 4. Snap intensity factor (0.0 to 1.0)
  const snapIntensity = +(0.4 + stackWeight * 0.6).toFixed(2);

  // CSS variables and styles to dynamically feed into CSS animations
  const cssStyle: React.CSSProperties = {
    animationTimingFunction: timingFunction,
    animationDuration: `${durationMs}ms`,
    // Custom properties for keyframe interpolations
    ['--snap-factor' as string]: snapIntensity,
    ['--page-duration' as string]: `${durationMs}ms`,
    ['--page-bezier' as string]: timingFunction,
  };

  return {
    timingFunction,
    durationMs,
    midpointMs,
    snapIntensity,
    stackWeight,
    cssStyle,
  };
}
