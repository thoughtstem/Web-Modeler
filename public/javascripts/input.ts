declare var require:any;
declare var module:any;

/**
 * Static singleton class that handle inputs
 * Created by Henry on 6/27/2015.
 */
var $ = require("./lib/jquery.js");
var _ = require("./lib/underscore.js");
var Main = require("./main.js");
var World = require("./world.js");

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
        Main.raycaster.setFromCamera(self.mouse, self.camera);
        var intersects = self.raycaster.intersectObjects(World.objects);

        if (intersects.length > 0) {
            return intersects[0];
        }

        return null;
    }
};

module.exports = Input;