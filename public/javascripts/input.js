///<reference path="typings/jquery/jquery.d.ts" />
///<reference path="typings/underscore/underscore.d.ts" />
///<reference path="typings/threejs/three.d.ts" />
///<reference path="typings/threejs/three-orbitcontrols.d.ts" />
///<reference path="box.ts" />
define(["require", "exports", "jquery", "underscore"], function (require, exports, $, _) {
    var Input = (function () {
        function Input(app, world) {
            this.app = app;
            this.world = world;
            /**
             * The current selected object
             * @type {Box}
             */
            this.selected = null;
            /**
             * A set of pressed keycodes
             * @type {Array}
             */
            this.pressed = [];
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
        Input.prototype.getHit = function () {
            this.app.raycaster.setFromCamera(this.app.mouse, this.app.camera);
            var intersects = this.app.raycaster.intersectObjects(this.world.objects);
            if (intersects.length > 0) {
                return intersects[0];
            }
            return null;
        };
        return Input;
    })();
    return Input;
});
