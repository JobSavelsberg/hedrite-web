import * as Tone from "tone";

export class Sound {
    private gain: Tone.Gain;
    private reverb: Tone.Reverb;
    private delay: Tone.PingPongDelay;
    private envs: Tone.AmplitudeEnvelope[] = [];
    private oscs: Tone.Oscillator[] = [];
    private readonly nrOscs = 4;

    private started = false;
    private readonly cMajor = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
    private disposed = false;

    constructor() {
        this.gain = new Tone.Gain(0.5).toDestination();

        this.reverb = new Tone.Reverb(2).connect(this.gain);
        this.reverb.wet.value = 0.8;

        this.delay = new Tone.PingPongDelay("4n", 0.5).connect(this.reverb);
        this.delay.wet.value = 0.3;
        this.delay.feedback.value = 0.4;

        for (let i = 0; i < this.nrOscs; i++) {
            const env = new Tone.AmplitudeEnvelope({
                attack: 0.005,
                decay: 4.5,
                sustain: 0,
                release: 0.2,
            }).connect(this.delay);
            this.envs.push(env);
        }

        for (let i = 0; i < this.nrOscs; i++) {
            const osc = new Tone.Oscillator("C4", "sine")
                .connect(this.envs[i])
                .start();
            this.oscs.push(osc);
        }
    }

    public async init(): Promise<void> {
        await Tone.loaded();
    }

    public async playSinePluck(note: string, oscIndex: number) {
        await this.initAudio();

        const now = Tone.now();
        this.oscs[oscIndex].frequency.setValueAtTime(note, now);
        this.envs[oscIndex].triggerAttackRelease(2);
    }

    public async playRandomSinePluck(): Promise<void> {
        const note =
            this.cMajor[Math.floor(Math.random() * this.cMajor.length)];
        this.oscs[0].frequency.setValueAtTime(note, Tone.now());
        this.envs[0].triggerAttackRelease(2);
    }

    public async playChord(notes: string[]): Promise<void> {
        await this.initAudio();

        const strumDelay = 0.1;
        const now = Tone.now();
        notes.forEach((note, index) => {
            const startTime = now + strumDelay * index;
            this.oscs[index].frequency.setValueAtTime(note, startTime);
            this.envs[index].triggerAttackRelease(2, startTime);
        });

        // Play bass note - one octave lower than the root note
        const bassNote = notes[0].replace(/\d/, match =>
            (parseInt(match) - 1).toString()
        );
        const bassStartTime = now;
        this.oscs[notes.length % this.nrOscs].frequency.setValueAtTime(
            bassNote,
            bassStartTime
        );
        this.envs[notes.length % this.nrOscs].triggerAttackRelease(
            2,
            bassStartTime
        );
    }

    private async initAudio(): Promise<void> {
        if (this.disposed) {
            return;
        }

        if (!this.started) {
            await Tone.start();
            this.started = true;
        }

        // Check if audio context is suspended (happens when window is minimized)
        if (Tone.context.state === "suspended") {
            await Tone.context.resume();
        }
    }

    public dispose(): void {
        if (this.disposed) {
            return;
        }

        this.disposed = true;
        this.reverb.dispose();
    }
}
