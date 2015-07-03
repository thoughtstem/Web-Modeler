///<reference path="typings/jquery/jquery.d.ts" />
///<reference path="typings/underscore/underscore.d.ts" />
///<reference path="typings/threejs/three.d.ts" />
///<reference path="typings/threejs/three-orbitcontrols.d.ts" />
///<reference path="box.ts" />
///<reference path="typings/mousetrap/mousetrap.d.ts" />
define(["require", "exports", "jquery", "underscore", "./box", "mousetrap"], function (require, exports, $, _, Box, Mousetrap) {
    var Input = (function () {
        function Input(app) {
            var _this = this;
            this.app = app;
            /**
             * The current selected object
             * @type {Box}
             */
            this.selected = null;
            /**
             * The current hovered object
             * @type {Box}
             */
            this.hovered = null;
            /**
             * A set of pressed keycodes
             * @type {Array}
             */
            this.pressed = [];
            /**
             * The current mouse position on screen.
             */
            this.mouse = new THREE.Vector2();
            this.keyMap = {
                SHIFT: 16
            };
            this.mouseMap = {
                LEFT: 1,
                RIGHT: 2,
                MIDDLE: 3,
                SELECT: 1
            };
            //Bind keys
            //deprecated
            $(document).bind("keydown", function (evt) { return _this.pressed.push(event.keyCode); });
            $(document).bind("keyup", function (evt) { return _this.pressed = _.without(_this.pressed, event.keyCode); });
            Mousetrap.bind("t", function (evt) { return _this.translate(evt); });
            Mousetrap.bind("s", function (evt) { return _this.scale(evt); });
            Mousetrap.bind("r", function (evt) { return _this.rotate(evt); });
            //Bind mouse events
            $(document).bind("mousemove", function (evt) { return _this.onMouseMove(evt); });
            $(document).bind("mousedown", function (evt) { return _this.onMouseDown(evt); });
        }
        /**
         * Does a raytrace to find the object currently being hovered over
         * @returns {Intersection} The intersection object
         */
        Input.prototype.getHoverIntersect = function () {
            this.app.raycaster.setFromCamera(this.mouse, this.app.camera);
            var intersects = this.app.raycaster.intersectObjects(this.app.world.objects, true);
            if (intersects.length > 0) {
                return intersects[0];
            }
            return null;
        };
        /**
         * Gets the object hit by the raytrace.
         * @returns {Box} The object being hovered over.
         */
        Input.prototype.getHoverObj = function () {
            var hit = this.getHoverIntersect();
            return (hit != null) ? hit.object : null;
        };
        Input.prototype.onMouseMove = function (evt) {
            evt.preventDefault();
            this.mouse.set((evt.clientX / window.innerWidth) * 2 - 1, -(evt.clientY / window.innerHeight) * 2 + 1);
            var hitObj = this.getHoverObj();
            if (hitObj instanceof Box) {
                this.hovered = hitObj;
                hitObj.select();
            }
            else if (this.hovered instanceof Box && this.selected != this.hovered) {
                this.hovered.deselect();
                this.hovered = null;
            }
            this.app.renderer.renderWorld();
        };
        Input.prototype.onMouseDown = function (evt) {
            evt.preventDefault();
            //Left click selection
            if (evt.which == this.mouseMap.SELECT) {
                var hitObj = this.getHoverObj();
                if (hitObj instanceof Box) {
                    if (this.selected == null) {
                        this.selected = hitObj;
                        hitObj.select();
                    }
                    else {
                        this.selected.deselect();
                        this.selected = null;
                    }
                }
                else if (this.selected instanceof Box) {
                    this.selected.deselect();
                    this.selected = null;
                }
                //Pointerlock
                var dom = this.app.renderer.renderer.domElement;
                this.requestPointerLock = dom.requestPointerLock || dom.mozRequestPointerLock || dom.webkitRequestPointerLock;
                console.log(this.requestPointerLock);
                this.requestPointerLock();
                this.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
            }
            this.app.renderer.renderWorld();
        };
        //TODO: Lock mouse
        Input.prototype.translate = function (evt) {
            evt.preventDefault();
            if (this.selected != null) {
            }
        };
        Input.prototype.scale = function (evt) {
            evt.preventDefault();
            if (this.selected != null) {
            }
        };
        Input.prototype.rotate = function (evt) {
            evt.preventDefault();
            if (this.selected != null) {
            }
        };
        return Input;
    })();
    return Input;
});
