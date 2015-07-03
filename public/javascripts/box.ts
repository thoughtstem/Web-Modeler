///<reference path="typings/threejs/three.d.ts" />

/**
 * A box represents a rotatable cuboid
 * Created by Henry on 6/27/2015.
 */
import THREE = require("three");

var cubeGeo:THREE.BoxGeometry = new THREE.BoxGeometry(50, 50, 50);
var cubeMaterial:THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({color: 0xfeb74c, shading: THREE.FlatShading, map: THREE.ImageUtils.loadTexture("textures/square-outline-textured.png")});

//TODO: Box should extend Mesh
class Box extends THREE.Object3D {
    pivot = new THREE.Vector3();

    getMesh() {
        var mesh = new THREE.Mesh(cubeGeo, cubeMaterial);
        mesh.position.copy(this.position);
        return mesh;
    }
}

export = Box;