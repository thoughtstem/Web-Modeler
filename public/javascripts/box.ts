///<reference path="typings/threejs/three.d.ts" />

/**
 * A box represents a rotatable cuboid
 * Created by Henry on 6/27/2015.
 */
import THREE = require("three");

var cubeGeo = new THREE.BoxGeometry(50, 50, 50);

var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xfeb74c, shading: THREE.FlatShading, map: THREE.ImageUtils.loadTexture("textures/square-outline-textured.png")});
var rollOverMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, opacity: 0.5, transparent: true});

//TODO: Box should extend Mesh
class Box extends THREE.Mesh {

    pivot = new THREE.Vector3();

    constructor() {
        super();
        this.geometry = cubeGeo;
        this.material = cubeMaterial;
    }

    /**
     * Called to roll over the mesh.
     */
    select() {
        this.material = rollOverMaterial
    }

    deselect() {
        this.material = cubeMaterial
    }
}

export = Box;