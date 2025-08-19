import * as THREE from "three";

export interface IInteractable {
    getObject3D(): THREE.Object3D;
    setHover(isHovered: boolean, intersectionPoint: THREE.Vector3): void;
    onPointerDown(intersectionPoint: THREE.Vector3): void;
}

export class Interaction {
    private readonly camera: THREE.Camera;
    private readonly raycaster: THREE.Raycaster;
    private readonly mouse: THREE.Vector2 = new THREE.Vector2();

    private readonly interactables: IInteractable[] = [];

    constructor(camera: THREE.Camera) {
        this.camera = camera;
        this.raycaster = new THREE.Raycaster();
        window.addEventListener("pointermove", this.onPointerMove);
        window.addEventListener("pointerdown", this.onPointerDown);
    }

    public addInteractable(interactable: IInteractable): void {
        this.interactables.push(interactable);
    }

    private onPointerMove = (event: PointerEvent): void => {
        // Update mouse position
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    private onPointerDown = (event: PointerEvent): void => {
        // Update mouse position for click
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Perform raycasting
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(
            this.interactables.map(i => i.getObject3D())
        );

        if (intersects.length > 0 && intersects[0] !== undefined) {
            const intersectPoint = intersects[0].point;
            const interactable = this.interactables.find(
                i => i.getObject3D() === intersects[0].object
            );
            if (interactable) {
                interactable.onPointerDown(intersectPoint);
            }
        }
    };

    public update(camera: THREE.Camera): void {
        this.raycaster.setFromCamera(this.mouse, camera);

        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(
            this.interactables.map(i => i.getObject3D())
        );

        if (intersects.length > 0 && intersects[0] !== undefined) {
            const intersectPoint = intersects[0].point;
            const interactable = this.interactables.find(
                i => i.getObject3D() === intersects[0].object
            );
            if (interactable) {
                interactable.setHover(true, intersectPoint);
                // Set all other interactable hovers to false
                this.interactables.forEach(i => {
                    if (i !== interactable) {
                        interactable.setHover(false, new THREE.Vector3());
                    }
                });
            }
        } else {
            this.interactables.forEach(i =>
                i.setHover(false, new THREE.Vector3())
            );
        }
    }

    public dispose() {
        // Clean up event listeners
        window.removeEventListener("pointermove", this.onPointerMove);
        window.removeEventListener("pointerdown", this.onPointerDown);
    }
}
