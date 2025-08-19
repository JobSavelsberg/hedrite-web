import gsap from "gsap";
import * as THREE from "three";
import type { IInteractable } from "./interaction";

export class Tetra implements IInteractable {
    private isHovered = false;

    public mesh: THREE.Mesh;
    private material: THREE.MeshLambertMaterial;

    constructor() {
        // Create tetrahedron geometry and material
        const geometry = new THREE.TetrahedronGeometry(1);
        this.material = new THREE.MeshLambertMaterial({
            color: 0xffffff, // White color
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
        this.material.color.set(0xff0000);
    }

    public onUnhover(): void {
        this.material.color.set(0xaaaaaa);
    }

    public onClick(point: THREE.Vector3): void {
        console.log("Clicked at:", point);
    }
}
