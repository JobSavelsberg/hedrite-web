import gsap from "gsap";
import * as THREE from "three";

export class Tetra {
    public mesh: THREE.Mesh;

    constructor() {
        // Create tetrahedron geometry and material
        const geometry = new THREE.TetrahedronGeometry(1);
        const material = new THREE.MeshLambertMaterial({
            color: 0xaaaaaa, // Light gray color
        });

        // Create tetrahedron mesh
        this.mesh = new THREE.Mesh(geometry, material);

        // Create a simple up and down animation using GSAP
        gsap.to(this.mesh.position, {
            y: 0.5,
            duration: 2,
            ease: "sine.inOut", // Smooth easing
            yoyo: true,
            repeat: -1, // Infinite loop
        });
    }
}
