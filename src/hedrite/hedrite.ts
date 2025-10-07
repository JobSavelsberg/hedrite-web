import * as THREE from "three";
import { Camera } from "./camera";
import { Renderer } from "./renderer";
import { Tetra } from "./tetra";
import { Interaction } from "./interaction";
import { Sound } from "./sound";
import { DebugHelper } from "./debugHelper";
import { TetraDebugHelper } from "./tetraDebugHelper";

export type HedriteContext = {
    container: HTMLDivElement;
};

export class Hedrite {
    private readonly lightOffset = new THREE.Vector3(-1, 2, 3).multiplyScalar(
        100
    );

    private readonly lightOffset2 = new THREE.Vector3(1, -1, 3).multiplyScalar(
        10
    );
    private readonly lightOffset3 = new THREE.Vector3(
        -1,
        -1,
        -1
    ).multiplyScalar(10);

    private readonly scene: THREE.Scene;
    private readonly camera: Camera;
    private readonly renderer: Renderer;
    private readonly interaction: Interaction;
    private readonly sound: Sound;

    private readonly tetras: Tetra[] = [];
    private readonly directionalLight: THREE.DirectionalLight;
    private readonly directionalLight2: THREE.DirectionalLight;
    private readonly directionalLight3: THREE.DirectionalLight;

    constructor(context: HedriteContext) {
        this.renderer = new Renderer(context.container);
        this.camera = new Camera(this.renderer.renderer);
        this.interaction = new Interaction(this.camera.camera);
        this.scene = new THREE.Scene();
        DebugHelper.scene = this.scene;
        this.sound = new Sound();

        // Add lighting
        this.directionalLight = new THREE.DirectionalLight("#fff", 3);
        this.directionalLight.position.copy(this.lightOffset);
        this.scene.add(this.directionalLight);

        // Add ambient light for better visibility
        const ambientLight = new THREE.AmbientLight("#fff", 0.1);
        this.scene.add(ambientLight);

        const tetra = new Tetra(
            this.sound,
            this.onAttachTetra,
            this.onPlayTetra
        );
        this.addTetra(tetra);

        // Start render loop
        this.animate();
    }

    private onAttachTetra = (tetra: Tetra): void => {
        this.addTetra(tetra);
    };

    private onPlayTetra = (tetra: Tetra): void => {};

    private addTetra(tetra: Tetra): void {
        this.tetras.push(tetra);
        this.interaction.addInteractable(tetra);
        this.scene.add(tetra.getObject3D());

        // Focus camera on the newly added tetra
        this.camera.focusOn(tetra.getObject3D().position, 700);
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
        this.sound.dispose();
        this.interaction.dispose();
        this.camera.dispose();
        this.renderer.dispose();
    }
}
