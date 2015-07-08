///<reference path="typings/jquery/jquery.d.ts" />
///<reference path="typings/underscore/underscore.d.ts" />
///<reference path="typings/threejs/three.d.ts" />
///<reference path="typings/threejs/three-orbitcontrols.d.ts" />
///<reference path="box.ts" />
///<reference path="typings/mousetrap/mousetrap.d.ts" />
define(["require", "exports", "jquery", "underscore", "three", "./box", "mousetrap"], function (require, exports, $, _, THREE, Box, Mousetrap) {
    var Action;
    (function (Action) {
        Action[Action["NONE"] = 0] = "NONE";
        Action[Action["TRANSLATING"] = 1] = "TRANSLATING";
        Action[Action["SCALING"] = 2] = "SCALING";
        Action[Action["ROTATING"] = 3] = "ROTATING";
    })(Action || (Action = {}));
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
            /**
             * The type of action currently being done.
             * @type {Action}
             */
            this.action = 0 /* NONE */;
            /**
             * The position in which the action starts.
             * @type {THREE.Vector3}
             */
            this.actionStart = null;
            /**
             * The original state of the object, represented by this vector
             * @type {Any}
             */
            this.actionOriginalState = null;
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
            Mousetrap.bind("t", function (evt) { return _this.stopAction(evt); }, "keyup");
            Mousetrap.bind("s", function (evt) { return _this.scale(evt); });
            Mousetrap.bind("s", function (evt) { return _this.stopAction(evt); }, "keyup");
            Mousetrap.bind("r", function (evt) { return _this.rotate(evt); });
            Mousetrap.bind("r", function (evt) { return _this.stopAction(evt); }, "keyup");
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
            switch (this.action) {
                case 0 /* NONE */:
                    var hitObj = this.getHoverObj();
                    if (hitObj instanceof Box) {
                        this.hovered = hitObj;
                        hitObj.select();
                    }
                    else if (this.hovered instanceof Box && this.selected != this.hovered) {
                        this.hovered.deselect();
                        this.hovered = null;
                    }
                    break;
                case 1 /* TRANSLATING */:
                    break;
                case 2 /* SCALING */:
                    this.app.raycaster.setFromCamera(this.mouse, this.app.camera);
                    var pLocal = new THREE.Vector3(0, 0, -1);
                    var pWorld = pLocal.applyMatrix4(this.app.camera.matrixWorld);
                    //Direction the camera is facing
                    var normal = pWorld.sub(this.app.camera.position).normalize();
                    //Create a plane on the selected object to do a raytrace hit
                    var plane = new THREE.Plane(normal, this.selected.position.dot(normal));
                    var hitPos = this.app.raycaster.ray.intersectPlane(plane);
                    if (this.actionStart == null) {
                        this.actionStart = hitPos;
                    }
                    if (this.actionOriginalState == null) {
                        this.actionOriginalState = this.selected.scale.clone();
                    }
                    //Make it such that at the starting point, the delta is zero (there's no change).
                    var distToObj = this.actionStart.distanceTo(this.selected.position);
                    //Calculate the delta position from the hit world position to the selected object poslition
                    var delta = hitPos.clone().sub(this.selected.position).divideScalar(distToObj);
                    var scale = delta;
                    if (scale.lengthSq() > 0) {
                        var newScale = this.actionOriginalState.clone().multiply(scale);
                        this.selected.scale.set(newScale.x, newScale.y, newScale.z);
                    }
                    this.app.renderer.renderUI();
                    break;
                case 3 /* ROTATING */:
                    break;
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
                        this.app.renderer.renderUI();
                    }
                    else {
                        this.selected.deselect();
                        this.selected = null;
                        this.app.renderer.renderUI();
                    }
                }
                else if (this.selected instanceof Box) {
                    this.selected.deselect();
                    this.selected = null;
                    this.app.renderer.renderUI();
                }
            }
            this.app.renderer.renderWorld();
        };
        //TODO: Lock mouse
        Input.prototype.translate = function (evt) {
            evt.preventDefault();
            if (this.selected != null) {
                this.action = 1 /* TRANSLATING */;
            }
        };
        Input.prototype.scale = function (evt) {
            evt.preventDefault();
            if (this.selected != null) {
                this.action = 2 /* SCALING */;
            }
        };
        Input.prototype.rotate = function (evt) {
            evt.preventDefault();
            if (this.selected != null) {
                this.action = 3 /* ROTATING */;
            }
        };
        Input.prototype.stopAction = function (evt) {
            evt.preventDefault();
            this.action = 0 /* NONE */;
            this.actionStart = null;
            this.actionOriginalState = null;
        };
        return Input;
    })();
    return Input;
});
