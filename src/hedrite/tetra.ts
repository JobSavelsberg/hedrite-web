import gsap from "gsap";
import * as THREE from "three";
import type { IInteractable } from "./interaction";
import type { Sound } from "./sound";
import { DebugHelper } from "./debugHelper";
import { TetraMesh } from "./tetraMesh";

export class Tetra implements IInteractable {
    private isHovered = false;

    private material: THREE.MeshLambertMaterial;
    private readonly color = 0xcfb9f5;
    private readonly emissiveColor = 0xffffff;
    private readonly emissiveIntensity = 0.05;

    public mesh: TetraMesh;

    private notes: string[] = ["C4", "E4", "G4", "B4"];

    constructor(
        private readonly sound: Sound,
        private onAttachTetra: (tetra: Tetra) => void,
        private onPlayTetra: (tetra: Tetra) => void
    ) {
        // Create tetrahedron geometry and material
        this.mesh = TetraMesh.CreateWithEdgeLength(1);
        this.material = new THREE.MeshLambertMaterial({
            color: this.color,
            emissive: this.emissiveColor,
            emissiveIntensity: 0,
        });

        this.mesh.mesh.material = this.material;
    }

    public getObject3D(): THREE.Mesh {
        return this.mesh.mesh;
    }

    public setHover(
        isHovered: boolean,
        intersection: THREE.Intersection
    ): void {
        if (this.isHovered !== isHovered) {
            this.isHovered = isHovered;
            if (isHovered) {
                this.onHover();
            }
            if (!isHovered) {
                this.onUnhover();
            }
        }
    }

    public onHover(): void {
        this.material.emissiveIntensity = this.emissiveIntensity;
    }

    public onUnhover(): void {
        this.material.emissiveIntensity = 0;
    }

    public async onPointerDown(
        intersection?: THREE.Intersection
    ): Promise<void> {
        this.sound.playChord(this.notes);

        const originalColor = this.color;
        const flashColor = 0xffffff;

        // Cancel any existing flash animation
        gsap.killTweensOf(this.material.color);

        // Create a timeline for the flash effect
        gsap.timeline()
            .to(this.material.color, {
                r: ((flashColor >> 16) & 255) / 255,
                g: ((flashColor >> 8) & 255) / 255,
                b: (flashColor & 255) / 255,
                duration: 0.1,
                ease: "power2.out",
            })
            .to(this.material.color, {
                r: ((originalColor >> 16) & 255) / 255,
                g: ((originalColor >> 8) & 255) / 255,
                b: (originalColor & 255) / 255,
                duration: 0.8,
                ease: "power2.out",
            });

        this.onPlayTetra(this);
    }

    public onContextMenu(intersection: THREE.Intersection): void {
        const face = intersection.face;
        if (face) {
            const newTetra = Tetra.FromTetraFace(this, face);
            this.onAttachTetra(newTetra);
        }
    }

    public static FromTetraFace(fromTetra: Tetra, face: THREE.Face): Tetra {
        const newTetra = new Tetra(
            fromTetra.sound,
            fromTetra.onAttachTetra,
            fromTetra.onPlayTetra
        );

        // Construct new tetra from clicked face
        const faceIndex = TetraMesh.getFaceIndex(face);
        const faceNotes = fromTetra.notes.filter(
            (note, index) => index != faceIndex
        );
        newTetra.notes = [
            ...faceNotes,
            this.findFittingNote(faceNotes, fromTetra.notes),
        ];
        const mesh = TetraMesh.CreateOnFace(fromTetra.mesh, face);
        newTetra.mesh = mesh;
        newTetra.mesh.mesh.material = newTetra.material;

        newTetra.onPointerDown();
        // Rotate the new tetrahedron to align with the face normal
        return newTetra;
    }

    private static findFittingNote(
        notes: string[],
        avoidNotes: string[]
    ): string {
        // Notes to circle of fifth indexes
        const circleOfFitfths = [
            "A",
            "E",
            "B",
            "F#",
            "C#",
            "G#",
            "D#",
            "A#",
            "F",
            "C",
            "G",
            "D",
        ];

        // Remove the number from the note
        const pureNotes = notes.map(note => note.substring(0, note.length - 1));
        const pureAvoidNotes = avoidNotes.map(note =>
            note.substring(0, note.length - 1)
        );

        // Get indexes of notes
        const indexes = pureNotes.map(note =>
            circleOfFitfths.findIndex(c => c === note)
        );

        // Turn into vectors on a circle
        const vectors = indexes.map(index => {
            const angle = (index / circleOfFitfths.length) * 2 * Math.PI;
            return {
                x: Math.cos(angle),
                y: Math.sin(angle),
            };
        });

        // Calculate the average vector
        const avgVector = vectors.reduce(
            (sum, vector) => ({
                x: sum.x + vector.x,
                y: sum.y + vector.y,
            }),
            { x: 0, y: 0 }
        );

        // Normalize the average vector
        const magnitude = Math.sqrt(
            avgVector.x * avgVector.x + avgVector.y * avgVector.y
        );
        if (magnitude === 0) return circleOfFitfths[0]; // fallback

        const normalizedVector = {
            x: avgVector.x / magnitude,
            y: avgVector.y / magnitude,
        };

        // Find the closest note on the circle that is not yet used
        // Convert normalized vector back to angle
        const targetAngle = Math.atan2(normalizedVector.y, normalizedVector.x);
        let bestIndex = -1;
        let bestDistance = Infinity;

        // Find the closest unused note
        for (let i = 0; i < circleOfFitfths.length; i++) {
            const note = circleOfFitfths[i];
            if (![...pureNotes, ...pureAvoidNotes].includes(note)) {
                const noteAngle = (i / circleOfFitfths.length) * 2 * Math.PI;
                // Calculate angular distance (considering circular nature)
                let distance = Math.abs(targetAngle - noteAngle);
                if (distance > Math.PI) {
                    distance = 2 * Math.PI - distance;
                }

                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestIndex = i;
                }
            }
        }

        // Return the best note with octave 4 (fallback if no unused note found)
        return bestIndex >= 0 ? circleOfFitfths[bestIndex] + "4" : "C4";
    }
}
