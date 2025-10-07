import { vectorToHSL } from "./color";

export const circleOfFifths = [
    "C",
    "G",
    "D",
    "A",
    "E",
    "B",
    "F#",
    "C#",
    "G#",
    "D#",
    "A#",
    "F",
];

export function noteToAngle(note: string): number {
    const index = circleOfFifths.findIndex(n => n === note);

    if (index === -1) {
        throw new Error(`Note ${note} not found in circle of fifths`);
    }

    return (index / circleOfFifths.length) * 2 * Math.PI;
}

export function notesToVector(notes: string[]): { x: number; y: number } {
    const vectors = notes.map(note => {
        const angle = noteToAngle(note);
        return {
            x: Math.cos(angle),
            y: Math.sin(angle),
        };
    });
    return vectors.reduce(
        (sum, vector) => ({
            x: sum.x + vector.x,
            y: sum.y + vector.y,
        }),
        { x: 0, y: 0 }
    );
}

export function noteToColor(note: string): string {
    const angle = noteToAngle(note);
    const hue = (angle / (2 * Math.PI)) * 360;
    return `hsl(${hue}, 100%, 50%)`;
}

/**
 * Converts an array of musical note names to a color represented as an HSL string.
 *
 * This function first transforms the input notes into a vector representation,
 * then maps that vector to a corresponding HSL color value.
 *
 * @param notes - An array of strings representing musical note names (e.g., ["C", "E", "G"]).
 * @returns A string representing the color in HSL format.
 */
export function notesToColor(notes: string[]): string {
    const vector = notesToVector(notes);
    return vectorToHSL(vector);
}
