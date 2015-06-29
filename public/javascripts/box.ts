declare var require:any;
/**
 * A box represents a rotatable cuboid
 * Created by Henry on 6/27/2015.
 */
var THREE = require("./lib/three.js");

//TODO: Box should extend Mesh
var Box = function () {
    var self = this;

    self.pivot = new THREE.Vector3();

    self.getMesh = function () {
        var Main = require("./main.js");
        var mesh = new THREE.Mesh(Main.cubeGeo, Main.cubeMaterial);
        mesh.position.copy(self.position);
        return mesh;
    };
};

Box.prototype = THREE.Object3D.prototype;
Box.prototype.constructor = Box;

module.exports = Box;