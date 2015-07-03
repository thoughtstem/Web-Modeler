///<reference path="typings/jquery/jquery.d.ts" />
///<reference path="typings/underscore/underscore.d.ts" />
///<reference path="typings/threejs/three.d.ts" />
///<reference path="typings/threejs/three-orbitcontrols.d.ts" />
///<reference path="box.ts" />
define(["require", "exports", "jquery", "underscore", "./box"], function (require, exports, $, _, Box) {
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
            //Bind keys
            $(document).bind("keydown", function (evt) {
                return _this.pressed.push(event.keyCode);
            });
            $(document).bind("keyup", function (evt) {
                return _this.pressed = _.without(_this.pressed, event.keyCode);
            });
            //Bind events
            $(document).bind("mousemove", function (evt) {
                return _this.onMouseMove(evt);
            });
        }
        /**
         * Does a raytrace to find the object currently hit
         * @returns {Entity} The hit entity
         */
        Input.prototype.getHit = function () {
            this.app.raycaster.setFromCamera(this.app.mouse, this.app.camera);
            var intersects = this.app.raycaster.intersectObjects(this.app.world.objects, true);
            if (intersects.length > 0) {
                return intersects[0];
            }
            return null;
        };
        Input.prototype.onMouseMove = function (event) {
            event.preventDefault();
            this.app.mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
            var hit = this.getHit();
            var hitObj = (hit != null) ? hit.object : null;
            if (hitObj instanceof Box) {
                this.hovered = hitObj;
                hitObj.select();
            }
            else {
                if (this.hovered instanceof Box) {
                    this.hovered.deselect();
                }
            }
            this.app.renderer.renderWorld();
        };
        return Input;
    })();
    return Input;
});
