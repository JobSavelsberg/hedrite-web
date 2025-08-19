import * as THREE from "three";
import { Camera } from "./camera";
import { Renderer } from "./renderer";
import { Tetra } from "./tetra";
import { Interaction } from "./interaction";

export type HedriteContext = {
    container: HTMLDivElement;
};

export class Hedrite {
    private readonly lightOffset = new THREE.Vector3(-1, 2, 3).multiplyScalar(
        100
    );

    private readonly scene: THREE.Scene;
    private readonly camera: Camera;
    private readonly renderer: Renderer;
    private readonly interaction: Interaction;

    private readonly tetras: Tetra[] = [];
    private readonly directionalLight: THREE.DirectionalLight;

    constructor(context: HedriteContext) {
        this.renderer = new Renderer(context.container);
        this.camera = new Camera(this.renderer.renderer);
        this.interaction = new Interaction(this.camera.camera);
        this.scene = new THREE.Scene();

        // Add lighting
        this.directionalLight = new THREE.DirectionalLight("#fff", 3);
        this.directionalLight.position.copy(this.lightOffset);
        this.scene.add(this.directionalLight);

        // Add ambient light for better visibility
        const ambientLight = new THREE.AmbientLight("#fff", 0.1);
        this.scene.add(ambientLight);

        this.tetras.push(new Tetra());
        this.tetras.forEach(tetra => {
            this.interaction.addInteractable(tetra);
            this.scene.add(tetra.mesh);
        });

        // Start render loop
        this.animate();
    }

    private animate = (): void => {
        requestAnimationFrame(this.animate);

        this.interaction.update(this.camera.camera);
        this.camera.update();

        const worldOffset = this.lightOffset
            .clone()
            .applyQuaternion(this.camera.camera.quaternion);
        this.directionalLight.position.copy(this.camera.camera.position);
        this.directionalLight.position.copy(
            this.camera.camera.position.clone().add(worldOffset)
        );

        this.renderer.renderer.render(this.scene, this.camera.camera);
    };

    public dispose(): void {
        // Clean up resources
        this.interaction.dispose();
        this.camera.dispose();
        this.renderer.dispose();
    }
}
