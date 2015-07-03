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
import Box = require("./box");

class Input {

    /**
     * The current selected object
     * @type {Box}
     */
    selected = null;

    /**
     * The current hovered object
     * @type {Box}
     */
    hovered = null;

    /**
     * A set of pressed keycodes
     * @type {Array}
     */
    pressed = [];

    constructor(private app) {
        //Bind keys
        $(document).bind("keydown", evt => this.pressed.push(event.keyCode));

        $(document).bind("keyup", evt => this.pressed = _.without(this.pressed, event.keyCode));

        //Bind events
        $(document).bind("mousemove", evt => this.onMouseMove(evt));
    }

    /**
     * Does a raytrace to find the object currently hit
     * @returns {Entity} The hit entity
     */
    getHit() {
        this.app.raycaster.setFromCamera(this.app.mouse, this.app.camera);
        var intersects = this.app.raycaster.intersectObjects(this.app.world.objects, true);

        if (intersects.length > 0) {
            return intersects[0];
        }

        return null;
    }

    onMouseMove(event) {
        event.preventDefault();

        this.app.mouse.set(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1);

        var hit = this.getHit();
        var hitObj = (hit != null) ? hit.object : null;

        if (hitObj instanceof Box) {
            this.hovered = hitObj;
            hitObj.select();
        } else {
            if (this.hovered instanceof Box) {
                this.hovered.deselect();
            }
        }

        this.app.renderer.renderWorld();
    }
}

export = Input;