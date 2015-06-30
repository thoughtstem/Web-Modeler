///<reference path="typings/threejs/three.d.ts" />

/**
 * The World singleton object that defines the world space
 * Created by Henry on 6/27/2015.
 */
import THREE = require("three");
import Box = require("./box");
import Main = require("./main");

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
            Main.instance.scene.add(obj3D.getMesh());
        }
    };
};

export = World;