import * as THREE from "three";
import { gsap } from "gsap";
import { Camera } from "./camera";
import { Renderer } from "./renderer";

export type HedriteContext = {
    container: HTMLDivElement;
};

export class Hedrite {
    private scene: THREE.Scene;
    private camera: Camera;
    private renderer: Renderer;
    private tetra: THREE.Mesh;

    constructor(context: HedriteContext) {
        this.renderer = new Renderer(context.container);
        this.camera = new Camera(this.renderer.renderer);
        this.scene = new THREE.Scene();

        // Create tetrahedron geometry and material
        const geometry = new THREE.TetrahedronGeometry(1);
        const material = new THREE.MeshLambertMaterial({
            color: 0xaaaaaa, // Light gray color
        });

        // Create tetrahedron mesh
        this.tetra = new THREE.Mesh(geometry, material);
        this.scene.add(this.tetra);

        // Add lighting
        const directionalLight = new THREE.DirectionalLight("#fff", 3);
        directionalLight.position.set(-2, 2, 2);
        this.scene.add(directionalLight);

        // Add ambient light for better visibility
        const ambientLight = new THREE.AmbientLight("#fff", 0.1);
        this.scene.add(ambientLight);

        // Create a simple up and down animation using GSAP
        gsap.to(this.tetra.position, {
            y: 0.5,
            duration: 2,
            ease: "sine.inOut", // Smooth easing
            yoyo: true,
            repeat: -1, // Infinite loop
        });

        // Start render loop
        this.animate();
    }

    private animate = (): void => {
        requestAnimationFrame(this.animate);

        // Update controls
        this.camera.update();
        this.renderer.renderer.render(this.scene, this.camera.camera);
    };

    public dispose(): void {
        // Clean up resources
        this.camera.dispose();
        this.renderer.dispose();
    }
}
