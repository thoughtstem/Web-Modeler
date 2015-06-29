/**
 * The World singleton object that defines the world space
 * Created by Henry on 6/27/2015.
 */
var THREE = require("./lib/three.js");
var Box = require("./box.js");

var World = new function () {
    var self = this;

    /**
     * An array of objects in the world.
     * @type {Object3D} A list of Object3D.
     */
    self.objects = [];

    /**
     * Adds an entity to the world
     * @param {Object3D} The Object3D to add to the world
     */
    self.add = function (obj3D) {
        self.objects.push(obj3D);

        if (obj3D instanceof Box) {
            var Main = require("./main.js");
            Main.scene.add(obj3D.getMesh());
        }
    };
};

module.exports = World;