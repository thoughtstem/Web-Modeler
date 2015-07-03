///<reference path="typings/threejs/three.d.ts" />

/**
 * The World singleton object that defines the world space
 * Created by Henry on 6/27/2015.
 */
import THREE = require("three");
import Box = require("./box");
import Main = require("./main");

class World {
    constructor(private app) {

    }

    /**
     * An array of objects in the world.
     * @type {Object3D} A list of Object3D.
     */
    objects = [];

    /**
     * Adds an entity to the world
     * @param {Object3D} The Object3D to add to the world
     */
    add(obj3D) {
        this.objects.push(obj3D);

        if (obj3D instanceof Box) {
            this.app.scene.add(obj3D.getMesh());
        }
    }
}

export = World;