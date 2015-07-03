///<reference path="typings/jquery/jquery.d.ts" />
///<reference path="typings/underscore/underscore.d.ts" />
///<reference path="typings/threejs/three.d.ts" />
///<reference path="typings/threejs/three-orbitcontrols.d.ts" />
///<reference path="box.ts" />

/**
 * Handles user inputs
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

    /**
     * The current mouse position on screen.
     */
    mouse:THREE.Vector2 = new THREE.Vector2();


    keyMap = {
        SHIFT: 16
    };

    mouseMap = {
        LEFT: 1,
        RIGHT: 2,
        MIDDLE: 3,
        SELECT: 1
    };

    constructor(private app) {
        //Bind keys
        $(document).bind("keydown", evt => this.pressed.push(event.keyCode));

        $(document).bind("keyup", evt => this.pressed = _.without(this.pressed, event.keyCode));

        //Bind mouse events
        $(document).bind("mousemove", evt => this.onMouseMove(evt));
        $(document).bind("mousedown", evt => this.onMouseDown(evt));
    }

    /**
     * Does a raytrace to find the object currently being hovered over
     * @returns {Intersection} The intersection object
     */
    getHoverIntersect() {
        this.app.raycaster.setFromCamera(this.mouse, this.app.camera);
        var intersects = this.app.raycaster.intersectObjects(this.app.world.objects, true);

        if (intersects.length > 0) {
            return intersects[0];
        }

        return null;
    }

    /**
     * Gets the object hit by the raytrace.
     * @returns {Box} The object being hovered over.
     */
    getHoverObj() {
        var hit = this.getHoverIntersect();
        return (hit != null) ? hit.object : null;
    }

    onMouseMove(evt) {
        evt.preventDefault();

        this.mouse.set((evt.clientX / window.innerWidth) * 2 - 1, -(evt.clientY / window.innerHeight) * 2 + 1);

        var hitObj = this.getHoverObj();

        if (hitObj instanceof Box) {
            this.hovered = hitObj;
            hitObj.select();
        } else if (this.hovered instanceof Box && this.selected != this.hovered) {
            this.hovered.deselect();
            this.hovered = null;
        }


        this.app.renderer.renderWorld();
    }


    onMouseDown(evt) {
        evt.preventDefault();

        //Left click selection
        if (evt.which == this.mouseMap.SELECT) {
            var hitObj = this.getHoverObj();

            if (hitObj instanceof Box) {
                if (this.selected == null) {
                    this.selected = hitObj;
                    hitObj.select();
                } else {
                    this.selected.deselect();
                    this.selected = null;
                }
            } else if (this.selected instanceof Box) {
                this.selected.deselect();
                this.selected = null;
            }
        }

        this.app.renderer.renderWorld();
    }
}

export = Input;