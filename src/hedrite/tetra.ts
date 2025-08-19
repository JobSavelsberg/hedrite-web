import gsap from "gsap";
import * as THREE from "three";
import type { IInteractable } from "./interaction";
import type { Sound } from "./sound";

export class Tetra implements IInteractable {
    private isHovered = false;

    public mesh: THREE.Mesh;
    private material: THREE.MeshLambertMaterial;
    private readonly color = 0xcfb9f5;
    private readonly emissiveColor = 0xffffff;
    private readonly emissiveIntensity = 0.05;

    constructor(private readonly sound: Sound) {
        // Create tetrahedron geometry and material
        const geometry = new THREE.TetrahedronGeometry(1);
        this.material = new THREE.MeshLambertMaterial({
            color: this.color,
            emissive: this.emissiveColor,
            emissiveIntensity: 0, // Start out as 0 (not hovering)
        });

        // Create tetrahedron mesh
        this.mesh = new THREE.Mesh(geometry, this.material);

        // Create a simple up and down animation using GSAP
        gsap.to(this.mesh.position, {
            y: 0.1,
            duration: 2,
            ease: "sine.inOut", // Smooth easing
            yoyo: true,
            repeat: -1, // Infinite loop
        });
    }

    public getObject3D(): THREE.Mesh {
        return this.mesh;
    }

    public setHover(
        isHovered: boolean,
        intersectionPoint: THREE.Vector3
    ): void {
        if (this.isHovered !== isHovered) {
            this.isHovered = isHovered;
            if (isHovered) {
                this.onHover(intersectionPoint);
            }
            if (!isHovered) {
                this.onUnhover();
            }
        }
    }

    public onHover(intersectionPoint: THREE.Vector3): void {
        this.material.emissiveIntensity = this.emissiveIntensity;
    }

    public onUnhover(): void {
        this.material.emissiveIntensity = 0;
    }

    public async onPointerDown(point: THREE.Vector3): Promise<void> {
        this.sound.playRandomSinePluck();

        const originalColor = this.color;
        const flashColor = 0x00ff00;

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
    }
}
