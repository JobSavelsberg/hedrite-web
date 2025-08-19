import * as THREE from "three";
import { Camera } from "./camera";
import { Renderer } from "./renderer";
import { Tetra } from "./tetra";

export type HedriteContext = {
    container: HTMLDivElement;
};

export class Hedrite {
    private scene: THREE.Scene;
    private camera: Camera;
    private renderer: Renderer;
    private tetra: Tetra;

    constructor(context: HedriteContext) {
        this.renderer = new Renderer(context.container);
        this.camera = new Camera(this.renderer.renderer);
        this.scene = new THREE.Scene();

        // Add lighting
        const directionalLight = new THREE.DirectionalLight("#fff", 3);
        directionalLight.position.set(-2, 2, 2);
        this.scene.add(directionalLight);

        // Add ambient light for better visibility
        const ambientLight = new THREE.AmbientLight("#fff", 0.1);
        this.scene.add(ambientLight);

        this.tetra = new Tetra();
        this.scene.add(this.tetra.mesh);

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
