import * as THREE from "three";
import { DebugHelper } from "./debugHelper";
import { TetraDebugHelper } from "./tetraDebugHelper";

/*
 *  A tetra is an object containing 4 notes, it can be connected to other tetras sharing one face
 *
 *    b
 *  /   \    d is behind
 * a --- c
 *
 * define faces in clockwise direction and named based on the vertex that is NOT part of the face
 *
 * face A = cbd     (Red)
 * face B = dac     (Green)
 * face C = bad     (Blue)
 * face D = cab     (Yellow)
 */

type Index = 0 | 1 | 2 | 3;
type Vertex = Index;
type Edge = [Vertex, Vertex]; // Two vertex indexes that make up an edge
type Face = [Vertex, Vertex, Vertex]; // Three vertex indexes that make up a face

// Constants for vertex indices
const A: Vertex = 0;
const B: Vertex = 1;
const C: Vertex = 2;
const D: Vertex = 3;
const faces: Face[] = [
    [C, B, D],
    [D, A, C],
    [B, A, D],
    [C, A, B],
];

const INVSQRT2 = 1 / Math.sqrt(2);
const FACE2FACE_CENTROID_DISTANCE = Math.sqrt(6) / 3;
// Either we have the face in INDEX, or in COORD

export class TetraMesh {
    public mesh: THREE.Mesh;
    public readonly geometry: THREE.BufferGeometry;

    public get worldVertices(): THREE.Vector3[] {
        const positions = this.geometry.getAttribute(
            "position"
        ) as THREE.BufferAttribute;
        const worldMatrix = this.mesh.matrixWorld;
        return [A, B, C, D]
            .map(i => faces.flat().findIndex(v => v === i))
            .map(
                i =>
                    new THREE.Vector3(
                        positions.getX(i),
                        positions.getY(i),
                        positions.getZ(i)
                    )
            )
            .map(v => v.applyMatrix4(worldMatrix));
    }

    public get worldCentroid(): THREE.Vector3 {
        // Get the average of all vertices
        const sum = this.worldVertices.reduce((prev, curr) => prev.add(curr));
        return sum.divideScalar(this.worldVertices.length);
    }

    constructor(
        vertexA: THREE.Vector3,
        vertexB: THREE.Vector3,
        vertexC: THREE.Vector3,
        vertexD: THREE.Vector3
    ) {
        // We need 3 copies of each vertex, since we don't want the vertex normal to be different for each face
        const vertices = [vertexA, vertexB, vertexC, vertexD];

        const flattenedFaceVertexIndexes = faces.flat();
        const flattenedFaceVertexCoords = flattenedFaceVertexIndexes
            .map(i => vertices[i])
            .flatMap(v => [v.x, v.y, v.z]);

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(
                new Float32Array(flattenedFaceVertexCoords),
                3
            )
        );
        this.geometry.computeVertexNormals();

        this.mesh = new THREE.Mesh(this.geometry);
    }

    static CreateWithEdgeLength(edgeLength: number): TetraMesh {
        const tetraGeometry = new TetraMesh(
            new THREE.Vector3(1, 0, -INVSQRT2).multiplyScalar(edgeLength), // A
            new THREE.Vector3(-1, 0, -INVSQRT2).multiplyScalar(edgeLength), // B
            new THREE.Vector3(0, 1, INVSQRT2).multiplyScalar(edgeLength), // C
            new THREE.Vector3(0, -1, INVSQRT2).multiplyScalar(edgeLength) // D
        );

        return tetraGeometry;
    }

    static CreateOnFace(fromTetra: TetraMesh, face: THREE.Face): TetraMesh {
        const faceIndex = TetraMesh.getFaceIndex(face);

        const oppositeVertex = fromTetra.worldVertices[faceIndex];
        const normalDirection = fromTetra.worldCentroid
            .sub(oppositeVertex)
            .normalize();

        const newTetra = this.CreateWithEdgeLength(1);

        newTetra.mesh.position.copy(fromTetra.worldCentroid);

        newTetra.mesh.translateOnAxis(
            normalDirection,
            FACE2FACE_CENTROID_DISTANCE
        );
        newTetra.mesh.rotation.copy(fromTetra.mesh.rotation);

        newTetra.mesh.rotateOnWorldAxis(normalDirection, Math.PI);

        // Flip along the axis of any of the face's world edges
        const edgeV1 = (faceIndex + 1) % 4;
        const edgeV2 = (faceIndex + 2) % 4;

        const axis = fromTetra.worldVertices[edgeV1]
            .sub(fromTetra.worldVertices[edgeV2])
            .normalize();

        newTetra.mesh.rotateOnWorldAxis(axis, Math.PI);

        return newTetra;
    }

    static getFaceIndex(face: THREE.Face): Index {
        const index = face.a / 3;
        if (index >= 0 && index < 4) {
            return index as Index;
        } else {
            throw new Error(`Face index is out of bounds`);
        }
    }
}
