import * as Tone from "tone";

export class Sound {
    private reverb: Tone.Reverb;
    private started = false;
    private readonly cMajor = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
    private disposed = false;

    private osc: Tone.Oscillator;
    private env: Tone.AmplitudeEnvelope;

    constructor() {
        this.reverb = new Tone.Reverb(2).toDestination();
        this.reverb.wet.value = 0.8;

        this.env = new Tone.AmplitudeEnvelope({
            attack: 0.02,
            decay: 1.5,
            sustain: 0,
            release: 0.2,
        }).connect(this.reverb);

        this.osc = new Tone.Oscillator("C4", "sine").connect(this.env).start();
    }

    public async init(): Promise<void> {
        await Tone.loaded();
    }

    public async playRandomSinePluck(): Promise<void> {
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

        const note =
            this.cMajor[Math.floor(Math.random() * this.cMajor.length)];
        this.osc.frequency.setValueAtTime(note, Tone.now());
        this.env.triggerAttackRelease(2);
    }

    public dispose(): void {
        if (this.disposed) {
            return;
        }

        this.disposed = true;
        this.osc.dispose();
        this.env.dispose();
        this.reverb.dispose();
    }
}
