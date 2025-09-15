import * as THREE from "three";

export class Renderer {
    public renderer: THREE.WebGLRenderer;

    constructor(container: HTMLDivElement) {
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });

        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setClearColor(0x000000, 0);

        container.appendChild(this.renderer.domElement);
    }

    public dispose(): void {
        // Clean up resources
        this.renderer.dispose();
    }
}
