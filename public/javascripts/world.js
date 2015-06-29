/**
 * The World singleton object that defines the world space
 * Created by Henry on 6/27/2015.
 */
var THREE = require("./lib/three.js");

var World = new function () {
    var self = this;

    self.scene = new THREE.Scene();

    /**
     * An array of objects in the world.
     * @type {Entity}
     */
    self.entities = [];

    /**
     * Adds an entity to the world
     * @param The entity to add
     */
    self.add = function (entity) {
        self.entities.push(entity);
    };
};

module.exports = World;