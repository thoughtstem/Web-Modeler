///<reference path="typings/jquery/jquery.d.ts" />
///<reference path="typings/underscore/underscore.d.ts" />
///<reference path="typings/threejs/three.d.ts" />
///<reference path="typings/threejs/three-orbitcontrols.d.ts" />
///<reference path="box.ts" />
///<reference path="typings/mousetrap/mousetrap.d.ts" />

/**
 * Handles user inputs
 * Created by Henry on 6/27/2015.
 */
import $ = require("jquery");
import _ = require("underscore");
import THREE = require("three");
import World = require("./world");
import Box = require("./box");
import Mousetrap = require("mousetrap");

declare var document:any;

enum Action{    NONE, TRANSLATING, SCALING, ROTATING}

class Input {

    /**
     * The current selected object
     * @type {Box}
     */
    selected:Box = null;

    /**
     * The current hovered object
     * @type {Box}
     */
    hovered:Box = null;

    /**
     * A set of pressed keycodes
     * @type {Array}
     */
    pressed:number[] = [];

    /**
     * The current mouse position on screen.
     */
    mouse:THREE.Vector2 = new THREE.Vector2();

    requestPointerLock:any;
    exitPointerLock:any;


    /**
     * The type of action currently being done.
     * @type {Action}
     */
    action:Action = Action.NONE;

    /**
     * The position in which the action starts.
     * @type {THREE.Vector3}
     */
    actionStart:THREE.Vector3 = null;

    /**
     * The original state of the object, represented by this vector
     * @type {Any}
     */
    actionOriginalPosition:THREE.Vector3 = null;
    actionOriginalScale:THREE.Vector3 = null;

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
        //deprecated
        $(document).bind("keydown", evt => this.pressed.push(event.keyCode));
        $(document).bind("keyup", evt => this.pressed = _.without(this.pressed, event.keyCode));

        Mousetrap.bind("t", evt => this.translate(evt));
        Mousetrap.bind("t", evt => this.stopAction(evt), "keyup");
        Mousetrap.bind("s", evt => this.scale(evt));
        Mousetrap.bind("s", evt => this.stopAction(evt), "keyup");
        Mousetrap.bind("r", evt => this.rotate(evt));
        Mousetrap.bind("r", evt => this.stopAction(evt), "keyup");

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

        switch (this.action) {
            case Action.NONE:
                var hitObj = this.getHoverObj();

                if (hitObj instanceof Box) {
                    this.hovered = hitObj;
                    hitObj.select();
                } else if (this.hovered instanceof Box && this.selected != this.hovered) {
                    this.hovered.deselect();
                    this.hovered = null;
                }
                break;
            case Action.TRANSLATING:
                var translate = this.getActionDelta().multiplyScalar(10);
                var newTranslate = this.actionOriginalScale.clone().add(translate);
                console.log(newTranslate);
                this.selected.position.set(newTranslate.x, newTranslate.y, newTranslate.z);
                break;
            case Action.SCALING:

                var scale = this.getActionDelta().addScalar(1);

                if (scale.lengthSq() > 0) {
                    var newScale = this.actionOriginalScale.clone().multiply(scale);
                    this.selected.scale.set(newScale.x, newScale.y, newScale.z);
                }

                this.app.renderer.renderUI();
                break;
            case Action.ROTATING:
                break;
        }

        this.app.renderer.renderWorld();
    }

    getActionDelta():THREE.Vector3 {
        if (this.actionOriginalPosition == null) {
            this.actionOriginalPosition = this.selected.position.clone();
        }
        if (this.actionOriginalScale == null) {
            this.actionOriginalScale = this.selected.scale.clone();
        }

        this.app.raycaster.setFromCamera(this.mouse, this.app.camera);
        var pLocal = new THREE.Vector3(0, 0, -1);
        var pWorld = pLocal.applyMatrix4(this.app.camera.matrixWorld);
        //Direction the camera is facing
        var normal = pWorld.sub(this.app.camera.position).normalize();
        //Create a plane on the selected object to do a raytrace hit
        var plane = new THREE.Plane(normal, this.actionOriginalPosition.dot(normal));
        var hitPos = this.app.raycaster.ray.intersectPlane(plane);

        if (this.actionStart == null) {
            this.actionStart = hitPos;
        }

        //Make it such that at the starting point, the delta is zero (there's no change).
        var startToObj = this.actionStart.clone().sub(this.actionOriginalPosition);
        //Calculate the delta position from the hit world position to the selected object position
        var delta = hitPos.clone().sub(this.actionOriginalPosition).divide(startToObj).subScalar(1);

        //TODO: CTR press cause grid lock.
        return delta;
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
                    this.app.renderer.renderUI();
                } else {
                    this.selected.deselect();
                    this.selected = null;
                    this.app.renderer.renderUI();
                }
            } else if (this.selected instanceof Box) {
                this.selected.deselect();
                this.selected = null;
                this.app.renderer.renderUI();
            }
            /*
             //Pointerlock
             var dom = this.app.renderer.renderer.domElement;
             this.requestPointerLock = dom.requestPointerLock ||
             dom.mozRequestPointerLock ||
             dom.webkitRequestPointerLock;
             console.log(this.requestPointerLock);

             this.exitPointerLock = document.exitPointerLock ||
             document.mozExitPointerLock ||
             document.webkitExitPointerLock;*/
        }

        this.app.renderer.renderWorld();
    }

    //TODO: Lock mouse
    translate(evt) {
        evt.preventDefault();

        if (this.selected != null) {
            this.action = Action.TRANSLATING;
        }
    }

    scale(evt) {
        evt.preventDefault();

        if (this.selected != null) {
            this.action = Action.SCALING;
        }
    }

    rotate(evt) {
        evt.preventDefault();

        if (this.selected != null) {
            this.action = Action.ROTATING;
        }
    }

    stopAction(evt) {
        evt.preventDefault();
        this.action = Action.NONE;
        this.actionStart = null;
        this.actionOriginalPosition = null;
        this.actionOriginalScale = null;
    }
}

export = Input;