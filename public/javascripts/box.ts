//<reference path="typings/threejs/three.d.ts">

/**
 * A box represents a rotatable cuboid
 * Created by Henry on 6/27/2015.
 */
import THREE = require("three");
import Main = require("./main");

//TODO: Box should extend Mesh
class Box extends THREE.Object3D {
    pivot = new THREE.Vector3();

    getMesh() {
        var mesh = new THREE.Mesh(Main.instance.cubeGeo, Main.instance.cubeMaterial);
        mesh.position.copy(this.position);
        return mesh;
    }
}

export = Box;