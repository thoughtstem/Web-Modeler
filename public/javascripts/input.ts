//<reference path="typings/threejs/three.d.ts">
//<reference path="typings/threejs/three-orbitcontrols.d.ts">
//<reference path="typings/jquery/jquery.d.ts">
//<reference path="typings/underscore/underscore.d.ts">
/**
 * Static singleton class that handle inputs
 * Created by Henry on 6/27/2015.
 */
import $ = require("jquery");
import _ = require("underscore");
import Main = require("./main");
import World = require("./world");

var Input = new function () {
    var self = this;

    /**
     * The current selected object
     * @type {Box}
     */
    self.selected = null;

    /**
     * A set of pressed keycodes
     * @type {Array}
     */
    self.pressed = [];

    //Bind keys
    $(document).bind("keydown", function (event) {
        self.pressed.push(event.keyCode);
    });

    $(document).bind("keyup", function (event) {
        self.pressed = _.without(self.pressed, event.keyCode);
    });


    /**
     * Does a raytrace to find the object currently hit
     * @returns {Entity} The hit entity
     */
    self.getHit = function () {
        Main.instance.raycaster.setFromCamera(self.mouse, self.camera);
        var intersects = self.raycaster.intersectObjects(World.objects);

        if (intersects.length > 0) {
            return intersects[0];
        }

        return null;
    }
};

export = Input;