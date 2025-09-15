import * as THREE from "three";

export interface IInteractable {
    getObject3D(): THREE.Object3D;
    setHover(
        isHovered: boolean,
        intersectionPoint: THREE.Intersection | null
    ): void;
    onPointerDown(intersection: THREE.Intersection): void;
    onContextMenu(intersection: THREE.Intersection): void;
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
        window.addEventListener("contextmenu", this.onContextMenu);
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
        if (event.button != 0) return; // Not a left click
        const intersection = this.rayCast();

        if (intersection) {
            intersection.interactable.onPointerDown(intersection.intersection);
        }
    };

    public onContextMenu = (event: PointerEvent): void => {
        event.preventDefault();

        // Perform raycasting
        const intersection = this.rayCast();

        if (intersection) {
            intersection.interactable.onContextMenu(intersection.intersection);
        }
    };

    public rayCast(): {
        interactable: IInteractable;
        intersection: THREE.Intersection;
    } | null {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersections = this.raycaster.intersectObjects(
            this.interactables.map(i => i.getObject3D())
        );

        if (intersections.length > 0 && intersections[0] !== undefined) {
            const interactable = this.interactables.find(
                i => i.getObject3D() === intersections[0].object
            );
            if (interactable) {
                return {
                    interactable,
                    intersection: intersections[0],
                };
            }
        }

        return null;
    }

    public update(camera: THREE.Camera): void {
        const intersection = this.rayCast();

        if (intersection) {
            intersection.interactable.setHover(true, intersection.intersection);
            // Set all other interactable hovers to false
            this.interactables.forEach(i => {
                if (i !== intersection.interactable) {
                    i.setHover(false, null);
                }
            });
        } else {
            this.interactables.forEach(i => i.setHover(false, null));
        }
    }

    public dispose() {
        // Clean up event listeners
        window.removeEventListener("pointermove", this.onPointerMove);
        window.removeEventListener("pointerdown", this.onPointerDown);
        window.removeEventListener("contextmenu", this.onContextMenu);
    }
}
