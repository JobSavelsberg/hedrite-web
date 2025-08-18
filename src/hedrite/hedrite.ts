import * as THREE from "three";
import { gsap } from "gsap";

export class Hedrite {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private sphere: THREE.Mesh;

    constructor(container: HTMLDivElement) {
        // Create scene
        this.scene = new THREE.Scene();

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            50, // field of view
            window.innerWidth / window.innerHeight, // aspect ratio
            0.1, // near clipping plane
            1000 // far clipping plane
        );

        // Position camera
        this.camera.position.z = 5;

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);

        // Append renderer to container
        container.appendChild(this.renderer.domElement);

        // Create tetrahedron geometry and material
        const geometry = new THREE.TetrahedronGeometry(1);
        const material = new THREE.MeshLambertMaterial({
            color: 0xaaaaaa, // Light gray color
        });

        // Create tetrahedron mesh
        this.sphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.sphere);

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

        this.renderer.render(this.scene, this.camera);
    };

    private createUpDownAnimation(): void {
        // Create a simple up and down animation using GSAP
        gsap.to(this.sphere.position, {
            y: 0.5,
            duration: 2,
            ease: "sine.inOut", // Smooth easing
            yoyo: true,
            repeat: -1, // Infinite loop
        });
    }

    private onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
