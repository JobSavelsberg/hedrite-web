import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { gsap } from "gsap";

export class Hedrite {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private tetra: THREE.Mesh;
    private controls!: OrbitControls; // Use definite assignment assertion

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
        this.tetra = new THREE.Mesh(geometry, material);
        this.scene.add(this.tetra);

        // Add lighting
        const directionalLight = new THREE.DirectionalLight("#fff", 3);
        directionalLight.position.set(-2, 2, 2);
        this.scene.add(directionalLight);

        // Add ambient light for better visibility
        const ambientLight = new THREE.AmbientLight("#fff", 0.1);
        this.scene.add(ambientLight);

        // Setup OrbitControls for interaction
        this.setupControls();

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
        this.controls.update();

        this.renderer.render(this.scene, this.camera);
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

    private setupControls(): void {
        // Create OrbitControls for mouse/touch interaction
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );

        // Configure controls
        this.controls.enableDamping = true; // Smooth camera movement
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;

        // Set zoom limits
        this.controls.minDistance = 2;
        this.controls.maxDistance = 10;

        // Set rotation limits (optional - remove if you want full 360° rotation)
        this.controls.maxPolarAngle = Math.PI; // Allow full vertical rotation

        // Enable auto-rotate (optional - set to false if you don't want auto-rotation)
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = 0.5;

        // Configure touch controls for mobile
        this.controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
        };

        // Configure mouse controls
        this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN,
        };
    }

    private onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.controls.update();
    }

    public dispose(): void {
        // Clean up resources
        this.controls.dispose();
        this.renderer.dispose();
        window.removeEventListener("resize", this.onWindowResize);
    }
}
