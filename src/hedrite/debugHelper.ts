import * as THREE from "three";

export class DebugHelper {
    public static scene: THREE.Scene;

    /**
     * Draws an arrow from the origin to a certain direction
     * @param direction The direction and length of the arrow
     * @param origin The origin point of the arrow
     * @param color The color of the arrow
     */
    public static arrow(
        direction: THREE.Vector3,
        origin: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
        color: number = 0xffff00
    ): void {
        const dir = direction.clone();

        //normalize the direction vector (convert to vector of length 1)
        dir.normalize();

        const length = direction.length();
        const hex = color;
        const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
        DebugHelper.scene.add(arrowHelper);
    }

    /**
     * Draws a dot at a certain position
     * @param position The position of the dot
     * @param color The color of the dot
     */
    public static dot(position: THREE.Vector3, color: number = 0xffff00): void {
        const geometry = new THREE.SphereGeometry(0.05, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.copy(position);
        DebugHelper.scene.add(sphere);
    }
}
