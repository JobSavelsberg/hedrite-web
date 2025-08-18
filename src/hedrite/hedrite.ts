import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { gsap } from "gsap";
import { Camera } from "./camera";

export class Hedrite {
    private scene: THREE.Scene;
    private camera: Camera;
    private renderer: THREE.WebGLRenderer;
    private tetra: THREE.Mesh;

    constructor(container: HTMLDivElement) {
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);

        // Create scene
        this.scene = new THREE.Scene();
        // Append renderer to container
        container.appendChild(this.renderer.domElement);

        this.camera = new Camera(this.renderer);

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

        // Create GSAP animation for up and down movement
        this.createUpDownAnimation();

        // Start render loop
        this.animate();

        // Handle window resize
        window.addEventListener("resize", () => this.onWindowResize());
    }

    private animate = (): void => {
        requestAnimationFrame(this.animate);

        // Update controls
        this.camera.update();

        this.renderer.render(this.scene, this.camera.camera);
    };

    private createUpDownAnimation(): void {
        // Create a simple up and down animation using GSAP
        gsap.to(this.tetra.position, {
            y: 0.5,
            duration: 2,
            ease: "sine.inOut", // Smooth easing
            yoyo: true,
            repeat: -1, // Infinite loop
        });
    }

    private onWindowResize(): void {
        this.camera.onWindowResize();
    }

    public dispose(): void {
        // Clean up resources
        this.camera.dispose();
        this.renderer.dispose();
        window.removeEventListener("resize", this.onWindowResize);
    }
}
