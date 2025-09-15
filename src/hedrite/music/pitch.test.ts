import { expect, test } from "vitest";
import { Pitch } from "./pitch";

test("pitch number 0 is 8.18", () => {
    expect(Pitch.numberToFrequency(0)).toBeCloseTo(8.18, 2);
});

test("pitch number 69 is 440", () => {
    expect(Pitch.numberToFrequency(69)).toBeCloseTo(440, 2);
});

test("pitch number 127 is 12543.85", () => {
    expect(Pitch.numberToFrequency(127)).toBeCloseTo(12543.85, 2);
});
