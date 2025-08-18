import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class Camera {
    public camera: THREE.PerspectiveCamera;
    private controls!: OrbitControls; // Use definite assignment assertion

    constructor(renderer: THREE.WebGLRenderer) {
        this.camera = new THREE.PerspectiveCamera(
            50, // field of view
            window.innerWidth / window.innerHeight, // aspect ratio
            0.1, // near clipping plane
            1000 // far clipping plane
        );
        this.camera.position.z = 5;

        this.setupControls(renderer);
    }

    public setupControls(renderer: THREE.WebGLRenderer): void {
        // Create OrbitControls for mouse/touch interaction
        this.controls = new OrbitControls(this.camera, renderer.domElement);

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

    public onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.controls.update();
    }

    public update() {
        this.controls.update();
    }

    public dispose(): void {
        this.controls.dispose();
    }
}
