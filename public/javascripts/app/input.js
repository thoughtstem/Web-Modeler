/**
 * Static singleton class that handle inputs
 * Created by Henry on 6/27/2015.
 */
define(
    [
        "app/main",
        "lib/jquery",
        "lib/three"
    ],
    function (Main) {
        return new function () {
            var self = this;

            /**
             * The current selected object
             * @type {Box}
             */
            self.selected = null;


            /**
             * Does a raytrace to find the object currently hit
             * @returns {Entity} The hit entity
             */
            self.getHit = function () {
                Main.raycaster.setFromCamera(self.mouse, self.camera);
                var intersects = self.raycaster.intersectObjects(world.objects);

                if (intersects.length > 0) {
                    return intersects[0];
                }

                return null;
            }
        };
    }
);