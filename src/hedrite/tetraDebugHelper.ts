import { DebugHelper } from "./debugHelper";
import type { TetraMesh } from "./tetraMesh";

const COLORS = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];

/**
 * Colors in order [A:Red, B:Green, C:Blue, D:Yellow]
 */
export class TetraDebugHelper {
    /**
     * Shows colored dot for each vertex
     * @param tetraMesh the mesh to show dots for
     */
    public static showVertices(tetraMesh: TetraMesh) {
        tetraMesh.worldVertices.forEach((v, i) => {
            DebugHelper.dot(v, COLORS[i - 1]);
        });

        DebugHelper.dot(tetraMesh.worldCentroid, 0xffffff);
    }

    /**
     * Shows colored arrows corresponding to the face normals
     * @param tetraMesh the mesh to show the arrows for
     */
    public static showFaceNormals(tetraMesh: TetraMesh) {
        tetraMesh.worldVertices.forEach((v, i) => {
            DebugHelper.arrow(
                tetraMesh.worldCentroid.sub(v),
                tetraMesh.worldCentroid,
                COLORS[i - 1]
            );
        });
    }
}
