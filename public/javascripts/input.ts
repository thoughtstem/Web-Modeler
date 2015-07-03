///<reference path="typings/jquery/jquery.d.ts" />
///<reference path="typings/underscore/underscore.d.ts" />
///<reference path="typings/threejs/three.d.ts" />
///<reference path="typings/threejs/three-orbitcontrols.d.ts" />
///<reference path="box.ts" />

/**
 * Static singleton class that handle inputs
 * Created by Henry on 6/27/2015.
 */
import $ = require("jquery");
import _ = require("underscore");
import World = require("./world");

class Input {

    /**
     * The current selected object
     * @type {Box}
     */
    selected = null;

    /**
     * A set of pressed keycodes
     * @type {Array}
     */
    pressed = [];

    constructor(private app, private world) {
        //Bind keys
        $(document).bind("keydown", function (event) {
            this.pressed.push(event.keyCode);
        });

        $(document).bind("keyup", function (event) {
            this.pressed = _.without(this.pressed, event.keyCode);
        });
    }

    /**
     * Does a raytrace to find the object currently hit
     * @returns {Entity} The hit entity
     */
    getHit() {
        this.app.raycaster.setFromCamera(this.app.mouse, this.app.camera);
        var intersects = this.app.raycaster.intersectObjects(this.world.objects);

        if (intersects.length > 0) {
            return intersects[0];
        }

        return null;
    }
}

export = Input;