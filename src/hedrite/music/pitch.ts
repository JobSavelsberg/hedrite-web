// A pitch is essentially just a frequency with a fancy name
// Note: the term 'note' usually implies it has a place in time and a duration
// Usually denoted by "C2, F#5, Bb3" etc.
// The western chromatic scale is defined by 11 pitches that repeat, A1,...,G#1,A2,...
// where A4 = 440Hz
// The MIDI spec says pitch number 21 = A0 = the lowest key on a piano
// PitchString = "A4" preferred representation (hence toFrequency uses string as argument)
// PitchNumber = "69"

export class Pitch {
    private static readonly pitchStringRegex = new RegExp(
        /^[A-Ga-g](?:#|b)?\d$/
    );

    /**
     * The MIDI number of the pitch in string format. E.g. "A4" => 69
     * @param pitchString the pitch in string format. E.g. "C#4"
     * @returns the MIDI number of the pitch
     */
    public static toPitchNumber(pitchString: string): number {
        if (!this.pitchStringRegex.test(pitchString)) {
            throw new Error(`Invalid pitch string: ${pitchString}`);
        }
        const note = pitchString.slice(0, -1).toUpperCase();
        const octave = parseInt(pitchString.slice(-1), 10);
        const noteToMidi: { [key: string]: number } = {
            C: 0,
            "C#": 1,
            D: 2,
            "D#": 3,
            E: 4,
            F: 5,
            "F#": 6,
            G: 7,
            "G#": 8,
            A: 9,
            "A#": 10,
            B: 11,
        };
        return noteToMidi[note] + octave * 12 + 21;
    }

    /**
     * Returns the frequency for a given pitch string
     * @param pitchString the pitch in string format. E.g. "C#4"
     */
    public static toFrequency(pitchString: string): number {
        return this.numberToFrequency(this.toPitchNumber(pitchString));
    }

    /**
     * Returns the frequency for a given midi note
     * @param pitchNumber the pitch in MIDI note format (A4 = 69)
     */
    public static numberToFrequency(pitchNumber: number): number {
        const A440 = 440; // Frequency of A4
        const A4 = 69; // MIDI note number for A4
        const semitoneRatio = Math.pow(2, 1 / 12);
        return A440 * Math.pow(semitoneRatio, pitchNumber - A4);
    }
}
