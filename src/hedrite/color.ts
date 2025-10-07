/**
 * Converts a 2D vector to an HSL color string.
 *
 * The vector's angle determines the hue (0-360 degrees), and its magnitude determines the saturation (clamped between 20% and 100%).
 * The lightness is fixed at 50%.
 *
 * @param vector - An object with `x` and `y` properties representing the vector's coordinates.
 * @returns An HSL color string in the format `hsl(hue, saturation%, 50%)`.
 */
export function vectorToHSL(vector: { x: number; y: number }): string {
    const radius = Math.sqrt(vector.x ** 2 + vector.y ** 2);
    const angle = Math.atan2(vector.y, vector.x);
    const hue = (((angle + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI)) * 360;
    const saturation = Math.min(100, Math.max(20, radius * 100));
    return `hsl(${hue.toFixed(0)}, ${saturation.toFixed(0)}%, 50%)`;
}
