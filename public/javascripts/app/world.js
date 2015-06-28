/**
 * The World singleton object containing all objects.
 * Created by Henry on 6/27/2015.
 */
define(
    [
        "app/main",
        "lib/jquery",
        "lib/three"]
    ,
    function (Main) {
        return new function () {
            var self = this;

            /**
             * An array of objects in the world.
             * @type {Entity}
             */
            self.objects = [];

            /**
             * Adds an entity to the world
             * @param The entity to add
             */
            self.add = function (obj) {
                self.objects.push(obj);
            };

            /**
             * Renders the world.
             */
            self.render = function () {
                Main.renderer.render(Main.scene, Main.camera);
            }
        };
    }
);